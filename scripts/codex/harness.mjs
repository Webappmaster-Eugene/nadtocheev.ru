#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync, readlinkSync, symlinkSync } from "node:fs";
import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { rulesText } from "./policy.mjs";
import { openAppServer } from "./appserver.mjs";

export const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const workspace = existsSync(join(repo, "../CLAUDE.md")) ? dirname(repo) : repo;
export const state = join(workspace, ".codex/state");
const read = path => readFileSync(path, "utf8");
const hash = value => createHash("sha256").update(value).digest("hex");
const q = value => JSON.stringify(value);
const shellQuote = value => "'" + value.replaceAll("'", "'\\''") + "'";
export const hookEvents = ["SessionStart", "SubagentStart", "PreToolUse", "PreCompact", "Stop"];
export const hookCommand = () => [process.execPath, join(repo, "scripts/codex/hooks.mjs")].map(shellQuote).join(" ");

export const roles = {
  "code-mapper": "Изучение архитектуры и зависимостей сайта",
  "content-reviewer": "Согласованность фактов, цен и RU/EN без выдуманных достижений",
  "seo-reviewer": "Canonical, hreflang, sitemap, robots, JSON-LD и GEO",
  "ui-reviewer": "Вёрстка, адаптив, доступность и работа интерфейса",
  "performance-reviewer": "Загрузка, Web Vitals, кеширование и бюджеты",
};

export function run(command, args, cwd = repo, options = {}) {
  return spawnSync(command, args, { cwd, encoding: "utf8", timeout: 30_000, ...options });
}
function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  if (!existsSync(path) || read(path) !== content) writeFileSync(path, content);
}
export function ensureLink(path, target) {
  let info;
  try { info = lstatSync(path); } catch { /* new path */ }
  if (info) {
    if (!info.isSymbolicLink() || readlinkSync(path) !== target) throw new Error(`Existing path is preserved: ${path}`);
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  symlinkSync(target, path);
}
export function projectSkills() {
  const directory = join(workspace, ".agents/skills");
  return readdirSync(directory).filter(name => existsSync(join(directory, name, "SKILL.md"))).sort();
}
function privateJSON(path) {
  try { return JSON.parse(read(path)); } catch { throw new Error(`Invalid local configuration: ${path}`); }
}
export function configuredServers() {
  const result = {};
  const globalClaude = join(homedir(), ".claude.json");
  if (existsSync(globalClaude)) {
    const global = privateJSON(globalClaude).mcpServers ?? {};
    for (const name of ["webstorm", "miro"]) if (global[name]) result[name] = { ...global[name], source: globalClaude };
  }
  for (const path of new Set([join(workspace, ".mcp.json"), join(repo, ".mcp.json"), join(state, "../mcp.local.json")])) {
    if (!existsSync(path)) continue;
    for (const [name, definition] of Object.entries(privateJSON(path).mcpServers ?? {})) result[name] = { ...definition, source: path };
  }
  return result;
}
export function serverFingerprint(servers = configuredServers()) {
  // Private values are consumed only by the runtime bridge, not copied into manifests.
  return Object.fromEntries(Object.entries(servers).map(([name, server]) => [name, {
    command: server.command, argsHash: hash(JSON.stringify(server.args ?? [])), type: server.type,
    urlOrigin: server.url ? new URL(server.url).origin : undefined,
    urlHash: server.url ? hash(server.url) : undefined,
    envNames: Object.keys(server.env ?? {}).sort(), headerNames: Object.keys(server.headers ?? {}).sort(),
  }]));
}
export function sources() {
  const files = [join(workspace, "CLAUDE.md"), join(workspace, "AGENTS.md"), join(repo, "docs/CODEX.md")];
  const walk = directory => {
    if (!existsSync(directory)) return;
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);
      if (item.isDirectory()) walk(path);
      else if (item.isFile()) files.push(path);
    }
  };
  walk(join(repo, "scripts/codex"));
  walk(join(workspace, ".claude/skills"));
  walk(join(workspace, ".agents/skills"));
  return { files: Object.fromEntries(files.filter(existsSync).sort().map(path => [relative(workspace, path), hash(read(path))])), servers: serverFingerprint() };
}
export function configText() {
  let config = read(join(repo, "scripts/codex/config.template.toml"));
  config += `\n[permissions.nadtocheev.workspace_roots]\n${q(workspace)} = true\n`;
  config += `\n[shell_environment_policy.set]\nnpm_config_cache = ${q(join(state, "npm-cache"))}\n`;
  for (const [name, server] of Object.entries(configuredServers())) {
    config += `\n[mcp_servers.${q(name)}]\nenabled = true\nstartup_timeout_sec = 60\ntool_timeout_sec = 120\ndefault_tools_approval_mode = "approve"\n`;
    if (server.url) {
      const url = new URL(server.url);
      if (url.username || url.password || url.search) throw new Error(`Private URL must be handled outside generated config: ${name}`);
      config += `url = ${q(server.url)}\n`;
      if (Object.keys(server.headers ?? {}).length) config += `http_headers_helper = ${q([process.execPath, join(repo, "scripts/codex/mcp.mjs"), "headers", name].map(shellQuote).join(" "))}\n`;
    } else {
      config += `command = ${q(process.execPath)}\nargs = ${q([join(repo, "scripts/codex/mcp.mjs"), "serve", name])}\ncwd = ${q(repo)}\n`;
    }
  }
  for (const event of hookEvents) {
    config += `\n[[hooks.${event}]]\n${event === "PreToolUse" ? 'matcher = "Bash|exec_command|write_stdin|mcp.*"\n' : ""}[[hooks.${event}.hooks]]\ntype = "command"\ncommand = ${q(hookCommand())}\ntimeout = ${event === "PreToolUse" ? 10 : 30}\n`;
  }
  return config;
}

