// Claude Bash deny rules reproduced for Codex: execpolicy rules for exact argv
// prefixes plus a PreToolUse check with Claude's glob semantics. This keeps the
// same guardrails; it is not a shell security boundary.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { repo, workspace } from "./harness.mjs";

// Present even on a machine without the owner's global Claude settings.
const BASELINE = [
  "rm -rf /", "rm -fr /", "rm -rf ~", "rm -fr ~", "rm -rf $HOME", "rm -fr $HOME",
  "git reset --hard*", "git push --force*",
];

export function claudeSettingsPaths(home = homedir()) {
  const paths = [join(home, ".claude/settings.json")];
  for (const root of new Set([workspace, repo])) {
    paths.push(join(root, ".claude/settings.json"), join(root, ".claude/settings.local.json"));
  }
  return paths;
}

export function claudeDenyPatterns(paths = claudeSettingsPaths()) {
  const patterns = new Set(BASELINE);
  for (const path of paths) {
    if (!existsSync(path)) continue;
    let deny;
    try { deny = JSON.parse(readFileSync(path, "utf8")).permissions?.deny; }
    catch { continue; } // A broken private settings file must not leak into hook output.
    for (const rule of Array.isArray(deny) ? deny : []) {
      const match = /^Bash\((.+)\)$/.exec(rule);
      if (match) patterns.add(match[1].trim());
    }
  }
  return [...patterns].sort();
}

const escape = (value) => value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
function matches(command, pattern) {
  // Claude: "prefix*" and "prefix:*" match by prefix, otherwise the whole command.
  const body = pattern.endsWith(":*") ? pattern.slice(0, -2) + "*" : pattern;
  return new RegExp("^" + body.split("*").map(escape).join(".*") + "$").test(command);
}

const WRAPPERS = new Set(["then", "do", "else", "!", "command", "exec", "env", "time", "nohup", "xargs"]);
const SHELL = /^(?:\S*\/)?(?:ba|z)?sh$/;

// Shell words with quotes removed; good enough for guardrails, not a full parser.
function words(text) {
  const result = [];
  let word = null;
  let quote = null;
  for (const char of text) {
    if (quote) {
      if (char === quote) quote = null;
      else word = (word ?? "") + char;
    } else if (char === "'" || char === '"') {
      quote = char;
      word ??= "";
    } else if (/\s/.test(char)) {
      if (word !== null) result.push(word);
      word = null;
    } else word = (word ?? "") + char;
  }
  if (word !== null) result.push(word);
  return result;
}

// Split outside quotes on command separators and substitutions.
function split(text) {
  const parts = [];
  let current = "";
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quote) {
      if (char === quote) quote = null;
      current += char;
    } else if (char === "'" || char === '"') {
      quote = char;
      current += char;
    } else if (char === "$" && text[i + 1] === "(") {
      parts.push(current);
      current = "";
      i++;
    } else if ("\n;|&()`".includes(char)) {
      // `2>&1` and `&>` are redirections, not separators.
      if (char === "&" && (text[i - 1] === ">" || text[i + 1] === ">")) current += char;
      else { parts.push(current); current = ""; }
    } else current += char;
  }
  parts.push(current);
  return parts;
}

