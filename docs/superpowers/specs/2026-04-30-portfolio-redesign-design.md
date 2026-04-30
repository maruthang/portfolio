# Portfolio Redesign — Design Spec

**Date:** 2026-04-30
**Author:** Maruthan G (with Claude)
**Status:** Approved (Part 1 + Part 2)
**Approach:** Surgical polish + signature moments (Approach 1 of three explored)

---

## 1. Goal

Transform the portfolio from "looks normal" to "professional and catchy" without losing the hardened technical foundation already in place (security headers, a11y, tests, sitemap, error pages, ESLint in CI).

The redesign is a **polish pass with three intentional creative moments**, not a rebuild. Existing routes and infra stay; gimmicks are removed and replaced with deliberate signature pieces.

## 2. Audience

The site must convert across four personas simultaneously:

1. **Hiring managers / engineering leaders** at top product companies (FAANG, Vercel, Linear, Stripe-tier)
2. **Tech recruiters and EMs** at fast-growing startups / scale-ups
3. **Freelance / contract clients** — founders, agencies, CTOs evaluating for project work
4. **OSS community + dev tooling companies** — folks who care about contribution depth

The common conversion levers across all four: **trust signals, proof of work, clarity of positioning, easy contact path**.

## 3. Aesthetic direction

**Expressive-creative**, restrained enough to read serious. Three.js touches, scroll choreography, distinct moments — but every animated element earns its budget. Three loud moments, the rest calm and content-first.

Anti-pattern: "designer cosplay" portfolios where five micro-interactions compete with each other and none is memorable.

## 4. Strategic changes

### 4.1 Cuts (remove or radically scale back)

| Cut                                | Why                                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `CustomCursor` component           | Accessibility hazard, breaks expected pointer affordances, reads as designer-cosplay to senior engineers                                |
| `BootLoader` component             | Even sessionStorage-gated, adds perceived load on first paint and reads gimmicky on a CV-tier site                                      |
| `Typewriter` cycling roles in Hero | Overused trope. Cycling "Full Stack Developer / OSS Contributor / Bug Hunter / Tooling Builder" dilutes positioning — pick one identity |
| Multi-palette `ThemePalette`       | Keep light/dark toggle only. Multiple palettes signal "I made this for me," not for the visitor                                         |
| "2+ Years professional" stat       | Subtracts credibility for senior audiences. Drop                                                                                        |
| Existing `HeroBackground`          | Replace with the signature WebGL moment (§5.1)                                                                                          |

**Files affected:**

- Delete: `src/design-system/components/CustomCursor.tsx`, `BootLoader.tsx`, `Typewriter.tsx`
- Reduce: `src/design-system/components/ThemePalette.tsx` → keep only the light/dark toggle, remove palette switcher UI
- Update: `src/content/stats.ts` (drop years stat), `src/sections/Hero.tsx` (drop typewriter, drop ROLES array), `src/app/layout.tsx` (drop CustomCursor + BootLoader imports/mounts)

### 4.2 Adds

| Add                                                                 | Why                                                                                    |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Hero shader background (signature moment 1)                         | Earns the "ships UI as well as backend" claim with one polished piece                  |
| OSS contribution constellation on `/oss` (signature moment 2)       | The portfolio's most-shared screenshot. 9 repo nodes, 57 PRs orbiting, click-to-filter |
| Scroll-driven case study reveals (signature moment 3)               | Sticky title + parallax tech chips + syntax-highlighted code reveals on intersection   |
| `/writing` route + 3 initial posts                                  | Long-tail SEO + signals communication skill to all four audiences                      |
| `/public/resume.pdf` linked from About + Footer                     | Recruiters need a download path                                                        |
| Per-route OG images via `next/og`                                   | Better link-share previews for case studies and writing posts                          |
| JSON-LD structured data (`Person`, `BreadcrumbList`, `BlogPosting`) | SEO + LLM discovery                                                                    |
| Single condensed Hero value prop                                    | 5-second test pass                                                                     |
| Reframed Tech Stack: grouped by purpose                             | Reads as senior, not bootcamp checklist                                                |
| Trimmed Featured Projects on home: 3–4, not 6                       | Forces selection signal; full list lives on `/projects`                                |
| Optional Cal.com scheduling link in Contact                         | Lower-friction CTA for freelance clients                                               |

## 5. The three signature moments

### 5.1 Hero shader background

