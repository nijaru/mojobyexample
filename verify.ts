// Verifies every example: extracts the ```mojo and ```text blocks from each
// examples/*.md, runs the program with `mojo run`, and diffs real output
// against the documented output.
// Run: bun verify.ts

import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
const EXAMPLES_DIR = join(ROOT, "examples");
const TMP = join(ROOT, ".tmp");

function extractBlocks(md: string): { mojo?: string; text?: string } {
  const out: { mojo?: string; text?: string } = {};
  const lines = md.split("\n");
  let inCode = false;
  let lang = "";
  let buf: string[] = [];
  for (const line of lines) {
    if (inCode) {
      if (line.trimStart().startsWith("```")) {
        if (lang === "mojo" && !out.mojo) out.mojo = buf.join("\n");
        if (lang === "text" && !out.text) out.text = buf.join("\n");
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
    }
  }
  return out;
}

const files = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith(".md")).sort();
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

let failures = 0;
for (const file of files) {
  const md = readFileSync(join(EXAMPLES_DIR, file), "utf8");
  const { mojo, text } = extractBlocks(md);
  const label = file.replace(/\.md$/, "");
  if (!mojo || !text) {
    console.log(`FAIL ${label}: missing mojo or text block`);
    failures++;
    continue;
  }
  const path = join(TMP, `${label}.mojo`);
  writeFileSync(path, mojo);
  const proc = Bun.spawnSync(["mojo", "run", path], { stdout: "pipe", stderr: "pipe" });
  const got = proc.stdout.toString().trimEnd();
  const expected = text.trimEnd();
  if (proc.exitCode !== 0) {
    console.log(`FAIL ${label}: exit ${proc.exitCode}`);
    console.log(proc.stderr.toString());
    failures++;
  } else if (got !== expected) {
    console.log(`FAIL ${label}: output mismatch`);
    console.log(`--- expected ---\n${expected}\n--- actual ---\n${got}\n`);
    failures++;
  } else {
    console.log(`ok   ${label}`);
  }
}

console.log(failures === 0 ? `\nall ${files.length} examples verified` : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
