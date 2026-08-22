// Verifies every example: extracts the ```mojo and ```text blocks from each
// examples/*.md, runs the program with `mojo run`, and diffs real output
// against the documented output.
// Run: bun verify.ts

import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
const EXAMPLES_DIR = join(ROOT, "examples");
const TMP = join(ROOT, ".tmp");

type Pair = { mojo: string; text: string };

// A page may contain multiple mojo/text block pairs; each is verified.
function extractPairs(md: string): Pair[] {
  const pairs: Pair[] = [];
  const lines = md.split("\n");
  let inCode = false;
  let lang = "";
  let buf: string[] = [];
  let current: { mojo?: string; text?: string } = {};
  for (const line of lines) {
    if (inCode) {
      if (line.trimStart().startsWith("```")) {
        if (lang === "mojo") current.mojo = buf.join("\n");
        if (lang === "text") current.text = buf.join("\n");
        inCode = false;
        buf = [];
      } else {
        buf.push(line);
      }
      continue;
    }
    if (line.trimStart().startsWith("```")) {
      inCode = true;
      lang = line.trim().slice(3).trim();
      continue;
    }
    // A paragraph between blocks closes the current pair so the next
    // code/text pair starts fresh.
    if ((current.mojo || current.text) && line.trim()) {
      pairs.push(current);
      current = {};
    }
  }
  if (current.mojo || current.text) pairs.push(current);
  return pairs.filter((p) => p.mojo && p.text) as Pair[];
}

const files = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith(".md")).sort();
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

let failures = 0;
for (const file of files) {
  const md = readFileSync(join(EXAMPLES_DIR, file), "utf8");
  const pairs = extractPairs(md);
  const label = file.replace(/\.md$/, "");
  if (pairs.length === 0) {
    console.log(`FAIL ${label}: no mojo/text block pair`);
    failures++;
    continue;
  }
  for (let i = 0; i < pairs.length; i++) {
    const name = pairs.length > 1 ? `${label}[${i + 1}]` : label;
    const path = join(TMP, `${label}-${i}.mojo`);
    writeFileSync(path, pairs[i].mojo);
    const proc = Bun.spawnSync(["mojo", "run", path], { stdout: "pipe", stderr: "pipe" });
    const got = proc.stdout.toString().trimEnd();
    const expected = pairs[i].text.trimEnd();
    if (proc.exitCode !== 0) {
      console.log(`FAIL ${name}: exit ${proc.exitCode}`);
      console.log(proc.stderr.toString());
      failures++;
    } else if (got !== expected) {
      console.log(`FAIL ${name}: output mismatch`);
      console.log(`--- expected ---\n${expected}\n--- actual ---\n${got}\n`);
      failures++;
    } else {
      console.log(`ok   ${name}`);
    }
  }
}

console.log(failures === 0 ? `\nall ${files.length} examples verified` : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
