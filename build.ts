// Static site generator for mojobyexample.com.
// Renders examples/*.md into dist/ with a small Mojo syntax highlighter.
// Run: bun build.ts

import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://mojobyexample.com";

// Bump when examples have been re-verified against a new toolchain.
const MOJO_VERSION = "1.0";

const ROOT = import.meta.dir;
const EXAMPLES_DIR = join(ROOT, "examples");
const STATIC_DIR = join(ROOT, "static");
const DIST = join(ROOT, "dist");

const KEYWORDS = new Set([
  "def", "var", "mut", "imm", "out", "deinit", "ref", "struct", "trait",
  "raises", "if", "elif", "else", "for", "while", "in", "break", "continue",
  "return", "import", "from", "comptime", "pass", "try", "except", "and",
  "or", "not", "as", "is", "self", "Self", "True", "False", "None",
]);

const TYPES = new Set([
  "Int", "UInt", "UInt8", "Int32", "Float32", "Float64", "Bool", "String",
  "StringSlice", "StaticString", "List", "Dict", "Set", "Optional", "Variant",
  "SIMD", "Scalar", "DType", "Span", "Error", "Pointer", "UnsafePointer",
  "AnyType", "Copyable", "Movable", "ImplicitlyCopyable", "Writable", "Writer",
  "Equatable", "Hashable", "Iterable", "Iterator", "Origin", "Some", "Codepoint",
  "FloatLiteral", "IntLiteral",
]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TOKEN_RE = /("(?:[^"\\\n]|\\.)*")|(#[^\n]*)|(\b\d[\w.]*\b)|([A-Za-z_][A-Za-z0-9_]*)/g;

function highlightMojo(src: string): string {
  let out = "";
  let last = 0;
  for (const m of src.matchAll(TOKEN_RE)) {
    const idx = m.index!;
    out += escapeHtml(src.slice(last, idx));
    const [full, str, comment, num, ident] = m;
    if (str !== undefined) {
      out += `<span class="tok-str">${escapeHtml(str)}</span>`;
    } else if (comment !== undefined) {
      out += `<span class="tok-com">${escapeHtml(comment)}</span>`;
    } else if (num !== undefined) {
      out += `<span class="tok-num">${escapeHtml(num)}</span>`;
    } else if (ident !== undefined) {
      if (KEYWORDS.has(ident)) out += `<span class="tok-kw">${ident}</span>`;
      else if (TYPES.has(ident)) out += `<span class="tok-type">${ident}</span>`;
      else out += escapeHtml(ident);
    }
    last = idx + full.length;
  }
  out += escapeHtml(src.slice(last));
  return out;
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, (_, c: string) => `<code>${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

// Minimal markdown renderer covering the subset used by examples:
// headings, paragraphs, lists, fenced code, inline code/bold/links.
function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let para: string[] = [];
  let list: string[] | null = null;
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html += `<p>${inline(para.join(" "))}</p>\n`;
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      html += `<ul>\n${list.map((li) => `  <li>${inline(li)}</li>`).join("\n")}\n</ul>\n`;
      list = null;
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
  };

  for (const line of lines) {
    if (inCode) {
      if (line.trimStart().startsWith("```")) {
        const code = codeBuf.join("\n");
        if (codeLang === "text") {
          html += `<figure class="output"><figcaption>Output</figcaption><pre class="out">${escapeHtml(code)}</pre></figure>\n`;
        } else {
          html += `<figure class="snippet"><pre class="code">${highlightMojo(code)}</pre></figure>\n`;
        }
        inCode = false;
        codeBuf = [];
      } else {
        codeBuf.push(line);
      }
      continue;
    }
    if (line.trimStart().startsWith("```")) {
      flushAll();
      inCode = true;
      codeLang = line.trim().slice(3).trim();
      codeBuf = [];
      continue;
    }
    const h1 = line.match(/^# (.*)/);
    if (h1) {
      flushAll();
      html += `<h1>${inline(h1[1])}</h1>\n`;
      continue;
    }
    const h2 = line.match(/^## (.*)/);
    if (h2) {
      flushAll();
      html += `<h2>${inline(h2[1])}</h2>\n`;
      continue;
    }
    const li = line.match(/^- (.*)/);
    if (li) {
      flushPara();
      if (!list) list = [];
      list.push(li[1]);
      continue;
    }
    if (!line.trim()) {
      flushAll();
      continue;
    }
    para.push(line.trim());
  }
  flushAll();
  return html;
}

type Example = { slug: string; num: string; title: string; description: string; body: string };

function stripMarkdown(s: string): string {
  return s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
}

