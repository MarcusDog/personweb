import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import Database from "better-sqlite3";

// The visible garden-preview browser must never be used for device emulation.
const script = process.argv[2] || "scripts/garden-enhancement-check.js";
if (!/^scripts[\\/]garden-[\w-]+\.js$/.test(script) || !fs.existsSync(script))
  throw Error("Choose an existing garden check script inside scripts/.");
const session = `garden-headless-${process.pid}`;
const startedAt = Date.now();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aya-browser-check-"));
const config = path.join(temp, "browser.json");
const check = path.join(temp, "check.js");
const recordDir = path.resolve("output/playwright/warm-recording");
if (process.argv.includes("--record"))
  fs.mkdirSync(recordDir, { recursive: true });
fs.writeFileSync(
  config,
  JSON.stringify({
    browser: {
      browserName: "chromium",
      isolated: true,
      launchOptions: { channel: "chrome", headless: true },
      contextOptions: {
        viewport: { width: 1440, height: 1000 },
        ...(process.argv.includes("--record")
          ? {
              recordVideo: {
                dir: recordDir,
                size: { width: 1440, height: 1000 },
              },
            }
          : {}),
      },
    },
  }),
);
// CLI evaluates a function expression; formatters may add a terminal semicolon.
fs.writeFileSync(
  check,
  fs.readFileSync(script, "utf8").trim().replace(/;$/, ""),
);
function cli(args, sensitive = false) {
  const windows = process.platform === "win32";
  const npxEntry = path.join(
    path.dirname(process.execPath),
    "node_modules/npm/bin/npx-cli.js",
  );
  if (windows && !fs.existsSync(npxEntry))
    throw Error("Cannot locate the npm runtime next to Node.js.");
  const command = windows ? process.execPath : "npx";
  const prefix = windows ? [npxEntry] : [];
  const result = spawnSync(
    command,
    [
      ...prefix,
      "--yes",
      "--package",
      "@playwright/cli",
      "playwright-cli",
      `-s=${session}`,
      ...args,
    ],
    { shell: false, encoding: "utf8", stdio: sensitive ? "pipe" : "inherit" },
  );
  if (result.error || result.status !== 0)
    throw Error(
      sensitive
        ? "Local QA authentication failed"
        : `QA command failed (${result.status})`,
    );
}
try {
  cli(["open", "http://localhost:4191/", `--config=${config}`]);
  if (process.argv.includes("--studio")) {
    const password = fs
      .readFileSync("server/data/admin-secret.txt", "utf8")
      .trim();
    const response = await fetch("http://localhost:4191/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || "xiaotian",
        password,
      }),
    });
    const token = response.headers
      .get("set-cookie")
      ?.match(/personweb_session=([^;]+)/)?.[1];
    if (!response.ok || !token) throw Error("Local QA authentication failed");
    cli(
      [
        "cookie-set",
        "personweb_session",
        token,
        "--domain",
        "localhost",
        "--path",
        "/",
        "--httpOnly",
        "--sameSite",
        "Strict",
      ],
      true,
    );
  }
  cli(["run-code", `--filename=${check}`]);
} finally {
  try {
    cli(["close"]);
  } catch {
    /* Browser may have already exited after a failing check. */
  }
  if (script.replaceAll("\\", "/") === "scripts/garden-warm-book-flow.js") {
    const db = new Database(path.resolve("server/data/personweb.db"));
    try {
      const uploads = path.resolve("public/uploads");
      for (const row of db.prepare("SELECT id,data FROM garden_media").all()) {
        const media = JSON.parse(row.data),
          match = /^qa-warm-cover-flow-(\d+)\.webp$/.exec(media.caption || "");
        if (!match || Number(match[1]) < startedAt) continue;
        for (const relative of [media.url, media.original]) {
          if (!relative?.startsWith("/uploads/")) continue;
          const target = path.resolve("public", relative.slice(1));
          if (path.dirname(target) !== uploads)
            throw Error("QA cleanup escaped uploads");
          if (fs.existsSync(target)) fs.unlinkSync(target);
        }
        db.prepare("DELETE FROM garden_media WHERE id=?").run(row.id);
      }
    } finally {
      db.close();
    }
  }
  if (
    script.replaceAll("\\", "/") ===
      "scripts/garden-enhancement-interactions.js" &&
    process.argv.includes("--studio")
  ) {
    const databaseFile = path.resolve("server/data/personweb.db");
    if (fs.existsSync(databaseFile)) {
      const db = new Database(databaseFile);
      try {
        // Delete only messages bearing this exact, dedicated QA identity and body.
        const removed = db
          .prepare(
            "DELETE FROM contacts WHERE role=? AND contact_info=? AND problem=?",
          )
          .run(
            "本地功能验收",
            "qa-local-only@example.test",
            "QA_ENHANCEMENT_PRIVATE：仅用于本地留言功能验收，请忽略。",
          );
        console.log(`Cleaned ${removed.changes} own QA contact message(s).`);
      } finally {
        db.close();
      }
    }
  }
  fs.rmSync(config, { force: true });
  fs.rmSync(check, { force: true });
  fs.rmdirSync(temp);
}