export function sync() {
  if (workspace !== repo) {
    ensureLink(join(repo, ".claude"), "../.claude");
    ensureLink(join(repo, ".agents"), "../.agents");
    ensureLink(join(repo, ".mcp.json"), "../.mcp.json");
    ensureLink(join(repo, ".codex/memory"), "../../.codex/memory");
    ensureLink(join(repo, ".codex/state"), "../../.codex/state");
    ensureLink(join(workspace, ".codex/agents"), "../app/.codex/agents");
    ensureLink(join(workspace, ".codex/context"), "../app/.codex/context");
    ensureLink(join(workspace, ".codex/rules"), "../app/.codex/rules");
  }
  write(join(repo, ".codex/context/CLAUDE.md"), read(join(workspace, "CLAUDE.md")));
  const generated = {};
  const generate = (path, content) => {
    const previousPath = join(repo, ".codex/generated.json");
    const previous = existsSync(previousPath) ? privateJSON(previousPath) : {};
    const full = join(repo, path);
    if (existsSync(full) && previous[path] && hash(read(full)) !== previous[path] && read(full) !== content) throw new Error(`Generated file has local changes: ${path}`);
    write(full, content); generated[path] = hash(content);
  };
  for (const [name, description] of Object.entries(roles)) {
    const prompt = `${description}. Работай только чтением. Соблюдай AGENTS.md и CLAUDE.md; факты о владельце не выдумывать. Findings: severity, confidence, файл:строка и failureScenario. Не редактируй файлы, не выполняй деплой, не меняй Kubernetes. Модель наследуй. Использование делегирования определяется текущими инструкциями, наличие роли само по себе его не разрешает.`;
    generate(`.codex/agents/${name}.toml`, `name = ${q(name)}\ndescription = ${q(description)}\ndeveloper_instructions = ${q(prompt)}\ndefault_permissions = "nadtocheev-review"\n`);
  }
  const config = configText();
  write(join(repo, ".codex/config.toml"), config);
  if (workspace !== repo) write(join(workspace, ".codex/config.toml"), config);
  write(join(repo, ".codex/rules/nadtocheev.rules"), rulesText());
  write(join(repo, ".codex/generated.json"), JSON.stringify(generated, null, 2) + "\n");
  write(join(repo, ".codex/sources.json"), JSON.stringify(sources(), null, 2) + "\n");
  console.log(`Synchronized: full access, ${projectSkills().length} skills, ${Object.keys(roles).length} review roles, ${Object.keys(configuredServers()).length} MCP definitions and context hooks.`);
}