function loadExamples(): Example[] {
  return readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const md = readFileSync(join(EXAMPLES_DIR, file), "utf8");
      const title = md.match(/^# (.*)$/m)![1];
      const firstPara = md.match(/^# .*\n\n([^\n]+)/)?.[1] ?? "";
      const description = stripMarkdown(firstPara).slice(0, 160);
      const m = file.match(/^(\d+)-(.*)\.md$/)!;
      return { num: m[1], slug: m[2], title, description, body: renderMarkdown(md) };
    });
}

const DEFAULT_DESCRIPTION =
  "Learn the Mojo programming language through annotated example programs. Short, runnable, and verified against a real Mojo toolchain.";

const DISCLAIMER = `<footer>
<p>Examples verified against Mojo ${MOJO_VERSION}. Mojo by Example is an independent community project and is not affiliated with, sponsored by, or endorsed by Modular Inc.</p>
<p>Mojo is a trademark of Modular Inc. Site content is MIT-licensed; <a href="https://github.com/nijaru/mojobyexample">source on GitHub</a>.</p>
</footer>`;

function sidebar(examples: Example[], active: string | null): string {
  const items = examples
    .map(
      (e) =>
        `<a href="/${e.slug}/"${e.slug === active ? ' class="active"' : ""}><span class="num">${e.num}</span>${e.title}</a>`,
    )
    .join("\n");
  return `<label class="nav-toggle-label" for="nav-toggle">Examples</label>
<input type="checkbox" id="nav-toggle" class="nav-toggle">
<aside class="sidebar">
  <a class="brand" href="/"><span class="flame"></span><strong>mojo</strong><span>by example</span></a>
  <div class="nav-label">Examples</div>
  <nav class="nav">
${items}
  </nav>
</aside>`;
}

function page(
  examples: Example[],
  active: string | null,
  title: string,
  description: string,
  path: string,
  body: string,
): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${path}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/style.css">
</head>
<body>
${sidebar(examples, active)}
<main class="content">
<div class="prose">
${body}
${DISCLAIMER}
</div>
</main>
</body>
</html>
`;
}

function examplePage(examples: Example[], e: Example, i: number): string {
  const prev = examples[i - 1];
  const next = examples[i + 1];
  let pager = "";
  if (prev || next) {
    pager = `<div class="pager">${
      prev
        ? `<a href="/${prev.slug}/" class="prev"><span class="dir">&#8592; Previous</span><span class="title">${prev.title}</span></a>`
        : "<span></span>"
    }${
      next
        ? `<a href="/${next.slug}/" class="next"><span class="dir">Next &#8594;</span><span class="title">${next.title}</span></a>`
        : ""
    }</div>`;
  }
  return page(
    examples,
    e.slug,
    `${e.title} — Mojo by Example`,
    e.description || DEFAULT_DESCRIPTION,
    `/${e.slug}/`,
    e.body + pager,
  );
}

function homePage(examples: Example[]): string {
  const toc = examples
    .map((e) => `<a href="/${e.slug}/"><span class="num">${e.num}</span>${e.title}</a>`)
    .join("\n");
  const body = `<div class="hero">
<h1>Mojo by Example</h1>
<p class="tagline">Learn the Mojo programming language through annotated example programs. Short, runnable, and verified against a real Mojo toolchain. Covers Mojo ${MOJO_VERSION} — nothing here teaches pre-1.0 syntax.</p>
</div>
<p>Mojo is a systems programming language built for high-performance code — Python-like ergonomics with the control of a systems language: ownership you can reason about, compile-time metaprogramming, SIMD as a first-class type, and no hidden runtime.</p>
<p>Each example below is a complete, runnable program. The code does the talking; run <code>mojo run</code> yourself to follow along.</p>
<h2>Examples</h2>
<div class="toc">
${toc}
</div>
<h2>Going further</h2>
<ul>
<li><a href="https://docs.modular.com/mojo/">Official Mojo documentation</a></li>
<li><a href="https://docs.modular.com/mojo/std/">Mojo standard library reference</a></li>
<li><a href="https://github.com/nijaru/mojobyexample">Contribute an example on GitHub</a></li>
</ul>`;
  return page(examples, null, "Mojo by Example", DEFAULT_DESCRIPTION, "/", body);
}

const examples = loadExamples();

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, "index.html"), homePage(examples));
for (let i = 0; i < examples.length; i++) {
  const dir = join(DIST, examples[i].slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), examplePage(examples, examples[i], i));
}
cpSync(STATIC_DIR, DIST, { recursive: true });

const urls = ["/", ...examples.map((e) => `/${e.slug}/`)];
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}\n</urlset>\n`,
);

console.log(`built ${examples.length} example pages into dist/`);
