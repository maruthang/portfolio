# portfolio

Personal portfolio for Maruthan G.

- **Live**: https://portfolio-tawny-two-72.vercel.app/
- **Stack**: Next.js 15, React 19, Tailwind v4, TypeScript (strict)
- **Design system**: Token-driven (TS source → CSS variables → Tailwind theme); change one token, propagates everywhere.
- **Tested**: Vitest unit (22 tests) + Playwright e2e (1 smoke test). CI runs typecheck, format, unit, build, e2e on every push.

Implementation plans live in the parent planning repo at [`MaruthanG/MaruthanG/docs/superpowers/plans/`](https://github.com/maruthang/MaruthanG/tree/main/docs/superpowers/plans).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (regenerates `tokens.css` first via `predev`) |
| `npm run build` | Production build (regenerates `tokens.css` first via `prebuild`) |
| `npm run tokens:build` | Regenerate `src/design-system/tokens.css` from TS sources |
| `npm run typecheck` | TypeScript strict check, no emit |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e (builds + serves prod, then runs Chromium) |
| `npm run ladle` | Component preview (Ladle) |
| `npm run ladle:build` | Static build of stories |

### Project layout

```
src/
  app/                       Next.js App Router pages, layout, providers
  design-system/
    tokens/                  TypeScript token sources (single source of truth)
    tokens.css               Generated CSS variables (gitignored)
    utils/cn.ts              clsx + tailwind-merge wrapper
    components/              Button, Card, Badge, ThemeToggle
    layout/                  Header, Footer
    stories/                 Ladle component stories
scripts/
  generate-tokens-css.ts     Token → CSS variable generator
tests/                       Vitest unit + Playwright e2e
```
