#!/usr/bin/env node
import { spawn } from "node:child_process";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { configuredServers, repo } from "./harness.mjs";
import { stopChild } from "./process.mjs";

export function expandEnvironment(values, inherited) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).replace(/\$\{([A-Z_][A-Z0-9_]*)\}/g, (_, name) => {
    if (!inherited[name]) throw new Error(`Missing environment variable: ${name}`);
    return inherited[name];
  })]));
}

export function serverCommand(name, server, inherited = process.env) {
  if (!server?.command) throw new Error(`STDIO MCP definition missing: ${name}`);
  // Reuse the existing gh login in memory when GUI-launched Codex has no token env.
  // Do not export credentials globally or write them into project configuration.
  if (name === "github" && !inherited.GITHUB_PERSONAL_ACCESS_TOKEN) {
    let token = inherited.GH_TOKEN || inherited.GITHUB_TOKEN;
    if (!token) {
      const result = spawnSync("gh", ["auth", "token", "--hostname", "github.com"], { encoding: "utf8", timeout: 10000, stdio: ["ignore", "pipe", "pipe"] });
      if (result.status === 0) token = result.stdout.trim();
    }
    if (token) inherited = { ...inherited, GITHUB_PERSONAL_ACCESS_TOKEN: token };
  }
  const chrome = name === "chrome-devtools" && server.args?.some(arg => arg.includes("@anthropic-ai/mcp-chrome-devtools"));
  return {
    command: chrome ? "npx" : server.command,
    args: chrome ? ["-y", "chrome-devtools-mcp@latest", "--autoConnect", "--no-usage-statistics"] : (server.args ?? []),
    cwd: server.cwd ?? repo,
    env: { ...inherited, ...expandEnvironment(server.env ?? {}, inherited), npm_config_cache: join(repo, ".codex/state/npm-cache") },
  };
}

export function redactProtocol(value, secrets) {
  if (typeof value === "string") {
    for (const secret of secrets.filter(Boolean)) value = value.split(secret).join("[REDACTED]");
    return value;
  }
  if (Array.isArray(value)) return value.map(item => redactProtocol(item, secrets));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactProtocol(item, secrets)]));
  return value;
}

export function bridgeServer(spec, output = process.stdout) {
  const secrets = Object.entries(spec.env ?? {}).filter(([key]) => /TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY/i.test(key)).map(([, value]) => value);
  const child = spawn(spec.command, spec.args, { cwd: spec.cwd, env: spec.env, stdio: ["inherit", "pipe", "pipe"] });
  createInterface({ input: child.stdout }).on("line", line => {
    try { output.write(JSON.stringify(redactProtocol(JSON.parse(line), secrets)) + "\n"); }
    catch { /* Non-protocol logs may contain credentials; do not forward them. */ }
  });
  child.stderr.on("data", () => {});
  return child;
}

async function probe(names) {
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
  const { StreamableHTTPClientTransport } = await import("@modelcontextprotocol/sdk/client/streamableHttp.js");
  const report = { timestamp: new Date().toISOString(), servers: [] };
  mkdirSync(join(repo, ".codex/state"), { recursive: true });
  // Invalidate a previous PASS even if reading definitions fails below.
  writeFileSync(join(repo, ".codex/state/mcp-report.json"), JSON.stringify({ ...report, status: "incomplete" }, null, 2) + "\n");
  const servers = configuredServers();
  for (const name of names.length ? names : Object.keys(servers)) {
    const client = new Client({ name: "nadtocheev-codex-doctor", version: "1.0.0" });
    const timeout = setTimeout(() => { void client.close(); }, 60000);
    try {
      const server = servers[name];
      if (!server) throw new Error("Unknown MCP server");
      const transport = server.url
        ? new StreamableHTTPClientTransport(new URL(server.url), { requestInit: { headers: server.headers ?? {} } })
        : new StdioClientTransport({ ...serverCommand(name, server), stderr: "pipe" });
      // Third-party stderr can contain connection credentials; never persist it.
      if (!server.url) transport.stderr?.on("data", () => {});
      await client.connect(transport, { timeout: 55000 });
      const tools = await client.listTools({}, { timeout: 15000 });
      if (!tools.tools.length) throw new Error("Empty MCP tool catalog");
      report.servers.push({ name, status: "connected", tools: tools.tools.map(tool => tool.name) });
      console.log(`${name}: connected, ${tools.tools.length} tools`);
    } catch (error) {
      const auth = /401|403|unauthorized|authentication|oauth/i.test(error.message);
      const status = auth ? "authentication-required" : "unavailable";
      report.servers.push({ name, status });
      console.log(`${name}: ${status}`);
    } finally { clearTimeout(timeout); await client.close().catch(() => {}); }
  }
  mkdirSync(join(repo, ".codex/state"), { recursive: true });
  writeFileSync(join(repo, ".codex/state/mcp-report.json"), JSON.stringify(report, null, 2) + "\n");
  process.exitCode = report.servers.some(server => server.status !== "connected") ? 1 : 0;
}

async function main() {
  const [command, name, ...rest] = process.argv.slice(2);
  if (command === "browser-check") return checkBrowser(name);
  if (command === "probe") return probe([name, ...rest].filter(Boolean));
  const server = configuredServers()[name];
  if (!server) throw new Error(`Unknown MCP server: ${name}`);
  if (command === "headers") { process.stdout.write(JSON.stringify(server.headers ?? {})); return; }
  if (command !== "serve") throw new Error("Usage: mcp.mjs serve|headers NAME, probe [NAME...], or browser-check [NAME]");
  const spec = serverCommand(name, server);
  const child = bridgeServer(spec);
  let stopping = false;
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
    if (stopping) return;
    stopping = true;
    void stopChild(child, signal);
  });
  child.on("error", () => { console.error(`Cannot start MCP server: ${name}`); process.exitCode = 1; });
  child.on("exit", code => { process.exitCode = code ?? 1; });
}

async function checkBrowser(name = "chrome-devtools") {
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
  const client = new Client({ name: "nadtocheev-browser-check", version: "1.0.0" });
  const report = { timestamp: new Date().toISOString(), server: name, status: "unavailable", pages: 0 };
  try {
    const server = configuredServers()[name];
    const transport = new StdioClientTransport({ ...serverCommand(name, server), stderr: "pipe" });
    transport.stderr?.on("data", () => {});
    await client.connect(transport, { timeout: 30000 });
    const result = await client.callTool({ name: "list_pages", arguments: {} }, undefined, { timeout: 60000 });
    if (!result.isError) {
      const text = result.content.filter(item => item.type === "text").map(item => item.text).join("\n");
      report.pages = text.split("\n").filter(line => /^\d+:/.test(line)).length;
      report.status = "connected";
    }
  } catch { /* Persist status only: page URLs and third-party messages may be private. */ }
  finally { await client.close().catch(() => {}); }
  mkdirSync(join(repo, ".codex/state"), { recursive: true });
  writeFileSync(join(repo, `.codex/state/browser-${encodeURIComponent(name)}-report.json`), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
  if (report.status !== "connected") {
    console.error("Browser connection failed. Check the configured profile, remote debugging and the browser consent dialog.");
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => { console.error("MCP operation failed; check local definition and connectivity."); process.exitCode = 1; });
}