- **Tech**: `react-three-fiber` (r3f) + `three`, single full-bleed shader plane
- **Visual**: soft particle field over a slow gradient base — calm, ambient, no harsh edges (selected over signed-distance-field and pure noise variants for legibility + lowest implementation cost)
- **Behavior**:
  - Slow ambient drift (uniform-driven, ~0.2× viewport per second)
  - Mild cursor parallax (offset shader uniforms based on cursor position)
  - Pauses (cancelAnimationFrame) when out of viewport via IntersectionObserver
  - Hard-disabled under `prefers-reduced-motion: reduce` — falls back to a static gradient
- **Constraints**: ≤150 LOC, ≤30 KB gzipped after r3f; fps target 60 on mid-range mobile
- **Files**: `src/design-system/visuals/HeroShader.tsx` (new), replaces `HeroBackground.tsx`

### 5.2 OSS contribution constellation on `/oss`

- **Tech**: r3f canvas (orthographic camera, 2D-ish) — reuses the r3f bundle from §5.1
- **Layout**: 9 repo nodes (NestJS, VS Code, undici, BullMQ, Node.js, etc.) positioned on a fixed ring (deterministic, predictable). PRs orbit their parent repo node in soft elliptical paths (Kepler-like, varying eccentricity per PR for visual interest)
- **Interaction**:
  - Hover repo node → other repos fade to 30% opacity, related PRs highlight
  - Click repo node → the searchable table below filters to that repo (drives existing `OssPrTable` filter)
  - Hover PR node → tooltip with PR title + link
- **Why deterministic, not force-directed**: looks the same, ~10× simpler, more predictable on mobile, no physics jitter
- **Reduced motion**: orbits stop, layout stays
- **Files**: `src/design-system/visuals/OssConstellation.tsx` (new), wired into `src/app/oss/page.tsx`

### 5.3 Scroll-driven case study reveals (Phase 2)

- **Tech**: Framer Motion (already installed) + `react-intersection-observer`
- **Behavior on `/projects/[slug]`**:
  - `ProjectHero` becomes sticky during the first scroll panel
  - Tech chips fan in from the side on first visibility
  - First code block reveals (fade + small y-translate) on intersection
  - Section headers slide in subtly
- **Reduced motion**: all reveals become instant, no transforms
- **Files**: update `src/design-system/components/ProjectHero.tsx` and `MDXContent.tsx`

## 6. Case study format (no-metrics version)

Every `/projects/[slug]` MDX file follows the same skeleton:

1. **Context** — domain, who used it, what problem it solved
2. **My role** — explicit scope: "owned end-to-end" / "led X module" / "contributed to Y"
3. **Architecture** — system diagram or labeled component breakdown, data flow
4. **Key technical decisions** (3–5) — each as a trade-off mini-story
   - e.g., "Why BullMQ over Celery", "Why CASL over a roles table", "Why Keycloak SSO over Auth0"
5. **Constraints I worked under** — team size, deadline, infra limits, compliance
6. **What I'd do differently** — credibility signal
7. **Tech stack** (full list)

This frame is what FAANG/Stripe-tier engineers actually read. It substitutes "engineering thinking visible" for "metrics I can't quote."

**Action:** rewrite all 6 existing MDX case studies (`src/content/projects/*.mdx`) to this skeleton. Reuse current content where it fits; expand "Key decisions" sections with material from `projects.ts` summaries.

## 7. Content rewrites

| Section                     | Change                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero**                    | One identity sentence, no cycling. Sharper sub-line. CTA stack: View work / Get in touch / Email                                                                               |
| **About**                   | "What I ship" + "What I make better" two-paragraph structure. Drop "Years professional" stat. Add explicit **"Available for: open to full-time roles and contract work"** line |
| **TechStack**               | Group by purpose: **Backend**, **Frontend**, **Mobile**, **Data & Infra**                                                                                                      |
| **FeaturedProjects (home)** | 3–4 only: B2B Marketplace, Sales Analytics, Conversational Commerce Bot, Fitness Ecosystem. Full 6 stay on `/projects`                                                         |
| **OSSPreview (home)**       | Drop preview-table (competes with `/oss`). Replace with 3 hero PRs as quote cards (one VS Code, one NestJS, one undici/BullMQ) + "View all 57 →" CTA to `/oss`                 |
| **Contact**                 | Keep form (already hardened). Add Cal.com placeholder link. URL filled at launch                                                                                               |

**Hero copy draft:**

> Full-stack developer building production B2B systems and contributing to the dev tools I use every day.
>
> Currently at Finstein, shipping NestJS + Next.js + React Native. Off-hours, 57 merged PRs across VS Code, NestJS, Node.js undici, BullMQ.

## 8. Information architecture (final)

```
/                       Hero, About, TechStack, FeaturedProjects (3–4),
                        OSSPreview (3 PRs), Contact
/projects               All 6, filterable
/projects/[slug]        Case study (new format, §6)
/oss                    Constellation + searchable PR table
/writing                Index of posts (ordered by date desc)
/writing/[slug]         MDX post
```

