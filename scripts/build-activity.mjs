#!/usr/bin/env node
// Aggregates real per-day work activity from git history across all local
// repos into content/activity.json. The site's background grid squares MUST
// trace to this file: real logged work, never painted density.
import { execSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOTS = [join(homedir(), "Documents")];
const MAX_DEPTH = 2;
const repos = [];

function findRepos(dir, depth) {
  if (depth > MAX_DEPTH) return;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  if (entries.includes(".git")) {
    repos.push(dir);
    return;
  }
  for (const e of entries) {
    if (e.startsWith(".") || e === "node_modules") continue;
    const p = join(dir, e);
    try {
      if (statSync(p).isDirectory()) findRepos(p, depth + 1);
    } catch {}
  }
}

ROOTS.forEach((r) => findRepos(r, 0));

const counts = {};
for (const repo of repos) {
  let out;
  try {
    out = execSync("git log --pretty=%ad --date=short", {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    continue;
  }
  for (const line of out.split("\n")) {
    const d = line.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) counts[d] = (counts[d] || 0) + 1;
  }
}

const days = Object.entries(counts)
  .map(([date, count]) => ({ date, count }))
  .sort((a, b) => a.date.localeCompare(b.date));

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "content", "activity.json");
writeFileSync(
  outPath,
  JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), repos: repos.length, days }, null, 2)
);
console.log(`activity.json: ${days.length} active days from ${repos.length} repos`);
