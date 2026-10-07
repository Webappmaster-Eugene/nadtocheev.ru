#!/usr/bin/env node
import { sync, doctor, trust } from "./harness.mjs";
sync();
const failures = doctor();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  await trust();
  console.log("Ready: project configuration and own hooks. Run codex:native-check and codex:mcp-check for live integrations.");
}
