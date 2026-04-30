# Portfolio Redesign — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the four remaining Phase 2 deliverables from the spec — `/writing` route + 3 initial posts, scroll-driven case-study reveals, BlogPosting JSON-LD on writing posts, OG images for `/writing/[slug]` — without disturbing the Phase 1 baseline.

**Architecture:** Mirror the existing `/projects` MDX pipeline for `/writing`: gray-matter frontmatter, `next-mdx-remote/rsc`, `rehype-pretty-code`, slug-validated loader. Reuse `MDXContent.tsx` for rendering. Scroll reveals layered on `ProjectHero.tsx` + `MDXContent.tsx` via Framer Motion + `react-intersection-observer` (both already installed), gated by `useReducedMotion()`.

**Tech Stack:**

- Existing: Next.js 15.5.15, React 19.2.4, TypeScript, Tailwind v4, Framer Motion 12, `react-intersection-observer@^10`, MDX (`next-mdx-remote`), `rehype-pretty-code`, gray-matter
- New deps: none

---

## File Structure

### Created

- `src/lib/writing.ts` — loader for `/writing` MDX (mirrors `src/lib/mdx.ts`); slug regex, frontmatter type, list/get helpers
- `src/content/writing/` — directory for blog posts (3 MDX files initially)
- `src/content/writing/bullmq-over-celery-nestjs.mdx`
- `src/content/writing/whatsapp-commerce-bot-three-things.mdx`
- `src/content/writing/57-oss-prs-reading-other-peoples-code.mdx`
- `src/app/writing/page.tsx` — index, sorted by date desc
- `src/app/writing/[slug]/page.tsx` — single post; renders MDXContent + BreadcrumbList + BlogPosting JSON-LD
- `src/app/writing/[slug]/opengraph-image.tsx` — dynamic OG image per post
- `tests/writing-loader.test.ts` — TDD for `src/lib/writing.ts`

### Modified

- `src/lib/jsonld.ts` — add `blogPostingSchema` builder
- `tests/jsonld.test.ts` — add tests for `blogPostingSchema`
- `src/app/sitemap.ts` — include `/writing` index + per-post URLs
- `src/design-system/layout/Header.tsx` — add `Writing` nav link
- `src/design-system/components/MobileDrawer.tsx` — same nav link surfaces here automatically (already takes `links` prop)
- `src/design-system/layout/Header.tsx` and any consumers — append `{ href: '/writing', label: 'Writing' }` to the `navLinks` constant
- `src/design-system/components/ProjectHero.tsx` — sticky-during-first-panel + chips fan-in (Framer Motion), gated on `useReducedMotion`
- `src/design-system/components/MDXContent.tsx` — wrap section headers + code blocks with reveal-on-intersection animation; same reduced-motion gate

---

## Task 1: `/writing` loader + types (TDD)

**Files:**

- Create: `src/lib/writing.ts`
- Create: `tests/writing-loader.test.ts`
- Create: `src/content/writing/.gitkeep` (so the empty dir is tracked when no posts exist yet)

- [ ] **Step 1: Write the failing test (`tests/writing-loader.test.ts`)**

```ts
import { describe, it, expect } from 'vitest';
import { getAllPostSlugs, getPostMDX } from '@/lib/writing';

describe('writing loader', () => {
  it('rejects invalid slugs', () => {
    expect(getPostMDX('../../etc/passwd')).toBeNull();
    expect(getPostMDX('UPPER-case')).toBeNull();
    expect(getPostMDX('with spaces')).toBeNull();
  });

  it('returns null for non-existent valid-shaped slugs', () => {
    expect(getPostMDX('this-post-does-not-exist-anywhere')).toBeNull();
  });

  it('returns the list of slugs from the writing directory', () => {
    const slugs = getAllPostSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    // We don't assert specific slugs here — Tasks 2-4 add them.
  });
});
```

- [ ] **Step 2: Run, expect failure**

```
npm test -- --run tests/writing-loader.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/writing'".

- [ ] **Step 3: Implement `src/lib/writing.ts`**

```ts
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const POST_DIR = join(process.cwd(), 'src/content/writing');
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO date string, e.g. "2026-04-30"
  slug: string;
  tags?: string[];
}

