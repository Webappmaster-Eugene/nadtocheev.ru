#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative, isAbsolute } from "node:path";
import { repo, workspace, state, configuredServers, projectSkills, ownHook } from "./harness.mjs";
import { validateNativeReport } from "./native-report.mjs";
import { openAppServer } from "./appserver.mjs";

const report = { timestamp: new Date().toISOString(), configs: [], skills: [], hooks: { data: [] }, mcp: [], failures: ["Native check incomplete"] };
let server;
try {
  server = await openAppServer(workspace);
  const roots = [...new Set([workspace, repo])];
  for (const cwd of roots) {
    const result = await server.rpc("config/read", { cwd, includeLayers: true });
    report.configs.push({ cwd, approval: result.config.approval_policy, permissions: result.config.default_permissions,
      contextWindow: result.config.model_context_window, autoCompactLimit: result.config.model_auto_compact_token_limit,
      mcp: Object.entries(result.config.mcp_servers ?? {}).filter(([, value]) => value.enabled !== false).map(([name]) => name) });
  }
  const skills = await server.rpc("skills/list", { cwds: roots, forceReload: true });
  report.skills = skills.data?.map(item => ({ cwd: item.cwd, errors: (item.errors ?? []).map(() => "skill-load-error"), skills: item.skills.filter(skill => {
    const path = relative(workspace, skill.path);
    return !isAbsolute(path) && path !== ".." && !path.startsWith("../");
  }).map(skill => ({ name: skill.name, enabled: skill.enabled })) }));
  const hooks = await server.rpc("hooks/list", { cwds: roots });
  // Never persist arbitrary global hook commands, server environments or private headers.
  report.hooks.data = hooks.data.map(item => ({ cwd: item.cwd, errors: (item.errors ?? []).map(() => "hook-load-error"),
    hooks: item.hooks.filter(hook => ownHook(hook, roots)).map(hook => ({ eventName: hook.eventName, enabled: hook.enabled, trustStatus: hook.trustStatus })) }));
  const expected = Object.keys(configuredServers());
  const deadline = Date.now() + 65000;
  do {
    report.mcp = [];
    let cursor;
    const seen = new Set();
    do {
      const inventory = await server.rpc("mcpServerStatus/list", { detail: "toolsAndAuthOnly", ...(cursor ? { cursor } : {}) });
      if (!Array.isArray(inventory.data)) throw new Error("Missing MCP inventory");
      report.mcp.push(...inventory.data.map(item => ({ name: item.name, authStatus: item.authStatus, tools: Object.keys(item.tools ?? {}).length })));
      cursor = inventory.nextCursor;
      if (cursor && seen.has(cursor)) throw new Error("Repeated inventory cursor");
      seen.add(cursor);
    } while (cursor);
    // Status reads do not launch retries or OAuth windows. Wait for native startup
    // rather than calling an asynchronously initializing server a failure.
    const starting = expected.filter(name => {
      const item = report.mcp.find(item => item.name === name);
      return !item || item.tools === 0 && item.authStatus !== "notLoggedIn";
    });
    if (!starting.length || Date.now() >= deadline) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  } while (true);
  report.failures = validateNativeReport(report, { cwds: roots, skills: projectSkills(), servers: Object.keys(configuredServers()) });
} catch {
  report.failures = ["Native inventory did not complete; inspect redacted Codex doctor output"];
} finally {
  await server?.close();
  mkdirSync(state, { recursive: true });
  writeFileSync(join(state, "native-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.failures.length ? 1 : 0;
}
