#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { doctor, repo, workspace, state, run } from "./harness.mjs";
import { deniedCommand, kubernetesDeny, kubernetesToolDeny } from "./policy.mjs";

const notes = (root, paths, limit = Infinity) => paths.filter(path => existsSync(join(root, path)))
  .map(path => `${path}\n${readFileSync(join(root, path), "utf8").slice(0, limit)}`);
export function handleEvent(event) {
  const name = event.hook_event_name;
  if (name === "SessionStart" || name === "SubagentStart") {
    const paths = [".codex/memory/MEMORY.md", ...(name === "SessionStart" ? [".codex/state/handoff.md"] : [])];
    if (event.source === "compact") paths.push(".codex/state/compact-checkpoint.md");
    const context = [`Workspace: ${workspace}; site Git repository: ${repo}. Instructions below are loaded in full.`,
      ...notes(workspace, ["AGENTS.md"]), ...notes(repo, [".codex/context/CLAUDE.md"]), ...notes(workspace, paths, 20000)].join("\n\n");
    return { hookSpecificOutput: { hookEventName: name, additionalContext: context } };
  }
  if (name === "PreToolUse") {
    const input = event.tool_input ?? {};
    const command = input.command ?? input.cmd ?? input.chars ?? "";
    const kubeRule = kubernetesToolDeny(event.tool_name) ? "Owner rule: Kubernetes is read-only" : kubernetesDeny(command);
    const rule = kubeRule ?? (deniedCommand(command) ? "Command is blocked by existing owner/Claude guardrails" : null);
    if (rule) return { hookSpecificOutput: { hookEventName: name, permissionDecision: "deny", permissionDecisionReason: rule } };
    return {};
  }
  if (name === "PreCompact") {
    const git = (...args) => run("git", args).stdout?.trim() ?? "";
    mkdirSync(state, { recursive: true });
    writeFileSync(join(state, "compact-checkpoint.md"), `# Checkpoint\n\n${new Date().toISOString()}\nBranch: ${git("branch", "--show-current")}\nHEAD: ${git("rev-parse", "--short", "HEAD")}\n\nChanged files:\n${git("status", "--short")}\n\nRead handoff.md for the active goals, progress and next action. No file contents or credentials are checkpointed.\n`);
    return {};
  }
  if (name === "Stop") {
    if (event.stop_hook_active) return { systemMessage: "Report actual remaining limitations and checks; do not repeat the stop loop." };
    const failures = doctor();
    for (const args of [["diff", "--check"], ["diff", "--cached", "--check"]]) if (run("git", args).status !== 0) failures.push(`git ${args.join(" ")} failed`);
    return failures.length ? { decision: "block", reason: `Harness checks require attention:\n${failures.join("\n")}` } : {};
  }
  return {};
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.stdout.write(JSON.stringify(handleEvent(JSON.parse(readFileSync(0, "utf8"))))); }
  catch { process.stdout.write(JSON.stringify({ systemMessage: "Project hook could not complete; run npm run codex:doctor." })); }
}