No `/uses`, no `/now`, no `/api/og` page (OG images are route-segment files).

## 9. Technical additions

- **`/writing` route**:
  - MDX-rendered via existing `next-mdx-remote` + `rehype-pretty-code`
  - Frontmatter: `title`, `description`, `date`, `readingTime` (computed)
  - List page sorts by date desc; each post links to `/writing/[slug]`
- **3 initial posts** (titles to confirm during implementation):
  - "What 57 OSS PRs taught me about reading other people's code"
  - "Why I picked BullMQ over Celery for a NestJS analytics platform"
  - "Shipping a WhatsApp commerce bot: HMAC, idempotency, and conversation state"
- **Resume PDF**: `/public/resume.pdf` — Maruthan provides the file; spec links it from About + Footer
- **Per-route OG images**: `opengraph-image.tsx` route segment files using `next/og` for:
  - `/projects/[slug]` (project title + tech stack chips)
  - `/writing/[slug]` (post title + date)
  - Static fallback `/opengraph-image.png` for `/`
- **JSON-LD**: `<script type="application/ld+json">` blocks
  - `Person` schema in root layout
  - `BlogPosting` on each writing post
  - `BreadcrumbList` on case studies + writing posts
- **Cal.com link**: placeholder in `src/content/contact.ts`, hydrated when Maruthan supplies the URL
- **`prefers-reduced-motion` audit**: every motion piece (Hero shader, constellation orbits, case-study reveals) reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and disables motion

## 10. Out of scope (explicitly NOT doing)

- `/uses` page, `/now` page
- Live GitHub API integration — PR data stays static in `src/content/oss.ts`; refresh manually when adding new PRs
- CMS for writing — MDX + git is enough
- i18n, comments, newsletter signup
- Per-section custom WebGL — only Hero gets the shader
- Force-directed physics for OSS constellation — deterministic orbits ship instead
- Custom font loading — Geist Sans + Geist Mono stay
- Dark/light theme reinvention — only the multi-palette switcher is removed; existing toggle stays
- Lighthouse CI integration (manual checks at the end of each phase)
- Image / screenshot capture for case studies (current MDX is text-only; add later if desired)

## 11. Phasing

### Phase 1 — must ship (~5 days)

1. All cuts (CustomCursor, BootLoader, Typewriter, multi-palette, years stat)
2. Hero shader (signature moment 1)
3. OSS constellation (signature moment 2)
4. Content rewrites: Hero, About, TechStack, FeaturedProjects (3–4), OSSPreview (3 PRs), Contact
5. Case study reformat: all 6 MDX files to the new 7-section skeleton
6. Per-route OG images via `next/og`
7. JSON-LD: Person + BreadcrumbList
8. `/public/resume.pdf` link wired up
9. Verification: lint, typecheck, format, unit + e2e, build, manual Lighthouse

### Phase 2 — polish (~2 days, can ship after Phase 1 lands)

1. `/writing` route + index + post template
2. 2–3 initial posts (Maruthan outlines, Claude drafts)
3. Scroll-driven case study reveals (signature moment 3)
4. JSON-LD: BlogPosting on writing posts
5. OG images for `/writing/[slug]`
6. Cal.com link in Contact (when URL is available)

If scope tightens, Phase 2 ships separately without blocking Phase 1.

## 12. Success criteria

- **5-second test**: a cold visitor can describe what Maruthan does after 5 seconds on `/`
- **Memorable moment**: ≥1 element worth a screenshot — target is the OSS constellation
- **Audience pass**: each of the 4 personas finds what they need within 1 click
  - FAANG EM → case studies linked in Hero CTA
  - Scale-up recruiter → resume PDF link in About + Footer
  - Freelance client → contact form + Cal.com link
  - OSS friend → `/oss` linked from nav + OSSPreview
- **Lighthouse**: performance ≥90, a11y 100, best-practices 100, SEO 100
- **Reduced motion**: zero motion plays under `prefers-reduced-motion: reduce`
- **No-JS**: hero, about, projects, OSS table, contact all render meaningfully
- **CI**: typecheck, lint, format, unit tests, e2e, build all green

## 13. Open items (defaults set; override at launch)

- **"Available for" line** → defaulted to: _"open to full-time roles and contract work"_. Override if positioning changes.
- **Cal.com URL** → placeholder; Maruthan supplies before launch.
- **Resume PDF** → Maruthan supplies the binary; spec wires up the link.
- **Writing post titles** → drafts above are starting points; final titles set during Phase 2.