// Claude-equivalent spellings of one simple command. Claude patterns are literal
// globs, so `rm -Rf /usr` or `git -C app reset --hard` would slip past them.
function variants(argv, home) {
  const [head, ...rest] = argv;
  const name = head.replace(/^.*\//, "");
  const out = [[name, ...rest].join(" ")];
  if (name === "rm") {
    const flags = rest.filter(word => /^-[A-Za-z]+$/.test(word)).join("");
    const recursive = /[rR]/.test(flags) || rest.includes("--recursive");
    const targets = rest.filter(word => !word.startsWith("-"));
    if (recursive) {
      for (const target of targets) {
        const trimmed = target.replace(/\/\*$/, "").replace(/(.)\/+$/, "$1");
        const homeForms = new Set([target, trimmed]);
        for (const form of [...homeForms]) {
          homeForms.add(form.replace(/^(?:\$HOME|\$\{HOME\})(?=$|\/)/, "~"));
          if (home) homeForms.add(form.replace(new RegExp("^" + escape(home) + "(?=$|/)"), "~"));
        }
        for (const form of homeForms) for (const flag of ["-rf", "-fr", "-r"]) out.push(`rm ${flag} ${form}`);
      }
    }
  }
  if (name === "git") {
    const args = [...rest];
    // Global options before the subcommand, e.g. `git -C app reset --hard`.
    while (args.length && args[0].startsWith("-")) {
      const option = args.shift();
      if (["-C", "-c", "--git-dir", "--work-tree", "--namespace"].includes(option)) args.shift();
    }
    const [sub, ...tail] = args;
    if (sub) out.push(["git", sub, ...tail].join(" "));
    if (sub === "push" && tail.some(word => /^(?:-f|--force(?:-with-lease)?(?:=.*)?|-[A-Za-z]*f[A-Za-z]*)$/.test(word) || /^\+/.test(word))) out.push("git push --force");
    if (sub === "reset" && tail.includes("--hard")) out.push("git reset --hard");
  }
  return out;
}

function commands(text) {
  const result = [];
  for (const raw of split(text)) {
    const argv = words(raw);
    while (argv.length && (WRAPPERS.has(argv[0]) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(argv[0]))) argv.shift();
    if (!argv.length) continue;
    // `bash -lc '<script>'` carries a whole script in one word.
    if (SHELL.test(argv[0]) && /^-\w*c/.test(argv[1] ?? "") && argv[2] !== undefined) result.push(...commands(argv[2]));
    else result.push(argv);
  }
  return result;
}

export function deniedCommand(command, patterns = claudeDenyPatterns(), home = homedir()) {
  if (Array.isArray(command)) {
    // argv form: ["bash", "-lc", "<script>"] carries the script as one element.
    const wrapped = SHELL.test(command[0] ?? "") && /^-\w*c/.test(command[1] ?? "");
    return deniedCommand(wrapped ? String(command[2] ?? "") : command.map(word => /\s/.test(word) ? JSON.stringify(word) : word).join(" "), patterns, home);
  }
  const text = String(command ?? "");
  const candidates = [text.trim(), ...commands(text).flatMap(argv => variants(argv, home))];
  for (const candidate of candidates) {
    const hit = patterns.find(pattern => matches(candidate, pattern));
    if (hit) return hit;
  }
  return null;
}

export function rulesText(patterns = claudeDenyPatterns(), home = homedir()) {
  const rules = new Map();
  for (const pattern of patterns) {
    // A private rule may include an auth argument; the runtime hook still checks it,
    // while the generated public execpolicy must not duplicate its private value.
    if (/token|api[_-]?key|authorization|password|secret|bearer/i.test(pattern)) continue;
    const words = pattern.replace(/:?\*$/, "").trim().split(/\s+/).map(word => word.replace(/\*$/, ""));
    if (!words.length || words.some(word => !word || word.includes("*"))) continue;
    const variants = [words];
    if (words.some(word => word === "~" || word.startsWith("~/"))) variants.push(words.map(word => word.replace(/^~(?=$|\/)/, home)));
    for (const variant of variants) {
      rules.set(JSON.stringify(variant), `prefix_rule(pattern = ${JSON.stringify(variant)}, decision = "forbidden", justification = ${JSON.stringify(`Claude deny rule: Bash(${pattern})`)})`);
    }
  }
  return "# Generated by codex:sync; owner and Claude command guardrails.\n"
    + [...rules.keys()].sort().map(key => rules.get(key)).join("\n") + "\n";
}

// The owner's Kubernetes restriction is independent of OS full access.
export function kubernetesDeny(command) {
  for (const argv of commands(Array.isArray(command) ? command.join(" ") : String(command ?? ""))) {
    const name = (argv[0] ?? "").replace(/^.*\//, "");
    if (!["kubectl", "helm", "flux", "argocd"].includes(name)) continue;
    const args = argv.slice(1);
    const takesValue = new Set(["--context", "--kubeconfig", "--namespace", "-n", "--cluster", "--user", "--server", "-s", "--token", "--request-timeout", "--cache-dir"]);
    while (args[0]?.startsWith("-")) {
      const option = args.shift();
      if (!option.includes("=") && takesValue.has(option)) args.shift();
    }
    const [verb, sub] = args;
    if (name === "kubectl") {
      if (verb === "auth" && sub === "can-i") continue;
      if (verb === "config" && ["view", "get-contexts", "current-context", "get-clusters", "get-users"].includes(sub)) continue;
      if (["get", "describe", "logs", "version", "cluster-info", "api-resources", "api-versions", "explain", "top", "events", "wait", "help"].includes(verb)) continue;
      return "Kubernetes: only information; mutations, exec/attach/cp/run/debug and mutating dry-run are forbidden";
    }
    if (name === "helm" && ["get", "list", "status", "history", "show", "search", "template", "version", "help", "lint"].includes(verb)) continue;
    if (name === "flux" && ["get", "logs", "events", "version", "help", "check"].includes(verb)) continue;
    if (name === "argocd" && (["version", "help"].includes(verb) || (verb === "app" && ["get", "list", "diff", "history"].includes(sub)))) continue;
    return "Kubernetes/Helm/GitOps: mutations are forbidden by the owner's rule";
  }
  return null;
}

export function kubernetesToolDeny(name) {
  const parts = String(name).toLowerCase().split(/[^a-z]+/);
  return parts.some(part => ["kubernetes", "kubectl", "helm", "lens"].includes(part))
    && parts.some(part => ["create", "update", "patch", "delete", "apply", "deploy", "exec", "attach", "cp", "run", "debug", "restart", "scale", "edit"].includes(part));
}
