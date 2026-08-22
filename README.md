# Mojo by Example

An independent, community-maintained tutorial that teaches the
[Mojo](https://www.modular.com/mojo) programming language through annotated
example programs — in the spirit of gobyexample.com.

> **Disclaimer:** This is an unofficial community project. It is not
> affiliated with, sponsored by, or endorsed by Modular Inc. Mojo is a
> trademark of Modular Inc. All example code here is original and MIT-licensed.

## Structure

- `examples/` — one Markdown file per example. Numbered filenames define the
  site order. Each file contains prose and one or more ` ```mojo ` code
  blocks, each followed by a ` ```text ` block with that program's exact
  output.
- `build.ts` — zero-dependency Bun script that renders the examples into a
  static site in `dist/` (includes a small Mojo syntax highlighter).
- `verify.ts` — extracts every code/output pair, runs each program with
  `mojo run`, and checks the output against the paired ` ```text ` block.
- `static/` — stylesheet and favicon copied into `dist/`.

## Development

```sh
bun install        # no dependencies today, but keeps bun happy
bun run verify     # run every example with mojo and diff its output
bun run build      # generate dist/
bun x serve dist   # or any static file server, to preview
```

The examples cover **Mojo 1.0** and deliberately exclude pre-1.0 syntax
(`fn`, `alias`, `owned`, `@parameter`, …), which was removed in 1.0. They are
only verified against the Mojo version this machine has installed
(`mojo --version`). When Mojo changes, run `bun run verify`, fix what broke,
and bump `MOJO_VERSION` in `build.ts`.

## Adding an example

1. Add `examples/NN-slug.md` with the next number in sequence.
2. Run `bun run verify` and make the program's real output match the
   ` ```text ` block.
3. `bun run build` and check the rendered page.

## Deploy

The site is fully static. On Cloudflare Pages:

- Build command: `bun run build`
- Output directory: `dist`

or `npx wrangler pages deploy dist`.

## License

MIT — see [LICENSE](LICENSE).