export function doctor() {
  const failures = [];
  const check = (value, message) => { if (!value) failures.push(message); };
  const manifest = join(repo, ".codex/sources.json");
  check(existsSync(manifest) && read(manifest) === JSON.stringify(sources(), null, 2) + "\n", "Harness sources changed: npm run codex:sync");
  for (const root of new Set([workspace, repo])) check(existsSync(join(root, ".codex/config.toml")) && read(join(root, ".codex/config.toml")) === configText(), `Configuration drift: ${root}`);
  const generated = join(repo, ".codex/generated.json");
  check(existsSync(generated), "Generated role manifest missing");
  if (existsSync(generated)) for (const [path, digest] of Object.entries(privateJSON(generated))) check(existsSync(join(repo, path)) && hash(read(join(repo, path))) === digest, `Generated role drift: ${path}`);
  const snapshot = join(repo, ".codex/context/CLAUDE.md");
  check(existsSync(snapshot) && read(snapshot) === read(join(workspace, "CLAUDE.md")), "Context snapshot is stale or missing");
  const ruleFile = join(repo, ".codex/rules/nadtocheev.rules");
  check(existsSync(ruleFile) && read(ruleFile) === rulesText(), "Command guardrails drift: npm run codex:sync");
  for (const name of projectSkills()) {
    const file = join(workspace, ".agents/skills", name, "SKILL.md");
    for (const match of read(file).matchAll(/\]\(([^\s)#]+)(?:#[^\s)]*)?\)/g)) {
      if (!/^[a-z][a-z\d+.-]*:/i.test(match[1])) check(existsSync(resolve(dirname(file), match[1])), `Broken skill reference: ${name}`);
    }
  }
  check(existsSync(join(repo, "node_modules/astro")), "Install site dependencies: npm ci in app/");
  check(existsSync(join(repo, "node_modules/@modelcontextprotocol/sdk")), "Install MCP development SDK");
  check(existsSync(join(workspace, "tools/node_modules/playwright-core")), "Install tools dependencies");
  const [major, minor] = process.versions.node.split(".").map(Number);
  check(major > 22 || major === 22 && minor >= 12, "Node 22.12+ required");
  check(run("codex", ["--version"]).status === 0, "Codex CLI unavailable");
  check(run("git", ["rev-parse", "--is-inside-work-tree"]).stdout?.trim() === "true", "app/ is not a Git repository");
  return failures;
}
export function ownHook(hook, roots = [workspace, repo]) {
  return hook.source === "project" && new Set(roots.map(root => join(root, ".codex/config.toml"))).has(hook.sourcePath)
    && hook.command === hookCommand() && typeof hook.currentHash === "string" && hook.currentHash.startsWith("sha256:");
}
export async function trust() {
  const roots = [...new Set([workspace, repo])];
  const server = await openAppServer(workspace);
  try {
    for (const root of roots) await server.rpc("config/value/write", { keyPath: `projects.${q(root)}.trust_level`, value: "trusted", mergeStrategy: "upsert" });
    const { data } = await server.rpc("hooks/list", { cwds: roots });
    const pending = new Map();
    for (const hook of data.flatMap(item => item.hooks)) if (ownHook(hook, roots) && hook.trustStatus !== "trusted") pending.set(hook.key, hook.currentHash);
    for (const [key, digest] of pending) await server.rpc("config/value/write", { keyPath: `hooks.state.${q(key)}.trusted_hash`, value: digest, mergeStrategy: "upsert" });
    const after = (await server.rpc("hooks/list", { cwds: roots })).data.flatMap(item => item.hooks).filter(hook => ownHook(hook, roots));
    if (after.length !== roots.length * hookEvents.length || after.some(hook => hook.trustStatus !== "trusted")) throw new Error("Own project hooks were not fully loaded and trusted");
    console.log(`Trusted own project hooks: ${after.length}; both workspace entry points are trusted.`);
  } finally { await server.close(); }
}
export async function verify() {
  const failures = doctor();
  if (failures.length) throw new Error(failures.join("\n"));
  const checks = ["codex:test", "check", "test", "test:nginx", "test:visual"];
  const report = { timestamp: new Date().toISOString(), checks: [] };
  mkdirSync(state, { recursive: true });
  for (const name of checks) {
    console.log(`Checking ${name}`);
    const result = run("npm", ["run", name], repo, { timeout: 20 * 60_000, stdio: "inherit", env: { ...process.env, E2E_WORKERS: "1" } });
    report.checks.push({ name, status: result.status });
    write(join(state, "verification.json"), JSON.stringify(report, null, 2) + "\n");
    if (result.status !== 0) { process.exitCode = 1; return; }
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command === "sync") sync();
    else if (command === "trust") await trust();
    else if (command === "verify") await verify();
    else if (command === "doctor") {
      const failures = doctor();
      console.log(failures.length ? failures.join("\n") : "PASS: context, skills, roles, dependencies, configuration and guardrails");
      process.exitCode = failures.length ? 1 : 0;
    } else if (command === "launch") {
      const failures = doctor(); if (failures.length) throw new Error(failures.join("\n"));
      process.exitCode = run("codex", ["-C", workspace, ...args], workspace, { timeout: undefined, stdio: "inherit" }).status ?? 1;
    } else throw new Error("Usage: harness.mjs sync|doctor|trust|verify|launch");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
