// Minimal JSON-RPC client for the installed `codex app-server` (no model turn).
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { stopChild } from "./process.mjs";

export async function openAppServer(cwd, { strict = true, timeoutMs = 60000 } = {}) {
  const child = spawn("codex", ["app-server", "--stdio", ...(strict ? ["--strict-config"] : [])], { cwd, stdio: ["pipe", "pipe", "pipe"] });
  const pending = new Map();
  const notifications = new Set();
  let sequence = 0;
  const failAll = error => { for (const entry of pending.values()) entry.reject(error); };
  // Third-party stderr can contain connection details; never persist it.
  child.stderr.on("data", () => {});
  child.stdin.on("error", failAll);
  child.on("error", failAll);
  child.on("exit", () => failAll(new Error("Codex app-server exited")));
  createInterface({ input: child.stdout }).on("line", line => {
    try {
      const message = JSON.parse(line);
      if (message.method && message.id === undefined) {
        for (const listener of notifications) listener(message);
        return;
      }
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
    } catch { /* Ignore non-protocol output. */ }
  });

  async function rpc(method, params) {
    const id = ++sequence;
    let timer;
    try {
      return await new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout: ${method}`)), timeoutMs);
        pending.set(id, { resolve, reject });
        child.stdin.write(JSON.stringify({ id, method, params }) + "\n");
      });
    } finally { clearTimeout(timer); pending.delete(id); }
  }

  try {
    await rpc("initialize", { clientInfo: { name: "nadtocheev_harness", version: "1.0.0" }, capabilities: { experimentalApi: true } });
    child.stdin.write(JSON.stringify({ method: "initialized" }) + "\n");
  } catch (error) {
    await stopChild(child);
    throw error;
  }
  return { rpc, onNotification: listener => { notifications.add(listener); return () => notifications.delete(listener); }, close: () => stopChild(child) };
}
