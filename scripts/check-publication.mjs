import fs from "node:fs";
import { execFileSync } from "node:child_process";

const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 100 * 1024 * 1024 });
const rules = [
  [
    "GitHub token",
    /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/g,
  ],
  ["API secret", /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{32,}\b/g],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{24,}\b/g],
];
let findings = 0;
const names = git([
  "ls-files",
  "--cached",
  "--others",
  "--exclude-standard",
  "-z",
])
  .split("\0")
  .filter(Boolean);
const forbidden =
  /^(?:server\/data\/|\.env(?:$|\.(?!example$))|output\/|\.playwright-cli\/|\.gstack\/)|(?:^|\/)(?:admin-secret\.txt|[^/]+\.db(?:-wal|-shm)?|[^/]+\.(?:pem|key))$/i;
for (const file of new Set(names)) {
  if (forbidden.test(file)) {
    console.error("PRIVATE FILE:", file);
    findings++;
    continue;
  }
  if (
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile() ||
    fs.statSync(file).size > 4 * 1024 * 1024
  )
    continue;
  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) continue;
  const content = buffer.toString("utf8");
  for (const [name, pattern] of rules) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      console.error("POTENTIAL SECRET:", name, file);
      findings++;
    }
  }
}
// Inspect patches from every retained commit, but never print matched values.
const history = git([
  "log",
  "--all",
  "--format=commit %H",
  "--patch",
  "--no-ext-diff",
]);
for (const [name, pattern] of rules) {
  pattern.lastIndex = 0;
  if (pattern.test(history)) {
    console.error("POTENTIAL HISTORICAL SECRET:", name);
    findings++;
  }
}
if (findings) process.exitCode = 1;
else
  console.log(
    `Publication scan passed: ${new Set(names).size} source/assets paths and retained Git history. No high-confidence secret patterns or private runtime files found.`,
  );
