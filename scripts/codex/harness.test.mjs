import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import { ensureLink, serverFingerprint, ownHook, hookCommand, workspace, repo } from "./harness.mjs";
import { expandEnvironment, redactProtocol, bridgeServer } from "./mcp.mjs";
import { deniedCommand, kubernetesDeny, kubernetesToolDeny } from "./policy.mjs";
import { handleEvent } from "./hooks.mjs";
import { validateNativeReport } from "./native-report.mjs";

test("sync protects existing user files and remains idempotent for its own links", () => {
  const directory = mkdtempSync(join(tmpdir(), "nadt-harness-test-"));
  try {
    const owner = join(directory, "owner.txt"); writeFileSync(owner, "keep user work");
    assert.throws(() => ensureLink(owner, "target"));
    assert.equal(readFileSync(owner, "utf8"), "keep user work");
    ensureLink(join(directory, "link"), "owner.txt");
    ensureLink(join(directory, "link"), "owner.txt");
    assert.equal(readFileSync(join(directory, "link"), "utf8"), "keep user work");
  } finally { rmSync(directory, { recursive: true }); }
});

test("private environment and headers do not enter generated manifests", () => {
  const fingerprint = serverFingerprint({ fake: { command: "node", args: ["--key", "fake-private-key"], env: { TOKEN: "fake-private-token" }, headers: { Authorization: "fake-private-header" }, url: "https://example.test/mcp?token=fake-private-query" } });
  const text = JSON.stringify(fingerprint);
  for (const value of ["fake-private-key", "fake-private-token", "fake-private-header", "fake-private-query"]) assert.equal(text.includes(value), false);
  assert.deepEqual(fingerprint.fake.envNames, ["TOKEN"]);
});

test("runtime variable interpolation does not discard inherited PATH or copy unresolved placeholders", () => {
  assert.deepEqual(expandEnvironment({ TOKEN: "${TEST_TOKEN}" }, { TEST_TOKEN: "private" }), { TOKEN: "private" });
  assert.throws(() => expandEnvironment({ TOKEN: "${MISSING}" }, {}), /Missing environment variable: MISSING/);
});

test("JSON-RPC redaction preserves IDs and typed data while removing credential strings", () => {
  const value = { jsonrpc: "2.0", id: 123, result: { data: [true, { text: "authorization fake-secret" }] } };
  assert.deepEqual(redactProtocol(value, ["fake-secret"]), { jsonrpc: "2.0", id: 123, result: { data: [true, { text: "authorization [REDACTED]" }] } });
});

test("real child bridge drops non-protocol diagnostics and redacts credentials", async () => {
  const output = new PassThrough(); let text = ""; output.on("data", chunk => { text += chunk; });
  const child = bridgeServer({ command: process.execPath, args: ["-e", 'console.log("private diagnostic fake-secret"); console.error("fake-secret"); console.log(JSON.stringify({jsonrpc:"2.0",id:1,result:{text:process.env.TEST_TOKEN}}));'], env: { ...process.env, TEST_TOKEN: "fake-secret" }, cwd: repo }, output);
  await new Promise((resolve, reject) => { child.once("exit", resolve); child.once("error", reject); });
  assert.equal(text.includes("fake-secret"), false);
  assert.deepEqual(JSON.parse(text), { jsonrpc: "2.0", id: 1, result: { text: "[REDACTED]" } });
});

for (const command of ["kubectl get pods -A", "kubectl --context prod -n ns describe pod example", "kubectl logs pod/example", "kubectl auth can-i create deployments", "kubectl config view", "helm list -A", "helm get values app", "flux get all", "argocd app get app"]) {
  test(`Kubernetes read-only command remains allowed: ${command}`, () => assert.equal(kubernetesDeny(command), null));
}
for (const command of ["kubectl apply -f app.yaml", "kubectl --context prod delete pod example", "kubectl create -f app.yaml --dry-run=server", "kubectl exec example -- sh", "kubectl attach example", "kubectl cp a example:/b", "kubectl run test --image=nginx", "kubectl debug node/example", "kubectl rollout restart deployment/app", "helm upgrade --install app chart --dry-run", "flux reconcile kustomization app", "argocd app sync app"]) {
  test(`Kubernetes mutation is denied independently of full access: ${command}`, () => assert.ok(kubernetesDeny(command)));
}

test("explicit read-only MCP guard and wrapped shell command guard", () => {
  assert.equal(kubernetesToolDeny("mcp__lens__get_pods"), false);
  assert.equal(kubernetesToolDeny("mcp__lens__pod_exec"), true);
  assert.ok(deniedCommand('bash -lc "git -C app reset --hard"', ["git reset --hard*"], "/home/test"));
  assert.ok(deniedCommand("git -C app push --force-with-lease", ["git push --force*"], "/home/test"));
});

test("PreToolUse enforces the owner rule even though OS default permissions are full access", () => {
  const result = handleEvent({ hook_event_name: "PreToolUse", tool_name: "exec_command", tool_input: { cmd: "kubectl --context prod exec pod -- ls" } });
  assert.equal(result.hookSpecificOutput.permissionDecision, "deny");
  assert.deepEqual(handleEvent({ hook_event_name: "PreToolUse", tool_name: "exec_command", tool_input: { cmd: "kubectl get pods" } }), {});
});

test("SessionStart injects full authoritative context and unfinished task state", () => {
  const result = handleEvent({ hook_event_name: "SessionStart" });
  const context = result.hookSpecificOutput.additionalContext;
  assert.ok(context.includes(readFileSync(join(workspace, "CLAUDE.md"), "utf8")));
  assert.ok(context.includes("Обязательное правило пользователя: Kubernetes"));
  assert.ok(context.includes("handoff.md"));
});

test("hook trust is restricted to owned commands from this project's two config files", () => {
  const valid = { source: "project", sourcePath: join(workspace, ".codex/config.toml"), command: hookCommand(), currentHash: "sha256:abc" };
  assert.equal(ownHook(valid), true);
  assert.equal(ownHook({ ...valid, sourcePath: "/other-project/.codex/config.toml" }), false);
  assert.equal(ownHook({ ...valid, command: "other command" }), false);
  assert.equal(ownHook({ ...valid, source: "user" }), false);
});

test("missing native inventory is a failure, never an inferred successful setup", () => {
  const failures = validateNativeReport({}, { cwds: [workspace, repo], skills: ["project-harness"], servers: ["context7"] });
  assert.ok(failures.some(value => value.includes("permissions")));
  assert.ok(failures.some(value => value.includes("skill")));
  assert.ok(failures.some(value => value.includes("hook")));
  assert.ok(failures.some(value => value.includes("MCP")));
});
