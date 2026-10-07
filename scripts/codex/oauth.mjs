#!/usr/bin/env node
// One explicit OAuth flow, in local Yandex. Never log authorization/callback URLs.
import { spawnSync } from "node:child_process";
import { openAppServer } from "./appserver.mjs";
import { workspace } from "./harness.mjs";
const name = process.argv[2] ?? "miro";
if (name !== "miro") throw new Error("This helper supports only the configured Miro integration");
const server = await openAppServer(workspace);
let timer;
try {
  const complete = new Promise(resolve => {
    server.onNotification(message => {
      if (message.method === "mcpServer/oauthLogin/completed" && message.params?.name === name) resolve(message.params.success === true);
    });
    timer = setTimeout(() => resolve(false), 300000);
  });
  const result = await server.rpc("mcpServer/oauth/login", { name });
  const url = new URL(result.authorizationUrl);
  if (url.protocol !== "https:" || !(url.hostname === "miro.com" || url.hostname.endsWith(".miro.com"))) throw new Error("Unexpected OAuth authority");
  const opened = spawnSync("/usr/bin/open", ["-a", "Yandex", url.href], { stdio: "ignore", timeout: 10000 });
  if (opened.status !== 0) throw new Error("Could not open local Yandex");
  console.log("Miro authorization opened in local Yandex. Complete the account consent in that window.");
  const success = await complete;
  console.log(success ? "Miro account connected." : "Miro login is pending or did not complete; no retry was started.");
  process.exitCode = success ? 0 : 1;
} catch {
  console.error("OAuth initialization did not complete. Credentials and authorization URLs are omitted.");
  process.exitCode = 1;
} finally { clearTimeout(timer); await server.close(); }