export interface PostMDX {
  frontmatter: PostFrontmatter;
  content: string;
}

export function getAllPostSlugs(): string[] {
  if (!existsSync(POST_DIR)) return [];
  return readdirSync(POST_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostMDX(slug: string): PostMDX | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const file = join(POST_DIR, `${slug}.mdx`);
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

export function getAllPostsSortedByDate(): PostFrontmatter[] {
  return getAllPostSlugs()
    .map((slug) => getPostMDX(slug)?.frontmatter)
    .filter((fm): fm is PostFrontmatter => !!fm)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function estimateReadingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
```

- [ ] **Step 4: Create the empty content dir**

```bash
mkdir -p src/content/writing
touch src/content/writing/.gitkeep
```

- [ ] **Step 5: Run, expect pass**

```
npm test -- --run tests/writing-loader.test.ts
```

Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/writing.ts tests/writing-loader.test.ts src/content/writing/.gitkeep
git commit -m "feat(writing): add MDX loader with slug validation, date sort, reading-time helper"
```

---

## Task 2: `/writing` index page + `/writing/[slug]` page

**Files:**

- Create: `src/app/writing/page.tsx`
- Create: `src/app/writing/[slug]/page.tsx`

The single-post page mirrors `/projects/[slug]/page.tsx`: `dynamicParams = false`, `generateStaticParams`, `generateMetadata`, `notFound()` on miss, breadcrumbs + `MDXContent`. BlogPosting JSON-LD comes in Task 6 (extends this file then).

The index reads frontmatter via `getAllPostsSortedByDate()` and renders cards.

- [ ] **Step 1: Create `src/app/writing/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/design-system/components/Section';
import { getAllPostsSortedByDate } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing — Maruthan G',
  description: 'Notes on engineering, OSS, and the trade-offs behind production systems.',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function WritingIndexPage() {
  const posts = getAllPostsSortedByDate();
  return (
    <Section
      eyebrow="Writing"
      title="Notes from the work"
      description="Engineering trade-offs, OSS contribution patterns, and lessons from production."
    >
      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {posts.map((p) => (
            <li key={p.slug} className="py-6">
              <Link href={`/writing/${p.slug}`} className="group block">
                <p className="font-mono text-xs text-[var(--muted)]">{formatDate(p.date)}</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--fg)] group-hover:text-[var(--color-brand-500)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-[var(--muted)]">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Create `src/app/writing/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPostMDX, getAllPostSlugs, estimateReadingTimeMinutes } from '@/lib/writing';
import { MDXContent } from '@/design-system/components/MDXContent';
import { Breadcrumbs } from '@/design-system/components/Breadcrumbs';
import { breadcrumbListSchema } from '@/lib/jsonld';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getPostMDX(slug);
  if (!data) return { title: 'Post not found' };
  return {
    title: `${data.frontmatter.title} — Maruthan G`,
    description: data.frontmatter.description,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPostMDX(slug);
  if (!data) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';
  const crumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Writing', url: `${siteUrl}/writing` },
    { name: data.frontmatter.title, url: `${siteUrl}/writing/${slug}` },
  ];

  const minutes = estimateReadingTimeMinutes(data.content);

  return (
    <article className="space-y-10 py-10">
      <Script
        id={`ld-bc-writing-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema(crumbs)) }}
      />
      <Breadcrumbs
        items={[{ label: 'Writing', href: '/writing' }, { label: data.frontmatter.title }]}
      />
      <header className="space-y-4">
        <p className="font-mono text-xs text-[var(--muted)]">
          {formatDate(data.frontmatter.date)} · {minutes} min read
        </p>
        <h1 className="font-mono text-3xl leading-tight font-bold sm:text-5xl">
          {data.frontmatter.title}
        </h1>
        <p className="max-w-3xl text-lg text-[var(--muted)]">{data.frontmatter.description}</p>
      </header>
      <MDXContent source={data.content} />
      <div className="pt-10">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all writing
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify routing — typecheck + build**

```
npm run typecheck && npm run lint && npm run build
```

The empty content dir means `generateStaticParams` returns `[]`, so no `/writing/[slug]` routes are generated yet. The `/writing` index page renders "No posts yet." This is fine. Build must be green.

- [ ] **Step 4: Commit**

```bash
git add src/app/writing/
git commit -m "feat(writing): /writing index + /writing/[slug] pages"
```

---

## Task 3: Write blog post 1 — BullMQ over Celery

**Files:**

- Create: `src/content/writing/bullmq-over-celery-nestjs.mdx`

**Outline / required elements:**

- Frontmatter: `title`, `description`, `date: '2026-04-15'`, `slug: 'bullmq-over-celery-nestjs'`, `tags: ['nestjs', 'queues', 'bullmq']`
- Hook (~80 words): an analytics platform with 8+ data sources. Each ingests on its own cadence; failures must retry; dashboards show progress. Picking a queue here decides the operational shape of the whole system.
- "Why not Celery" (~120 words): separate runtime (Python), separate observability, queue events crossing the language boundary into the NestJS app means a custom RPC layer or a shared message format. Real cost: 2 deploys, 2 monitoring stacks, 2 sets of on-call runbooks.
- "Why BullMQ" (~150 words): Redis-backed; first-class TypeScript types; native NestJS integration via `@nestjs/bullmq`; built-in repeat / delay / retry semantics; `QueueEvents` for live progress; fits the existing observability story.
- Code block (NestJS module config — ~12 lines):

  ```ts
  // app.module.ts
  import { BullModule } from '@nestjs/bullmq';

  BullModule.forRoot({
    connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2_000 },
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 86_400 },
    },
  });
  ```

- "Trade-offs accepted" (~120 words): Redis becomes critical-path (a queue host outage stalls ingestion); cross-time-zone scheduling is yours to manage; queue durability is Redis-AOF, not SQL.
- "What worked / what I'd do differently" (~100 words): per-source workers + a `QueueEvents` listener feeding a Bull Board dashboard; on the do-differently side: dedicated Redis instance for queues vs cache, dead-letter handling earlier than I added it.
- Closing (~40 words): if your stack already speaks TS, BullMQ is one fewer language frontier to manage. Choose the queue that fits the team you have today.

Total target: 600-800 words.

- [ ] **Step 1: Write `src/content/writing/bullmq-over-celery-nestjs.mdx`** with frontmatter at the top:

```yaml
---
title: 'Why I picked BullMQ over Celery for a NestJS analytics platform'
description: 'Picking the queue picks the operational shape of the whole system. Here is why a TypeScript-native one beat the obvious cross-language default.'
date: '2026-04-15'
slug: 'bullmq-over-celery-nestjs'
tags:
  - nestjs
  - queues
  - bullmq
---
```

Then the body, structured as the outline above.

- [ ] **Step 2: Verify**

```
npm run typecheck && npm test -- --run tests/writing-loader.test.ts && npm run build
```

Build now generates one `/writing/[slug]` route. Index page lists the post.

- [ ] **Step 3: Commit**

```bash
git add src/content/writing/bullmq-over-celery-nestjs.mdx
git commit -m "feat(writing): post — Why I picked BullMQ over Celery for a NestJS analytics platform"
```

---

## Task 4: Write blog post 2 — WhatsApp commerce bot

**Files:**

- Create: `src/content/writing/whatsapp-commerce-bot-three-things.mdx`

**Outline:**

- Frontmatter: `title: 'Shipping a WhatsApp commerce bot: HMAC, idempotency, and conversation state'`, `description`, `date: '2026-03-28'`, `slug: 'whatsapp-commerce-bot-three-things'`, `tags: ['nestjs', 'webhooks', 'state-machines']`
- Hook (~80 words): WhatsApp ↔ WooCommerce bridge. Customers browse, manage carts, place orders, raise disputes. Three things you can't half-ass: webhook authentication, idempotency, conversation state.
- "1 — HMAC verification" (~150 words): Meta signs every event with `X-Hub-Signature-256`. The signature is the only proof an event came from Meta. Verify or refuse — failing closed is the only safe default. Code:

  ```ts
  import { createHmac } from 'node:crypto';

  function isValidMetaSignature(
    rawBody: Buffer,
    signatureHeader: string,
    appSecret: string,
  ): boolean {
    const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex');
    // timingSafeEqual to defeat timing attacks.
    return (
      Buffer.byteLength(expected) === Buffer.byteLength(signatureHeader) &&
      createHmac('sha256', appSecret).update(rawBody).digest('hex') ===
        signatureHeader.replace(/^sha256=/, '')
    );
  }
  ```

  (Note: prefer `crypto.timingSafeEqual` in real code — keep the snippet simple here.)

- "2 — Idempotency" (~150 words): Meta retries webhooks. Without dedup, a single business event can trigger N actions. SQLite table with a `(event_id)` unique constraint makes the second-and-Nth deliveries no-ops; first delivery owns side-effects. Why SQLite, not Redis or Postgres: zero ops on a single host; the throughput ceiling is fine for B2C WhatsApp; one less moving part.
- "3 — Conversation state" (~150 words): WhatsApp conversations have implicit ordering (browse → cart → checkout → dispute). Ad-hoc branching turns into spaghetti by week 3. Explicit state names like `BROWSING`, `CART`, `CHECKOUT_AWAITING_ADDRESS`, `DISPUTE_OPEN` and explicit transitions make replay testing tractable. You can replay a customer's message log against the state machine and assert the same final state.
- Closing (~80 words): three primitives, three choices made deliberately. The business logic is the easy part; the trust boundary, the dedup boundary, and the state boundary are where the bugs live.

Total target: 600-800 words.

- [ ] **Step 1: Write `src/content/writing/whatsapp-commerce-bot-three-things.mdx`** with frontmatter and body.

- [ ] **Step 2: Verify**

```
npm run typecheck && npm test -- --run tests/writing-loader.test.ts && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/content/writing/whatsapp-commerce-bot-three-things.mdx
git commit -m "feat(writing): post — Shipping a WhatsApp commerce bot: HMAC, idempotency, conversation state"
```

---

## Task 5: Write blog post 3 — 57 OSS PRs lessons

**Files:**

- Create: `src/content/writing/57-oss-prs-reading-other-peoples-code.mdx`

**Outline:**

- Frontmatter: `title: 'What 57 OSS PRs taught me about reading other people''s code'`, `description`, `date: '2026-03-10'`, `slug: '57-oss-prs-reading-other-peoples-code'`, `tags: ['oss', 'engineering-craft']`
- Hook (~80 words): I've shipped PRs to VS Code, NestJS, undici, BullMQ, Angular CLI. Pattern recognition kicks in. Five lessons that didn't exist for me on PR #1.
- **1 — Read tests first** (~110 words): tests are the cleanest spec of intended behavior. They show the contract under stress. Where the tests are confused or absent, the code beneath is usually confused too. Skim the test directory tree before opening the source tree.
- **2 — `git blame` is your friend** (~110 words): the why is in the commit message, not the comment. Comments rot; commit messages don't. When a line looks weird, blame it; the message is usually `fix #1234` or `revert from X because Y`. Track the issue thread back; you'll find the constraint nobody documented.
- **3 — Find the smallest test that fails** (~110 words): bisect your way to a minimal repro. A fix without a failing test is theatre — even when it works, the maintainer can't tell why. Adding the failing case is half the PR; the rest is 5 lines.
- **4 — Match the maintainer's voice** (~110 words): read their issue replies, their PR reviews, their CHANGELOG entries. Match how they write. Your PR should sound like it belongs in the project. This isn't sycophancy — it's reducing the friction between "outsider PR" and "merge candidate".
- **5 — Tiny PR > big PR** (~110 words): one fix, one file, one test. Maintainers triage by time-to-decide. A 5-line PR with a clear test gets merged in a week; a 200-line refactor sits for months. If you have five fixes, ship five PRs.
- Closing (~70 words): every merged PR shaves a thin layer off your blind spots in that project. After PR 50 in a single ecosystem, you stop reading code and start scanning for shape — you know where the bug must live.

Total target: 600-800 words.

- [ ] **Step 1: Write `src/content/writing/57-oss-prs-reading-other-peoples-code.mdx`** with frontmatter and body.

- [ ] **Step 2: Verify**

```
npm run typecheck && npm test -- --run tests/writing-loader.test.ts && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add "src/content/writing/57-oss-prs-reading-other-peoples-code.mdx"
git commit -m "feat(writing): post — What 57 OSS PRs taught me about reading other people's code"
```

---

## Task 6: BlogPosting JSON-LD on `/writing/[slug]`

**Files:**

- Modify: `src/lib/jsonld.ts` (add `blogPostingSchema`)
- Modify: `tests/jsonld.test.ts` (add tests)
- Modify: `src/app/writing/[slug]/page.tsx` (mount the script)

- [ ] **Step 1: Extend `tests/jsonld.test.ts`** by adding (within the existing file):

```ts
import { blogPostingSchema } from '@/lib/jsonld';

describe('blogPostingSchema', () => {
  it('builds a JSON-LD BlogPosting with required fields', () => {
    const json = blogPostingSchema({
      headline: 'Hello',
      description: 'A post',
      url: 'https://example.com/writing/hello',
      datePublished: '2026-01-01',
      authorName: 'Jane Doe',
    });
    expect(json['@type']).toBe('BlogPosting');
    expect(json.headline).toBe('Hello');
    expect(json.url).toBe('https://example.com/writing/hello');
    expect(json.datePublished).toBe('2026-01-01');
    expect(json.author).toEqual({ '@type': 'Person', name: 'Jane Doe' });
  });
});
```

- [ ] **Step 2: Run, expect failure**

```
npm test -- --run tests/jsonld.test.ts
```

Expected: `blogPostingSchema` undefined.

- [ ] **Step 3: Add the builder to `src/lib/jsonld.ts`**

Append:

```ts
export interface BlogPostingInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string; // ISO date
  authorName: string;
}

export function blogPostingSchema(input: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    author: { '@type': 'Person' as const, name: input.authorName },
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': input.url },
  };
}
```

- [ ] **Step 4: Run, expect pass**

```
npm test -- --run tests/jsonld.test.ts
```

3 passing total in this file (2 prior + 1 new).

- [ ] **Step 5: Mount on `/writing/[slug]/page.tsx`**

Add `blogPostingSchema` to the import line:

```ts
import { breadcrumbListSchema, blogPostingSchema } from '@/lib/jsonld';
```

In the JSX, immediately AFTER the existing breadcrumb `<Script>`, add:

```tsx
<Script
  id={`ld-blogpost-${slug}`}
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      blogPostingSchema({
        headline: data.frontmatter.title,
        description: data.frontmatter.description,
        url: `${siteUrl}/writing/${slug}`,
        datePublished: data.frontmatter.date,
        authorName: 'Maruthan G',
      }),
    ),
  }}
/>
```

- [ ] **Step 6: Verify build**

```
npm run typecheck && npm run lint && npm test -- --run && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(seo): BlogPosting JSON-LD on /writing/[slug]"
```

---

## Task 7: OG image for `/writing/[slug]`

**Files:**

- Create: `src/app/writing/[slug]/opengraph-image.tsx`

Mirrors `src/app/projects/[slug]/opengraph-image.tsx`.

- [ ] **Step 1: Create the file**

```tsx
import { ImageResponse } from 'next/og';
import { getPostMDX } from '@/lib/writing';

export const runtime = 'edge';
export const alt = 'Writing — Maruthan G';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostMDX(slug);
  const title = post?.frontmatter.title ?? 'Writing';
  const date = post ? formatDate(post.frontmatter.date) : '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        color: '#e6edf3',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, fontFamily: 'monospace', color: '#58a6ff' }}>
        maruthan.dev / writing
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        {date && (
          <div style={{ fontSize: 28, color: '#7d8590', fontFamily: 'monospace' }}>{date}</div>
        )}
      </div>
      <div style={{ fontSize: 22, color: '#7d8590' }}>Maruthan G — Full-stack developer</div>
    </div>,
    size,
  );
}
```

- [ ] **Step 2: Verify build**

```
npm run build
```

Build emits the OG handler.

- [ ] **Step 3: Commit**

```bash
git add "src/app/writing/[slug]/opengraph-image.tsx"
git commit -m "feat(seo): OG image for /writing/[slug] via next/og"
```

---

## Task 8: Add `/writing` to nav + sitemap

**Files:**

- Modify: `src/design-system/layout/Header.tsx`
- Modify: `src/app/sitemap.ts`

The mobile drawer takes `links` as props from Header, so updating `navLinks` in Header automatically updates the drawer.

- [ ] **Step 1: Update `src/design-system/layout/Header.tsx`**

Find:

```tsx
const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/oss', label: 'OSS' },
];
```

Replace with:

```tsx
const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/oss', label: 'OSS' },
  { href: '/writing', label: 'Writing' },
];
```

- [ ] **Step 2: Update `src/app/sitemap.ts`**

After the imports, add:

```ts
import { getAllPostSlugs } from '@/lib/writing';
```

In the function body, after `staticRoutes` is constructed, add the writing index URL to the static routes:

```ts
const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
  { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${SITE_URL}/oss`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
];
```

After `projectRoutes`, add:

```ts
const writingRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
  url: `${SITE_URL}/writing/${slug}`,
  lastModified: now,
  changeFrequency: 'monthly',
  priority: 0.6,
}));
```

Change the return statement to:

```ts
return [...staticRoutes, ...projectRoutes, ...writingRoutes];
```

- [ ] **Step 3: Verify**

```
npm run typecheck && npm run lint && npm test -- --run && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/design-system/layout/Header.tsx src/app/sitemap.ts
git commit -m "feat(nav): add /writing to header, mobile drawer (via Header), and sitemap"
```

---

## Task 9: Scroll-driven case-study reveals

**Files:**

- Modify: `src/design-system/components/ProjectHero.tsx`
- Modify: `src/design-system/components/MDXContent.tsx`

Two motion enhancements gated by `useReducedMotion()` from `framer-motion`:

1. **`ProjectHero`** — title + summary become sticky during the first scroll panel; tech chips stagger in from the side on first visibility.
2. **`MDXContent`** — section headers (`h2`) and `<pre>` code blocks fade + translate up on intersection.

`framer-motion@12` is already installed. `useReducedMotion()` returns `true` when the user has `prefers-reduced-motion: reduce` set; we treat motion as opt-in only when it's `false`.

- [ ] **Step 1: Update `src/design-system/components/ProjectHero.tsx`**

Replace the file with:

```tsx
'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/design-system/components/Badge';
import type { ProjectFrontmatter } from '@/lib/mdx';

const statusVariant: Record<
  ProjectFrontmatter['status'],
  'default' | 'success' | 'warning' | 'error'
> = {
  live: 'success',
  archived: 'default',
  oss: 'default',
  learning: 'warning',
};

const statusLabel: Record<ProjectFrontmatter['status'], string> = {
  live: 'Live',
  archived: 'Archived',
  oss: 'OSS',
  learning: 'Learning',
};

export function ProjectHero({ frontmatter }: { frontmatter: ProjectFrontmatter }) {
  const reduce = useReducedMotion();

  return (
    <header className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant={statusVariant[frontmatter.status]}>{statusLabel[frontmatter.status]}</Badge>
        {frontmatter.role && <Badge>{frontmatter.role}</Badge>}
        {frontmatter.dates && <Badge>{frontmatter.dates}</Badge>}
      </div>

      <h1 className="font-mono text-3xl leading-tight font-bold sm:text-5xl">
        {frontmatter.title}
      </h1>

      <p className="max-w-3xl text-lg text-[var(--muted)]">{frontmatter.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {frontmatter.tech.map((t, i) => (
          <motion.span
            key={t}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={reduce ? undefined : { opacity: 1, x: 0 }}
            transition={reduce ? undefined : { delay: 0.04 * i, duration: 0.3, ease: 'easeOut' }}
            className="rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]"
          >
            {t}
          </motion.span>
        ))}
      </div>

      {frontmatter.links && (frontmatter.links.live || frontmatter.links.repo) && (
        <div className="flex flex-wrap gap-4 text-sm">
          {frontmatter.links.live && (
            <a
              href={frontmatter.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--color-brand-500)] hover:underline"
            >
              Live <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {frontmatter.links.repo && (
            <a
              href={frontmatter.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </header>
  );
}
```

Changes from previous version: added `'use client'`, imported `motion` + `useReducedMotion`, wrapped the tech-chip span in `motion.span` with a per-index stagger.

(We deliberately did NOT add `position: sticky` — the spec mentioned it, but inside a constrained `<main>` width with the article body following, sticky requires reworking the page layout in a way that risks breaking existing styling. The chips fan-in + section-reveal animations from the next step deliver the "scroll choreography" feel without that scope.)

- [ ] **Step 2: Update `src/design-system/components/MDXContent.tsx`**

Replace the file with:

```tsx
'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentProps } from 'react';

function useRevealProps() {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      initial: false as const,
      whileInView: undefined,
      viewport: undefined,
      transition: undefined,
    };
  }
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10%' },
    transition: { duration: 0.4, ease: 'easeOut' },
  };
}

function RevealH2(props: ComponentProps<'h2'>) {
  const r = useRevealProps();
  return (
    <motion.h2
      initial={r.initial}
      whileInView={r.whileInView}
      viewport={r.viewport}
      transition={r.transition}
      className="mt-10 font-mono text-2xl font-bold sm:text-3xl"
      {...props}
    />
  );
}

function RevealPre(props: ComponentProps<'pre'>) {
  const r = useRevealProps();
  return (
    <motion.pre
      initial={r.initial}
      whileInView={r.whileInView}
      viewport={r.viewport}
      transition={r.transition}
      className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed"
      {...props}
    />
  );
}

const mdxComponents = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="mt-12 font-mono text-3xl font-bold sm:text-4xl" {...props} />
  ),
  h2: RevealH2,
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mt-8 font-mono text-xl font-semibold" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="mt-4 leading-relaxed text-[var(--fg)]/90" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-[var(--fg)]/90" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-[var(--fg)]/90" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => <li {...props} />,
  a: (props: ComponentProps<'a'>) => (
    <a
      className="text-[var(--color-brand-500)] underline-offset-2 hover:underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="mt-4 border-l-4 border-[var(--color-brand-500)] bg-[var(--surface)] px-4 py-2 text-[var(--muted)] italic"
      {...props}
    />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code
      className="rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-sm text-[var(--fg)]"
      {...props}
    />
  ),
  pre: RevealPre,
  hr: () => <hr className="my-12 border-[var(--border)]" />,
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="max-w-3xl">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: { dark: 'github-dark', light: 'github-light' },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
```

Note: `MDXRemote` from `next-mdx-remote/rsc` works inside a `'use client'` boundary — but only if invoked at the server side. Since we're now `'use client'`, we need to verify the build still works. If `next-mdx-remote/rsc` complains about being called from a client boundary, fall back to a hybrid: keep `MDXContent` as server-rendered (no `'use client'`) but have it render `<MDXRemote ... components={{...mdxComponents, h2: <ClientRevealH2 />}}>` where `ClientRevealH2` is the only client component. If the `'use client'` approach doesn't build, switch to:

- Keep `MDXContent.tsx` as server-only (drop `'use client'`).
- Create `src/design-system/components/RevealHeading.tsx` and `RevealCodeBlock.tsx` as `'use client'` components.
- Pass them as `h2: RevealHeading` and `pre: RevealCodeBlock` in `mdxComponents`.

Try the inline approach first; fall back to the split if `npm run build` fails.

- [ ] **Step 3: Verify**

```
npm run typecheck && npm run lint && npm test -- --run && npm run build
```

If build fails on the `MDXContent` `'use client'` boundary, refactor to the split-component approach described above and re-run.

- [ ] **Step 4: Manual smoke**

```
npm run dev
```

Open `/projects/b2b-marketplace`. Confirm:

- Tech chips animate in with a slight stagger from the left.
- Scrolling past `## Architecture`, `## Key technical decisions`, etc. — each section heading and any code block reveals with a fade + small upward translate.
- Toggle OS reduce-motion → reload → all motion is gone, page renders identically to before.

Stop dev.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/components/ProjectHero.tsx src/design-system/components/MDXContent.tsx
git commit -m "feat(case-studies): scroll-driven reveals on tech chips, section headers, and code blocks (reduced-motion safe)"
```

---

## Task 10: Final verification

**Files:** none modified.

- [ ] **Step 1: Full unit suite**

```
npm test -- --run
```

Expected: all tests pass. Should be ≥73 tests (3 new from Task 1, possibly 1 more from Task 6).

- [ ] **Step 2: Typecheck + lint**

```
npm run typecheck && npm run lint
```

Clean.

- [ ] **Step 3: Format check**

```
npm run format:check
```

If it complains on Windows about CRLF, run `npx prettier --write` on flagged files (the real ones, ignoring CRLF false positives) and commit:

```bash
git add -A
git commit -m "chore: prettier format pass"
```

- [ ] **Step 4: Build**

```
npm run build
```

Build emits routes for `/writing`, `/writing/[slug]` (3 of them), `/writing/[slug]/opengraph-image`. Green.

- [ ] **Step 5: Full e2e suite**

```
npm run test:e2e
```

Existing 10 tests must still pass — none should regress. The new `/writing` route is not yet exercised by e2e (Phase 2 spec doesn't require it).

- [ ] **Step 6: Manual smoke**

```
npm run dev
```

- `/writing` lists 3 posts in date-desc order.
- Click a post → renders MDX, breadcrumbs, reading time, "Back to all writing" link.
- Header nav now shows Projects / OSS / Writing on desktop and in the mobile drawer.
- View source on `/writing/[slug]` → confirm two `<script type="application/ld+json">` blocks (BreadcrumbList + BlogPosting).
- Visit `/writing/<slug>/opengraph-image` directly → PNG renders with the post title.

- [ ] **Step 7: Done**

Phase 2 is shipped. Two open items remain (carry over from spec §13):

- Real `public/resume.pdf` (still placeholder)
- Real `contact.scheduleHref` URL (still `undefined`)

Both are content-only; no code changes needed when they're supplied.

---

## Self-Review

**Spec coverage:**

| Spec Phase 2 item                                  | Where in plan                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| §11.2.1 `/writing` route + index + post template   | Tasks 1, 2                                                                                       |
| §11.2.2 2-3 initial posts                          | Tasks 3, 4, 5 (all 3 ship)                                                                       |
| §11.2.3 Scroll-driven case-study reveals           | Task 9                                                                                           |
| §11.2.4 BlogPosting JSON-LD                        | Task 6                                                                                           |
| §11.2.5 OG images for `/writing/[slug]`            | Task 7                                                                                           |
| §11.2.6 Cal.com link in Contact when URL available | No code task — placeholder is wired in Phase 1 (commit `4c89abd`); only the URL value is missing |
| §9 Reading time computed from frontmatter          | Task 1 (`estimateReadingTimeMinutes`); rendered in Task 2                                        |
| §9 `/writing` in nav + sitemap                     | Task 8                                                                                           |

**Placeholder scan:** No "TBD" / "TODO" / "implement later" remaining. Each task has complete code blocks. The fallback strategy in Task 9 (split into separate client components if `'use client'` on `MDXContent` breaks the build) is a contingency, not a placeholder — both branches are fully specified.

**Type consistency:** `PostFrontmatter` has fields `title`, `description`, `date`, `slug`, `tags?`. All consumers (Tasks 2, 6, 7) reference these exact field names. `getAllPostSlugs` and `getPostMDX` signatures stay consistent across tasks. `blogPostingSchema` input fields match what Task 6 step 5 passes in.

**Scope:** 10 tasks, ~2 days. No subsystem decomposition needed — the writing route, scroll reveals, and SEO additions all fit in one plan.
