# Portfolio Redesign — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing portfolio from "looks normal" to "professional and catchy" via targeted cuts, two signature WebGL moments (Hero shader + OSS constellation), content rewrites, case-study reformat, and SEO/discovery polish — without breaking the hardened CI/a11y/security baseline.

**Architecture:** Surgical polish on the existing Next.js 15 + React 19 app. Add `react-three-fiber` for two visuals, preserve all existing routing and infra, lift one piece of `/oss` state into a new `OssExplorer` wrapper to let the constellation drive the PR table filter. No service or schema changes. Per the design spec (`docs/superpowers/specs/2026-04-30-portfolio-redesign-design.md`), Phase 2 (`/writing` route, scroll reveals on case studies) gets its own plan after Phase 1 ships.

**Tech Stack:**
- Existing: Next.js 15.5.15, React 19.2.4, TypeScript, Tailwind v4, Framer Motion 12, MDX (`next-mdx-remote`), `rehype-pretty-code`, Vitest 4, Playwright 1.59
- New deps: `@react-three/fiber@^9`, `three@^0.176`, `@types/three`

---

## File Structure

### Created
- `src/design-system/visuals/HeroShader.tsx` — r3f shader plane that replaces `HeroBackground.tsx`. Owns reduced-motion fallback and IntersectionObserver pause.
- `src/design-system/visuals/OssConstellation.tsx` — r3f canvas: 9 repo nodes on a fixed ring, PRs orbiting on ellipses. Accepts `prs`, `selectedProject`, `onSelectProject` props.
- `src/design-system/components/OssExplorer.tsx` — `'use client'` wrapper that owns `projectFilter` state and composes `OssConstellation` + `OssPrTable`.
- `src/lib/jsonld.ts` — small builder helpers for `Person`, `BreadcrumbList` JSON-LD blocks.
- `src/app/opengraph-image.tsx` — root static OG image (uses `next/og`).
- `src/app/projects/[slug]/opengraph-image.tsx` — dynamic per-project OG image.
- `public/resume.pdf` — placeholder binary; user replaces with real PDF.
- `tests/HeroShader.test.tsx` — RTL test for reduced-motion fallback.
- `tests/OssConstellation.test.tsx` — RTL test for `onSelectProject` callback contract.
- `tests/jsonld.test.ts` — unit tests for the builder helpers.
- `src/lib/oss-positioning.ts` + `tests/oss-positioning.test.ts` — pure ring-position utility for repo nodes (TDD-friendly).

### Modified
- `src/app/layout.tsx` — drop `BootLoader` and `CustomCursor` mounts; add `Person` JSON-LD block.
- `src/app/oss/page.tsx` — replace direct `OssPrTable` with `OssExplorer`; add `BreadcrumbList` JSON-LD.
- `src/app/projects/[slug]/page.tsx` — add `BreadcrumbList` JSON-LD.
- `src/sections/Hero.tsx` — drop `Typewriter` + `ROLES`; new copy; mount `HeroShader` instead of `HeroBackground`.
- `src/sections/About.tsx` — "What I ship" + "What I make better" structure; "Available for" line; resume PDF link.
- `src/sections/TechStack.tsx` — render the regrouped 4-category structure.
- `src/sections/FeaturedProjects.tsx` — uses trimmed featured set.
- `src/sections/OSSPreview.tsx` — replaced with 3-quote-card layout + "View all 57 →" CTA.
- `src/sections/Contact.tsx` — render Cal.com link if `contact.scheduleHref` is set.
- `src/content/stats.ts` — drop years entry.
- `src/content/contact.ts` — add optional `scheduleHref` field.
- `src/content/techStack.ts` — collapse from 6 categories to 4 (Backend, Frontend, Mobile, Data & Infra).
- `src/content/projects.ts` — flip `featured: true` on B2B Marketplace, Sales Analytics, Conversational Commerce Bot, Fitness Ecosystem only (4 of 6).
- `src/content/projects/*.mdx` (all 6) — restructure to the 7-section skeleton from spec §6.
- `src/design-system/components/OssPrTable.tsx` — accept optional controlled `projectFilter` + `onProjectFilterChange`.
- `src/design-system/layout/Header.tsx` — drop `ThemePalette` import + render.
- `src/design-system/layout/Footer.tsx` — add resume PDF link.
- `tests/e2e/home.spec.ts` — h1 still asserts "Maruthan"; remove typewriter assumption.
- `tests/e2e/projects.spec.ts` — update assertions from "problem"/"solution" to "context"/"my role".

### Deleted
- `src/design-system/components/CustomCursor.tsx`
- `src/design-system/components/BootLoader.tsx`
- `src/design-system/components/Typewriter.tsx`
- `src/design-system/components/ThemePalette.tsx`
- `src/design-system/visuals/HeroBackground.tsx`
- `tests/Typewriter.test.tsx`
- `tests/ThemePalette.test.tsx`

---

## Tasks

### Task 1: Install r3f + three dependencies

**Files:**
- Modify: `package.json` (deps + devDeps)
- Modify: `package-lock.json` (auto-updated by npm)

- [ ] **Step 1: Install runtime deps**

```bash
npm install @react-three/fiber@^9.1.4 three@^0.176.0 --no-audit --no-fund
```

Expected: install completes without warnings about peer deps. r3f@9 supports React 19.

- [ ] **Step 2: Install three types as devDep**

```bash
npm install --save-dev @types/three@^0.176.0 --no-audit --no-fund
```

- [ ] **Step 3: Verify typecheck still clean**

```bash
npm run typecheck
```

Expected: no output (clean exit).

- [ ] **Step 4: Verify build still works**

```bash
npm run build
```

Expected: build succeeds, no warnings about r3f.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add react-three-fiber + three for hero shader and oss constellation"
```

---

### Task 2: Remove `CustomCursor`

**Files:**
- Delete: `src/design-system/components/CustomCursor.tsx`
- Modify: `src/app/layout.tsx` (remove import + mount)

No tests exist for `CustomCursor`.

- [ ] **Step 1: Remove the import line in `src/app/layout.tsx`**

Remove this line:

```tsx
import { CustomCursor } from '@/design-system/components/CustomCursor';
```

- [ ] **Step 2: Remove the `<CustomCursor />` mount**

Inside the `<Providers>` block, delete the `<CustomCursor />` line.

- [ ] **Step 3: Delete the component file**

```bash
rm src/design-system/components/CustomCursor.tsx
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint
```

Expected: clean. If anything else imports `CustomCursor`, fix the import here too. Search:

```bash
grep -rn "CustomCursor" src/ tests/ || echo "no references"
```

Expected output: `no references`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove CustomCursor — accessibility hazard, not earning its budget"
```

---

### Task 3: Remove `BootLoader`

**Files:**
- Delete: `src/design-system/components/BootLoader.tsx`
- Modify: `src/app/layout.tsx` (remove import + mount)

No standalone tests for `BootLoader`.

- [ ] **Step 1: Remove the import line in `src/app/layout.tsx`**

Remove:

```tsx
import { BootLoader } from '@/design-system/components/BootLoader';
```

- [ ] **Step 2: Remove the `<BootLoader />` mount**

Delete the `<BootLoader />` line at the top of `<body>`.

- [ ] **Step 3: Delete the component**

```bash
rm src/design-system/components/BootLoader.tsx
```

- [ ] **Step 4: Verify no lingering references**

```bash
grep -rn "BootLoader" src/ tests/ || echo "no references"
```

Expected: `no references`.

- [ ] **Step 5: Run typecheck + lint**

```bash
npm run typecheck && npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove BootLoader — adds load on first paint, reads gimmicky"
```

---

### Task 4: Remove `ThemePalette` (multi-palette switcher)

`ThemeToggle` (light/dark) stays; only the accent-color picker goes.

**Files:**
- Delete: `src/design-system/components/ThemePalette.tsx`
- Delete: `tests/ThemePalette.test.tsx`
- Modify: `src/design-system/layout/Header.tsx` (drop import + render)

- [ ] **Step 1: In `src/design-system/layout/Header.tsx`, remove the import line**

```tsx
import { ThemePalette } from '@/design-system/components/ThemePalette';
```

- [ ] **Step 2: Remove the `<ThemePalette />` render**

Inside `<div className="flex items-center gap-2">`, delete the `<ThemePalette />` element. Keep `<ThemeToggle />` and `<MobileDrawer />`.

- [ ] **Step 3: Delete the component and its test**

```bash
rm src/design-system/components/ThemePalette.tsx tests/ThemePalette.test.tsx
```

- [ ] **Step 4: Verify**

```bash
grep -rn "ThemePalette" src/ tests/ || echo "no references"
npm run typecheck && npm run lint && npm test -- --run --reporter=basic
```

Expected: no references, typecheck clean, lint clean, all remaining unit tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove multi-palette ThemePalette — keep dark/light toggle only"
```

---

### Task 5: Drop "Years professional" stat

**Files:**
- Modify: `src/content/stats.ts`

`About.tsx` already maps over `stats`, so removing one entry is enough.

- [ ] **Step 1: Edit `src/content/stats.ts`**

Replace the `stats` array with three entries (drop the years one):

```ts
export const stats: Stat[] = [
  { label: 'Merged PRs', value: 57, suffix: '+' },
  { label: 'OSS projects', value: 9, suffix: '+' },
  { label: 'Projects shipped', value: 6 },
];
```

(Note: dropped `+` suffix on projects since 6 matches the actual `projects.ts` count exactly — no need to imply more.)

- [ ] **Step 2: Verify**

```bash
npm run typecheck && npm test -- --run --reporter=basic
```

- [ ] **Step 3: Commit**

```bash
git add src/content/stats.ts
git commit -m "refactor(content): drop 'years professional' stat; align project count with projects.ts"
```

---

### Task 6: Rewrite Hero copy and remove `Typewriter`

**Files:**
- Modify: `src/sections/Hero.tsx`
- Delete: `src/design-system/components/Typewriter.tsx`
- Delete: `tests/Typewriter.test.tsx`

The e2e `home.spec.ts` asserts `h1` contains "Maruthan" — preserve that.

- [ ] **Step 1: Rewrite `src/sections/Hero.tsx`** (full replacement)

```tsx
import { HeroShader } from '@/design-system/visuals/HeroShader';
import { AvailabilityPing } from '@/design-system/components/AvailabilityPing';
import { Badge } from '@/design-system/components/Badge';
import { contact } from '@/content/contact';

const buttonBase =
  'inline-flex h-10 items-center justify-center rounded-md px-4 text-base font-medium transition-colors';
const primaryStyles = `${buttonBase} bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]`;
const outlineStyles = `${buttonBase} border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface)]`;
const ghostStyles = `${buttonBase} text-[var(--fg)] hover:bg-[var(--surface)]`;

export function Hero() {
  return (
    <section className="relative py-20 sm:py-32">
      <HeroShader />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <AvailabilityPing>{contact.availability}</AvailabilityPing>
        <Badge>{contact.location}</Badge>
      </div>

      <h1 className="mt-6 font-mono text-4xl leading-tight font-bold sm:text-6xl">
        Hi, I&apos;m <span className="text-[var(--color-brand-500)]">Maruthan</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-[var(--fg)]">
        Full-stack developer building production B2B systems and contributing to the dev tools I
        use every day.
      </p>

      <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
        Currently at Finstein, shipping NestJS, Next.js, and React Native. Off-hours, 57 merged PRs
        across VS Code, NestJS, Node.js undici, and BullMQ.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className={primaryStyles}>
          View work
        </a>
        <a href="#contact" className={outlineStyles}>
          Get in touch
        </a>
        <a href={`mailto:${contact.email}`} className={ghostStyles}>
          Email
        </a>
      </div>
    </section>
  );
}
```

Note: `HeroShader` component will be created in Task 7 with a static fallback — Task 6 leaves a forward reference. To avoid breaking the build between Task 6 and Task 7, do Task 7 immediately after this step, OR temporarily inline a fallback `<div />` in this step (recommended order: complete Task 6 → Task 7 in the same session).

- [ ] **Step 2: Delete `Typewriter` component and its test**

```bash
rm src/design-system/components/Typewriter.tsx tests/Typewriter.test.tsx
```

- [ ] **Step 3: Verify no other consumers**

```bash
grep -rn "Typewriter" src/ tests/ || echo "no references"
```

Expected: `no references`.

- [ ] **Step 4: Verify (typecheck will fail until HeroShader exists — that's expected; complete Task 7 next)**

Skip running typecheck here; do it after Task 7.

- [ ] **Step 5: Commit (with Task 7 — see Task 7 step 7)**

Do NOT commit yet. Hero.tsx now imports `HeroShader` which doesn't exist; commit after Task 7 to keep history clean.

---

### Task 7: Create `HeroShader` (static fallback first)

**Files:**
- Create: `src/design-system/visuals/HeroShader.tsx`
- Create: `tests/HeroShader.test.tsx`
- Delete: `src/design-system/visuals/HeroBackground.tsx`

The static fallback is what renders when `prefers-reduced-motion: reduce` is set OR when `<canvas>` isn't available (no-JS / SSR). Animation comes in Task 8.

- [ ] **Step 1: Write the failing test**

Create `tests/HeroShader.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroShader } from '@/design-system/visuals/HeroShader';

describe('HeroShader', () => {
  it('renders a static fallback (no canvas) under prefers-reduced-motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (q: string) => ({
        matches: q.includes('prefers-reduced-motion') ? true : false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    const { container } = render(<HeroShader />);
    expect(container.querySelector('[data-testid="hero-shader-fallback"]')).not.toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('marks the visual as decorative (aria-hidden) and non-interactive (pointer-events-none)', () => {
    const { container } = render(<HeroShader />);
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.getAttribute('aria-hidden')).toBe('true');
    expect(root!.className).toContain('pointer-events-none');
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

```bash
npm test -- --run tests/HeroShader.test.tsx
```

Expected: FAIL with "Cannot find module '@/design-system/visuals/HeroShader'".

- [ ] **Step 3: Create `src/design-system/visuals/HeroShader.tsx` with static fallback only**

```tsx
'use client';

import { useEffect, useState } from 'react';

function StaticFallback() {
  return (
    <div data-testid="hero-shader-fallback" className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-brand-500) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-500), transparent 70%)' }}
      />
      <div
        className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-300), transparent 70%)' }}
      />
    </div>
  );
}

export function HeroShader() {
  const [reduced, setReduced] = useState(true); // default to reduced for SSR safety
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setMounted(true);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <StaticFallback />
      {/* Animated canvas added in Task 8; gated on `mounted && !reduced`. */}
    </div>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

```bash
npm test -- --run tests/HeroShader.test.tsx
```

Expected: 2 passing.

- [ ] **Step 5: Delete the old HeroBackground**

```bash
rm src/design-system/visuals/HeroBackground.tsx
grep -rn "HeroBackground" src/ tests/ || echo "no references"
```

Expected: `no references`.

- [ ] **Step 6: Run typecheck + full unit tests**

```bash
npm run typecheck && npm test -- --run --reporter=basic
```

- [ ] **Step 7: Commit (bundles Task 6 + Task 7)**

```bash
git add -A
git commit -m "feat(hero): rewrite copy, drop Typewriter, replace HeroBackground with HeroShader static fallback"
```

---

### Task 8: Add r3f shader animation to `HeroShader`

**Files:**
- Modify: `src/design-system/visuals/HeroShader.tsx`
- Modify: `tests/HeroShader.test.tsx` (add a new test for the canvas being mounted when motion is allowed)

- [ ] **Step 1: Extend the test file with a new test**

Add to `tests/HeroShader.test.tsx`:

```tsx
import { vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <canvas data-testid="hero-shader-canvas">{children}</canvas>
  ),
  useFrame: () => {},
}));

// In an existing describe block, add:
it('mounts a canvas when prefers-reduced-motion is not set', async () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  const { container, findByTestId } = render(<HeroShader />);
  expect(await findByTestId('hero-shader-canvas')).toBeInTheDocument();
  // Static fallback still rendered underneath for layered look — that's fine.
  expect(container.querySelector('[data-testid="hero-shader-fallback"]')).not.toBeNull();
});
```

- [ ] **Step 2: Run the test, expect failure**

```bash
npm test -- --run tests/HeroShader.test.tsx
```

Expected: FAIL on the new test (canvas not yet mounted).

- [ ] **Step 3: Implement the animated layer in `src/design-system/visuals/HeroShader.tsx`**

Replace the file with:

```tsx
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StaticFallback() {
  return (
    <div data-testid="hero-shader-fallback" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-brand-500) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-500), transparent 70%)' }}
      />
      <div
        className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-brand-300), transparent 70%)' }}
      />
    </div>
  );
}

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  varying vec2 vUv;

  // Cheap pseudo-noise.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv += uMouse * 0.05;
    float n = noise(uv * 3.0 + uTime * 0.05);
    n += 0.5 * noise(uv * 6.0 - uTime * 0.03);
    float r = length(uv);
    float vignette = smoothstep(0.95, 0.2, r);
    float intensity = n * vignette * 0.18;
    gl_FragColor = vec4(uColor * intensity, intensity);
  }
`;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function ShaderPlane({ paused }: { paused: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.set(x, y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (paused || !matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
    matRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColor: { value: new THREE.Color('#58a6ff') },
        }}
      />
    </mesh>
  );
}

export function HeroShader() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setMounted(true);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0,
    });
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const animate = mounted && !reduced;

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <StaticFallback />
      {animate && (
        <Canvas
          camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
          gl={{ antialias: false, alpha: true }}
          dpr={[1, 1.5]}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <ShaderPlane paused={!inView} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

```bash
npm test -- --run tests/HeroShader.test.tsx
```

Expected: 3 passing (2 from Task 7 + 1 new).

- [ ] **Step 5: Manually verify in dev**

```bash
npm run dev
```

Open http://localhost:3000. Confirm: subtle drifting noise behind the hero, mouse parallax, no jank. Toggle "reduce motion" in OS preferences and reload — confirm canvas is gone, only the static gradient remains. Stop dev with Ctrl-C.

- [ ] **Step 6: Run full unit suite + build**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(hero): add r3f shader background with reduced-motion + IntersectionObserver pause"
```

---

### Task 9: Rewrite `About` — "Available for" line + resume PDF link

**Files:**
- Modify: `src/sections/About.tsx`

(Resume PDF placeholder file is added in Task 19; this task only wires the link.)

- [ ] **Step 1: Replace `src/sections/About.tsx`**

```tsx
import { Section } from '@/design-system/components/Section';
import { StatCounter } from '@/design-system/components/StatCounter';
import { stats } from '@/content/stats';

export function About() {
  return (
    <Section id="about" eyebrow="01 / About" title="A few things about me">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 text-[var(--muted)]">
          <p className="text-[var(--fg)]">
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              What I ship —
            </span>{' '}
            production web and mobile apps at{' '}
            <span className="text-[var(--fg)]">Finstein</span> across NestJS, Next.js, Angular, and
            React Native (Expo). B2B platforms, analytics dashboards, real-time messaging, payments,
            mobile apps. Before that I taught programming and robotics as a STEM instructor at LMES
            Academy.
          </p>
          <p>
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              What I make better —
            </span>{' '}
            the dev tools I use every day. Active contributor to{' '}
            <span className="text-[var(--fg)]">VS Code</span>, the{' '}
            <span className="text-[var(--fg)]">NestJS ecosystem</span> (CLI, Swagger, GraphQL),{' '}
            <span className="text-[var(--fg)]">Node.js undici</span>, and{' '}
            <span className="text-[var(--fg)]">BullMQ</span>. 57 merged PRs and counting.
          </p>
          <p>
            Currently exploring data engineering — Databricks, PySpark, Delta Lake, dbt, Power BI.
            Based in Chennai, India.
          </p>
          <p className="text-[var(--fg)]">
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              Available for —
            </span>{' '}
            full-time roles and contract work.{' '}
            <a
              href="/resume.pdf"
              className="text-[var(--color-brand-500)] hover:underline"
              download
            >
              Download resume (PDF)
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 self-start">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/About.tsx
git commit -m "refactor(about): What I ship / What I make better structure + Available for line + resume link"
```

---

### Task 10: Regroup `TechStack` to 4 categories

**Files:**
- Modify: `src/content/techStack.ts`

`TechStack.tsx` already iterates `techCategoriesInOrder` and filters by category — no component change needed.

- [ ] **Step 1: Replace `src/content/techStack.ts`**

```ts
export type TechCategory = 'Backend' | 'Frontend' | 'Mobile' | 'Data & Infra';

export interface Tech {
  name: string;
  category: TechCategory;
  proficiency?: string;
  learning?: boolean;
}

export const techStack: Tech[] = [
  // Backend
  { name: 'NestJS', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'Node.js', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'TypeScript', category: 'Backend', proficiency: 'Daily driver' },
  { name: 'Express', category: 'Backend' },
  { name: 'BullMQ', category: 'Backend', proficiency: 'OSS contributor' },
  { name: 'Socket.io', category: 'Backend' },
  { name: 'TypeORM', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Backend', proficiency: 'Production' },
  { name: 'MySQL', category: 'Backend' },
  { name: 'MariaDB', category: 'Backend' },
  { name: 'Redis', category: 'Backend' },
  { name: 'WordPress / WooCommerce', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  { name: 'SQL', category: 'Backend' },

  // Frontend
  { name: 'Next.js', category: 'Frontend', proficiency: 'Production' },
  { name: 'React', category: 'Frontend', proficiency: 'Production' },
  { name: 'Angular', category: 'Frontend', proficiency: 'Production' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'Redux Toolkit', category: 'Frontend' },
  { name: 'D3.js', category: 'Frontend' },

  // Mobile
  { name: 'React Native', category: 'Mobile', proficiency: 'Production' },
  { name: 'Expo', category: 'Mobile' },
  { name: 'Ionic', category: 'Mobile' },
  { name: 'Capacitor', category: 'Mobile' },

  // Data & Infra
  { name: 'Databricks', category: 'Data & Infra', learning: true },
  { name: 'PySpark', category: 'Data & Infra', learning: true },
  { name: 'Delta Lake', category: 'Data & Infra', learning: true },
  { name: 'dbt', category: 'Data & Infra', learning: true },
  { name: 'Power BI', category: 'Data & Infra', learning: true },
  { name: 'Scala', category: 'Data & Infra', learning: true },
  { name: 'Python', category: 'Data & Infra' },
  { name: 'Docker', category: 'Data & Infra' },
  { name: 'GitLab CI', category: 'Data & Infra' },
  { name: 'AWS', category: 'Data & Infra' },
  { name: 'Azure', category: 'Data & Infra' },
  { name: 'Vercel', category: 'Data & Infra' },
  { name: 'Firebase', category: 'Data & Infra' },
];

export const techCategoriesInOrder: TechCategory[] = [
  'Backend',
  'Frontend',
  'Mobile',
  'Data & Infra',
];
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic && npm run build
```

`TechStack.tsx`'s loop continues to work unchanged — items with categories no longer in the list are simply filtered out by the existing `.filter` call.

- [ ] **Step 3: Commit**

```bash
git add src/content/techStack.ts
git commit -m "refactor(content): regroup tech stack into 4 purposeful categories"
```

---

### Task 11: Trim Featured Projects to 4

**Files:**
- Modify: `src/content/projects.ts`

- [ ] **Step 1: Edit `src/content/projects.ts`**

Set `featured: true` on exactly these 4 (and `featured: false` on the other 2):
- `b2b-marketplace` → true
- `conversational-commerce-bot` → true
- `sales-analytics-platform` → true
- `fitness-ecosystem` → true
- `health-wellness-app` → false
- `enterprise-data-warehouse` → false

The `featuredProjects` derived export at the bottom of the file already filters on `featured`, so nothing else changes.

- [ ] **Step 2: Verify the home e2e doesn't expect the cut projects in the featured list**

```bash
grep -n "Health.*Wellness\|Data Warehouse" tests/e2e/home.spec.ts || echo "no references"
```

Expected: `no references` (current spec only checks generic headings, not project names on home).

- [ ] **Step 3: Run typecheck + tests**

```bash
npm run typecheck && npm test -- --run --reporter=basic
```

- [ ] **Step 4: Commit**

```bash
git add src/content/projects.ts
git commit -m "refactor(content): trim featured projects on home from 6 to 4"
```

---

### Task 12: Rewrite `OSSPreview` to 3-quote-card layout

**Files:**
- Modify: `src/sections/OSSPreview.tsx`

Drop the stat cards (they live on `/oss`), drop the "Currently contributing to" project list (also on `/oss`). Replace the highlights list with 3 hand-picked PR quote cards.

The current `ossHighlights` in `src/content/oss.ts` already has the 3 picks; we just render them differently.

- [ ] **Step 1: Replace `src/sections/OSSPreview.tsx`**

```tsx
import Link from 'next/link';
import { ArrowUpRight, GitMerge } from 'lucide-react';
import { Section } from '@/design-system/components/Section';
import { ossHighlights, ossStats } from '@/content/oss';

export function OSSPreview() {
  return (
    <Section
      id="oss"
      eyebrow="04 / Open Source"
      title="Open source contributions"
      description={`${ossStats.totalMerged} merged PRs across ${ossStats.projectCount} projects. A few I'm proudest of:`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {ossHighlights.slice(0, 3).map((h) => (
          <a
            key={h.href}
            href={h.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between gap-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--color-brand-500)]/60"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[var(--color-brand-500)]">{h.project}</span>
                <span className="font-mono text-[var(--muted)]">{h.pr}</span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--fg)]">{h.title}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-1">
                <GitMerge className="h-3 w-3" />
                {h.mergedOn ?? 'merged'}
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/oss"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-500)] hover:underline"
        >
          View all {ossStats.totalMerged} merged PRs →
        </Link>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic
```

The home e2e test checks for the heading "open source contributions" — preserved.

- [ ] **Step 3: Commit**

```bash
git add src/sections/OSSPreview.tsx
git commit -m "refactor(oss-preview): replace stat panel + highlight list with 3 quote cards + view-all CTA"
```

---

### Task 13: Add Cal.com placeholder to Contact

**Files:**
- Modify: `src/content/contact.ts`
- Modify: `src/sections/Contact.tsx`

- [ ] **Step 1: Extend `src/content/contact.ts`**

```ts
export const contact = {
  email: 'maruthangt@gmail.com',
  location: 'Chennai, India',
  availability: 'Open to opportunities',
  // Set to a Cal.com (or similar) URL when ready. Leave undefined to hide the link.
  scheduleHref: undefined as string | undefined,
  socials: [
    { label: 'GitHub', href: 'https://github.com/maruthang', handle: '@maruthang' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/maruthan-g-6a7415201',
      handle: 'maruthan-g',
    },
    { label: 'Telegram', href: 'https://t.me/Maruthang', handle: '@Maruthang' },
  ],
} as const;

export type Social = (typeof contact.socials)[number];
```

- [ ] **Step 2: Update `src/sections/Contact.tsx` to render the link when set**

Below the email line and above "Find me elsewhere", insert:

```tsx
{contact.scheduleHref && (
  <p className="text-[var(--muted)]">
    Or{' '}
    <a
      href={contact.scheduleHref}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-brand-500)] hover:underline"
    >
      book a call
    </a>
    .
  </p>
)}
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck && npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/content/contact.ts src/sections/Contact.tsx
git commit -m "feat(contact): add optional scheduleHref (Cal.com) link"
```

---

### Task 14: Pure positioning utility for OSS constellation (TDD)

**Files:**
- Create: `src/lib/oss-positioning.ts`
- Create: `tests/oss-positioning.test.ts`

Pure deterministic function — no DOM, no react. Easy to TDD.

- [ ] **Step 1: Write the failing test**

```ts
// tests/oss-positioning.test.ts
import { describe, it, expect } from 'vitest';
import { ringPositions, ellipseOrbit } from '@/lib/oss-positioning';

describe('ringPositions', () => {
  it('places n nodes evenly on a circle of given radius', () => {
    const pts = ringPositions(4, 10);
    expect(pts).toHaveLength(4);
    // First point is at angle 0 → (10, 0)
    expect(pts[0]!.x).toBeCloseTo(10);
    expect(pts[0]!.y).toBeCloseTo(0);
    // Third point is at angle PI → (-10, 0)
    expect(pts[2]!.x).toBeCloseTo(-10);
    expect(pts[2]!.y).toBeCloseTo(0);
  });

  it('returns deterministic results for same inputs', () => {
    expect(ringPositions(9, 5)).toEqual(ringPositions(9, 5));
  });
});

describe('ellipseOrbit', () => {
  it('returns a point on an ellipse around a center for time t', () => {
    const p = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 0 }, 0);
    // At t=0, speed=0, phase=0 → (a, 0) = (2, 0)
    expect(p.x).toBeCloseTo(2);
    expect(p.y).toBeCloseTo(0);
  });

  it('moves around the ellipse over time', () => {
    const at0 = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 1 }, 0);
    const atQuarter = ellipseOrbit({ cx: 0, cy: 0, a: 2, b: 1, phase: 0, speed: 1 }, Math.PI / 2);
    expect(at0.x).toBeCloseTo(2);
    expect(atQuarter.x).toBeCloseTo(0);
    expect(atQuarter.y).toBeCloseTo(1);
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test -- --run tests/oss-positioning.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/oss-positioning'".

- [ ] **Step 3: Implement `src/lib/oss-positioning.ts`**

```ts
export interface Point2 {
  x: number;
  y: number;
}

export function ringPositions(n: number, radius: number): Point2[] {
  const points: Point2[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

export interface Orbit {
  cx: number;
  cy: number;
  a: number; // semi-major axis
  b: number; // semi-minor axis
  phase: number; // starting angle offset
  speed: number; // radians per unit time
}

export function ellipseOrbit(orbit: Orbit, t: number): Point2 {
  const angle = orbit.phase + orbit.speed * t;
  return {
    x: orbit.cx + orbit.a * Math.cos(angle),
    y: orbit.cy + orbit.b * Math.sin(angle),
  };
}
```

- [ ] **Step 4: Run, expect pass**

```bash
npm test -- --run tests/oss-positioning.test.ts
```

Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/oss-positioning.ts tests/oss-positioning.test.ts
git commit -m "feat(oss-constellation): add pure positioning utilities (ring + ellipse orbit)"
```

---

### Task 15: `OssConstellation` r3f component

**Files:**
- Create: `src/design-system/visuals/OssConstellation.tsx`
- Create: `tests/OssConstellation.test.tsx`

The visual will be a fixed-aspect 2D scene using an orthographic camera. r3f handles the canvas.

- [ ] **Step 1: Write a failing behavior test (callback contract — no canvas rendering)**

```tsx
// tests/OssConstellation.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OssConstellation } from '@/design-system/visuals/OssConstellation';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="constellation-canvas">{children}</div>
  ),
  useFrame: () => {},
}));

const projects = [
  { name: 'nestjs/nest-cli', merged: 15 },
  { name: 'microsoft/vscode', merged: 12 },
];

describe('OssConstellation', () => {
  it('renders an accessible repo-selection list as a fallback for screen readers + no-JS', () => {
    render(
      <OssConstellation projects={projects} selectedProject={null} onSelectProject={() => {}} />,
    );
    // The fallback renders one button per project so keyboard + a11y users can drive the same filter.
    expect(screen.getByRole('button', { name: /nestjs\/nest-cli/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /microsoft\/vscode/i })).toBeInTheDocument();
  });

  it('calls onSelectProject(name) when a fallback button is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <OssConstellation projects={projects} selectedProject={null} onSelectProject={onSelect} />,
    );
    await user.click(screen.getByRole('button', { name: /microsoft\/vscode/i }));
    expect(onSelect).toHaveBeenCalledWith('microsoft/vscode');
  });

  it('marks the selected button with aria-pressed=true', () => {
    render(
      <OssConstellation
        projects={projects}
        selectedProject="microsoft/vscode"
        onSelectProject={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /microsoft\/vscode/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test -- --run tests/OssConstellation.test.tsx
```

Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Implement `src/design-system/visuals/OssConstellation.tsx`**

```tsx
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ringPositions, ellipseOrbit, type Point2 } from '@/lib/oss-positioning';
import { cn } from '@/design-system/utils/cn';

export interface ConstellationProject {
  name: string;
  merged: number;
}

interface OssConstellationProps {
  projects: ConstellationProject[];
  selectedProject: string | null;
  onSelectProject: (name: string | null) => void;
  className?: string;
}

function RepoNode({
  position,
  label,
  selected,
  dimmed,
  onSelect,
}: {
  position: Point2;
  label: string;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh
      ref={ref}
      position={[position.x, position.y, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <circleGeometry args={[selected ? 0.28 : 0.22, 32]} />
      <meshBasicMaterial
        color={selected ? '#58a6ff' : '#ffffff'}
        opacity={dimmed ? 0.3 : 1}
        transparent
      />
    </mesh>
  );
}

function PrSatellite({
  orbit,
  paused,
  dimmed,
}: {
  orbit: ReturnType<typeof orbitFor>;
  paused: boolean;
  dimmed: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const tRef = useRef(orbit.phase);
  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    tRef.current += delta;
    const p = ellipseOrbit(orbit, tRef.current);
    ref.current.position.set(p.x, p.y, 0);
  });
  return (
    <mesh ref={ref} position={[orbit.cx + orbit.a, orbit.cy, 0]}>
      <circleGeometry args={[0.04, 12]} />
      <meshBasicMaterial color="#58a6ff" opacity={dimmed ? 0.15 : 0.6} transparent />
    </mesh>
  );
}

function orbitFor(repoPos: Point2, prIndex: number, totalForRepo: number) {
  const a = 0.45 + (prIndex % 3) * 0.08;
  const b = a * (0.6 + ((prIndex * 31) % 30) / 100);
  const phase = (prIndex / Math.max(1, totalForRepo)) * Math.PI * 2;
  const speed = 0.3 + ((prIndex * 17) % 10) / 80;
  return { cx: repoPos.x, cy: repoPos.y, a, b, phase, speed };
}

export function OssConstellation({
  projects,
  selectedProject,
  onSelectProject,
  className,
}: OssConstellationProps) {
  const [reduced, setReduced] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setMounted(true);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const positions = useMemo(() => ringPositions(projects.length, 1.6), [projects.length]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        {mounted && (
          <Canvas
            orthographic
            camera={{ position: [0, 0, 5], zoom: 130, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              {projects.map((p, i) => {
                const pos = positions[i]!;
                const isSelected = selectedProject === p.name;
                const dimmed = !!selectedProject && !isSelected;
                return (
                  <group key={p.name}>
                    <RepoNode
                      position={pos}
                      label={p.name}
                      selected={isSelected}
                      dimmed={dimmed}
                      onSelect={() => onSelectProject(isSelected ? null : p.name)}
                    />
                    {Array.from({ length: Math.min(p.merged, 8) }).map((_, j) => (
                      <PrSatellite
                        key={j}
                        orbit={orbitFor(pos, j, Math.min(p.merged, 8))}
                        paused={reduced}
                        dimmed={dimmed}
                      />
                    ))}
                  </group>
                );
              })}
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Accessible / no-JS fallback list. Always rendered so screen readers have the same control. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {projects.map((p) => {
          const active = selectedProject === p.name;
          return (
            <li key={p.name}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelectProject(active ? null : p.name)}
                className={cn(
                  'rounded-md border px-3 py-1.5 font-mono text-xs transition-colors',
                  active
                    ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]'
                    : 'border-[var(--border)] text-[var(--fg)] hover:border-[var(--color-brand-500)]/60',
                )}
              >
                {p.name}{' '}
                <span className="text-[var(--muted)]">({p.merged})</span>
              </button>
            </li>
          );
        })}
        {selectedProject && (
          <li>
            <button
              type="button"
              onClick={() => onSelectProject(null)}
              className="rounded-md border border-[var(--border)] px-3 py-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Clear filter
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

```bash
npm test -- --run tests/OssConstellation.test.tsx
```

Expected: 3 passing.

- [ ] **Step 5: Run typecheck + full unit suite + build**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(oss): add OssConstellation r3f visual with accessible fallback list"
```

---

### Task 16: Wire `OssConstellation` into `/oss` via `OssExplorer`

**Files:**
- Create: `src/design-system/components/OssExplorer.tsx`
- Modify: `src/design-system/components/OssPrTable.tsx` (add optional `projectFilter` prop)
- Modify: `src/app/oss/page.tsx` (replace direct table with `OssExplorer`)
- Modify: `src/design-system/components/index.ts` (export `OssExplorer` if barrel-exporting; otherwise leave alone)

- [ ] **Step 1: Add a controlled `projectFilter` prop to `OssPrTable`**

In `src/design-system/components/OssPrTable.tsx`, change the props signature:

```tsx
export function OssPrTable({
  prs,
  projectFilter,
}: {
  prs: OssPr[];
  projectFilter?: string | null;
}) {
```

Inside the `useMemo` filter, add a project-name check:

```tsx
const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  return prs.filter((pr) => {
    if (statusFilter !== 'all' && pr.status !== statusFilter) return false;
    if (projectFilter && pr.project !== projectFilter) return false;
    if (!q) return true;
    return (
      pr.title.toLowerCase().includes(q) ||
      pr.project.toLowerCase().includes(q) ||
      String(pr.number).includes(q)
    );
  });
}, [prs, query, statusFilter, projectFilter]);
```

- [ ] **Step 2: Confirm the existing OssPrTable test still passes**

```bash
npm test -- --run tests/OssPrTable.test.tsx
```

Expected: pass (the new prop is optional).

- [ ] **Step 3: Create `src/design-system/components/OssExplorer.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { OssConstellation } from '@/design-system/visuals/OssConstellation';
import { OssPrTable } from '@/design-system/components/OssPrTable';
import type { OssPr, OssProject } from '@/content/oss';

interface OssExplorerProps {
  prs: OssPr[];
  projects: OssProject[];
}

export function OssExplorer({ prs, projects }: OssExplorerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const constellationProjects = projects.map((p) => ({ name: p.name, merged: p.merged }));

  return (
    <div className="space-y-10">
      <OssConstellation
        projects={constellationProjects}
        selectedProject={selected}
        onSelectProject={setSelected}
      />
      <OssPrTable prs={prs} projectFilter={selected} />
    </div>
  );
}
```

- [ ] **Step 4: Update `src/app/oss/page.tsx`**

Replace the bottom block (everything from `<div className="mt-12">` for "All pull requests" downwards) with:

```tsx
<div className="mt-12">
  <h3 className="mb-4 font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
    Constellation + all pull requests
  </h3>
  <OssExplorer prs={ossAllPrs} projects={ossProjects} />
</div>
```

And replace the import:

```tsx
import { OssPrTable } from '@/design-system/components/OssPrTable';
```

with:

```tsx
import { OssExplorer } from '@/design-system/components/OssExplorer';
```

- [ ] **Step 5: Run unit tests + e2e for /oss**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic
npm run build
npm run test:e2e -- tests/e2e/oss.spec.ts
```

The existing e2e (`oss.spec.ts`) checks heading "every contribution", "merged prs" text (still present in stat cards), search placeholder, and the merged/open filter buttons (still rendered by the inner `OssPrTable`). Should pass.

- [ ] **Step 6: Manual smoke**

```bash
npm run dev
```

Open http://localhost:3000/oss. Confirm:
- Constellation renders above the fallback list.
- Clicking a repo node (or fallback button) filters the table.
- Clicking again unselects.
- "Clear filter" button appears when something is selected.
- Reduced motion stops the orbits.

Stop dev.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(oss): wire OssConstellation into /oss via OssExplorer; add projectFilter to OssPrTable"
```

---

### Task 17: Reformat 6 case studies to the new 7-section skeleton

**Files:**
- Modify: `src/content/projects/b2b-marketplace.mdx`
- Modify: `src/content/projects/conversational-commerce-bot.mdx`
- Modify: `src/content/projects/sales-analytics-platform.mdx`
- Modify: `src/content/projects/fitness-ecosystem.mdx`
- Modify: `src/content/projects/health-wellness-app.mdx`
- Modify: `src/content/projects/enterprise-data-warehouse.mdx`

Each MDX file keeps its existing frontmatter and replaces the body with the 7-section skeleton from spec §6. Existing content is reorganized, not discarded.

The 7 sections (use these exact h2 strings — Task 18 updates e2e to match):

```markdown
## Context

…

## My role

…

## Architecture

…

## Key technical decisions

…

## Constraints

…

## What I'd do differently

…

## Tech stack

…
```

- [ ] **Step 1: Reformat `b2b-marketplace.mdx`**

Replace the body (everything below the `---` frontmatter close) with the 7 sections, reusing existing content:
- "Context" gets the current "Problem" paragraph.
- "My role" — write a new sentence based on `role: Full-stack lead` from frontmatter: "Full-stack lead. Owned the WordPress + Dokan extensions, the AWS Lambda product-creation pipeline, the Docker Compose infra, and the GitLab CI/CD pipeline."
- "Architecture" gets the current "Solution" + "Architecture" paragraphs.
- "Key technical decisions" — write 3 trade-offs grounded in the existing tech stack, e.g.:
  1. *Why WordPress + Dokan, not a custom Node app* — leveraged Dokan's vendor model + WooCommerce payments instead of rebuilding.
  2. *Why GitLab CI for backup → deploy → rollback* — the marketplace ran on a single VPS; a deploy that breaks customer orders is unrecoverable, so every deploy snapshots MariaDB + WP uploads first.
  3. *Why AWS Lambda for AI product creation* — burstable workload, no need for a long-running service, integrates with WP via webhooks.
- "Constraints" — single-VPS infra, small team, hard launch deadline.
- "What I'd do differently" — extract the AI Lambda + reverse auction into proper microservices behind an API gateway; split the WP monolith.
- "Tech stack" — bullet list copy-pasted from frontmatter.

Length per section: 2-4 sentences each (or a short bullet list). Prioritize specificity over completeness.

- [ ] **Step 2: Reformat `conversational-commerce-bot.mdx`** (same skeleton)

Use existing "WhatsApp ↔ WooCommerce bridge" content for Context. Decisions to highlight (mentioned in `projects.ts`): HMAC-SHA256 verification, SQLite idempotency, multi-step state machine in NestJS.

- [ ] **Step 3: Reformat `sales-analytics-platform.mdx`**

Decisions: BullMQ for ingestion queues, CASL for RBAC, D3 for custom dashboards over off-the-shelf chart libs.

- [ ] **Step 4: Reformat `fitness-ecosystem.mdx`**

Decisions: Expo over bare RN (faster iteration), Socket.io for real-time messaging, OpenAI GPT-4o for coaching prompts.

- [ ] **Step 5: Reformat `health-wellness-app.mdx`**

Decisions: Ionic + Capacitor over RN (corporate constraint), Keycloak SSO over Auth0.

- [ ] **Step 6: Reformat `enterprise-data-warehouse.mdx`**

Decisions: Medallion architecture, SCD Type 2 over Type 1 for slowly changing dims, Databricks Asset Bundles for IaC.

- [ ] **Step 7: Verify all 6 still parse**

```bash
npm run typecheck && npm test -- --run tests/mdx.test.ts
```

- [ ] **Step 8: Commit (one commit for all 6)**

```bash
git add src/content/projects/
git commit -m "refactor(case-studies): reformat all 6 MDX projects to 7-section skeleton"
```

---

### Task 18: Update e2e tests for new headings

**Files:**
- Modify: `tests/e2e/projects.spec.ts`

The home spec already only checks for "Maruthan" in h1 and section heading text that we preserved. The projects spec checks for "Problem" / "Solution" headings — those no longer exist.

- [ ] **Step 1: Update `tests/e2e/projects.spec.ts`**

Replace lines 16-17:

```ts
await expect(page.getByRole('heading', { name: /problem/i })).toBeVisible();
await expect(page.getByRole('heading', { name: /solution/i })).toBeVisible();
```

with:

```ts
await expect(page.getByRole('heading', { name: /^context$/i })).toBeVisible();
await expect(page.getByRole('heading', { name: /^my role$/i })).toBeVisible();
await expect(page.getByRole('heading', { name: /^architecture$/i })).toBeVisible();
```

- [ ] **Step 2: Run e2e**

```bash
npm run build
npm run test:e2e -- tests/e2e/projects.spec.ts
```

Expected: all 3 tests in the file pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/projects.spec.ts
git commit -m "test(e2e): update /projects/[slug] heading assertions for new case-study skeleton"
```

---

### Task 19: Resume PDF placeholder + Footer link

**Files:**
- Create: `public/resume.pdf` (placeholder binary)
- Modify: `src/design-system/layout/Footer.tsx`

About already links to `/resume.pdf` (Task 9). This task adds the file + Footer link so the path resolves.

- [ ] **Step 1: Create a placeholder PDF**

The placeholder is a 1-page PDF that says "Resume — replace this file with the real one." Generate it with a one-shot Python script (Python is in `techStack`; if not available, use any plain PDF tool).

```bash
python -c "from reportlab.pdfgen import canvas; c = canvas.Canvas('public/resume.pdf'); c.drawString(72, 720, 'Resume placeholder — replace public/resume.pdf with the real file before launch.'); c.showPage(); c.save()" 2>/dev/null || echo "reportlab not available; falling back to minimal manual PDF"
```

If `reportlab` isn't installed, write a minimal valid PDF by hand — the `printf` form below produces a 1-page valid PDF (Bash; for PowerShell use the equivalent here-string):

```bash
printf '%%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<<>>>>endobj\n4 0 obj<</Length 60>>stream\nBT /F1 12 Tf 72 720 Td (Resume placeholder - replace before launch.) Tj ET\nendstream endobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000098 00000 n \n0000000182 00000 n \ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n290\n%%%%EOF\n' > public/resume.pdf
```

Verify the file opens in a browser:

```bash
ls -l public/resume.pdf
```

Expected: file exists, non-zero size.

> **Note for Maruthan:** replace `public/resume.pdf` with the real CV before launch. Same path, no code changes needed.

- [ ] **Step 2: Update `src/design-system/layout/Footer.tsx`** to add a resume link

In the "Connect" column, append a list item:

```tsx
<li>
  <a
    href="/resume.pdf"
    download
    className="hover:text-[var(--fg)]"
  >
    Resume (PDF)
  </a>
</li>
```

(Place it after the socials map.)

- [ ] **Step 3: Verify**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add public/resume.pdf src/design-system/layout/Footer.tsx
git commit -m "feat: add resume PDF placeholder and Footer link"
```

---

### Task 20: Per-route OG images (next/og)

**Files:**
- Create: `src/app/opengraph-image.tsx` (root)
- Create: `src/app/projects/[slug]/opengraph-image.tsx`

`next/og` is built into Next.js 15.

- [ ] **Step 1: Create the root OG image**

`src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Maruthan G — Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
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
        <div style={{ fontSize: 36, fontFamily: 'monospace', color: '#58a6ff' }}>
          maruthan.dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            Maruthan G
          </div>
          <div style={{ fontSize: 32, color: '#7d8590', maxWidth: 900 }}>
            Full-stack developer building production B2B systems and contributing to the dev tools
            I use every day.
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#7d8590' }}>
          57 merged PRs · NestJS · VS Code · undici · BullMQ
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2: Create the per-project OG image**

`src/app/projects/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';
import { projects } from '@/content/projects';

export const runtime = 'edge';
export const alt = 'Project case study — Maruthan G';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? 'Project';
  const tech = project?.tech.slice(0, 6).join(' · ') ?? '';

  return new ImageResponse(
    (
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
          maruthan.dev / case study
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 28, color: '#7d8590', fontFamily: 'monospace' }}>{tech}</div>
        </div>
        <div style={{ fontSize: 22, color: '#7d8590' }}>Maruthan G — Full-stack developer</div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: build succeeds; `.next/server/app/projects/[slug]/opengraph-image.png.body.js` (or similar) is emitted.

- [ ] **Step 4: Manual smoke**

```bash
npm run dev
```

Open http://localhost:3000/opengraph-image and http://localhost:3000/projects/b2b-marketplace/opengraph-image — both should serve PNGs.

- [ ] **Step 5: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/projects/\[slug\]/opengraph-image.tsx
git commit -m "feat(seo): per-route OG images via next/og for / and /projects/[slug]"
```

---

### Task 21: JSON-LD — `Person` (root) + `BreadcrumbList` (case studies + /oss)

**Files:**
- Create: `src/lib/jsonld.ts`
- Create: `tests/jsonld.test.ts`
- Modify: `src/app/layout.tsx` (Person)
- Modify: `src/app/projects/[slug]/page.tsx` (BreadcrumbList)
- Modify: `src/app/oss/page.tsx` (BreadcrumbList)

- [ ] **Step 1: Write the failing test for `jsonld.ts` builders**

```ts
// tests/jsonld.test.ts
import { describe, it, expect } from 'vitest';
import { personSchema, breadcrumbListSchema } from '@/lib/jsonld';

describe('personSchema', () => {
  it('builds a JSON-LD Person object with the given identity', () => {
    const json = personSchema({
      name: 'Maruthan G',
      url: 'https://example.com',
      sameAs: ['https://github.com/maruthang'],
    });
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('Maruthan G');
    expect(json.url).toBe('https://example.com');
    expect(json.sameAs).toEqual(['https://github.com/maruthang']);
  });
});

describe('breadcrumbListSchema', () => {
  it('builds a BreadcrumbList with positions starting at 1', () => {
    const json = breadcrumbListSchema([
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Projects', url: 'https://example.com/projects' },
    ]);
    expect(json['@type']).toBe('BreadcrumbList');
    expect(json.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com/',
    });
    expect(json.itemListElement[1]?.position).toBe(2);
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test -- --run tests/jsonld.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/jsonld'".

- [ ] **Step 3: Implement `src/lib/jsonld.ts`**

```ts
export interface PersonInput {
  name: string;
  url: string;
  sameAs?: string[];
  jobTitle?: string;
}

export function personSchema(input: PersonInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: input.url,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
  } as const;
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  } as const;
}
```

- [ ] **Step 4: Run, expect pass**

```bash
npm test -- --run tests/jsonld.test.ts
```

Expected: 2 passing.

- [ ] **Step 5: Mount `personSchema` in `src/app/layout.tsx`**

Inside `<body>`, just before `<a href="#main-content">`, add:

```tsx
import Script from 'next/script';
import { personSchema } from '@/lib/jsonld';
import { contact } from '@/content/contact';

// ... within RootLayout:
<Script
  id="ld-person"
  type="application/ld+json"
  // eslint-disable-next-line react/no-danger
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      personSchema({
        name: 'Maruthan G',
        url: siteUrl,
        jobTitle: 'Full-stack developer',
        sameAs: contact.socials.map((s) => s.href),
      }),
    ),
  }}
/>
```

(Add the imports at the top of `layout.tsx`.)

- [ ] **Step 6: Mount `BreadcrumbList` on `/projects/[slug]`**

Open `src/app/projects/[slug]/page.tsx`. After the existing breadcrumb component, before the project hero, render a JSON-LD script:

```tsx
import Script from 'next/script';
import { breadcrumbListSchema } from '@/lib/jsonld';

// inside the page component, after `params` resolution and project lookup:
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';
const crumbs = [
  { name: 'Home', url: `${siteUrl}/` },
  { name: 'Projects', url: `${siteUrl}/projects` },
  { name: project.title, url: `${siteUrl}/projects/${project.slug}` },
];

// in the JSX:
<Script
  id={`ld-bc-${project.slug}`}
  type="application/ld+json"
  // eslint-disable-next-line react/no-danger
  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema(crumbs)) }}
/>
```

- [ ] **Step 7: Mount `BreadcrumbList` on `/oss`**

In `src/app/oss/page.tsx`, near the top of the JSX:

```tsx
<Script
  id="ld-bc-oss"
  type="application/ld+json"
  // eslint-disable-next-line react/no-danger
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      breadcrumbListSchema([
        { name: 'Home', url: `${siteUrl}/` },
        { name: 'Open Source', url: `${siteUrl}/oss` },
      ]),
    ),
  }}
/>
```

(Add the imports + a local `siteUrl` constant.)

- [ ] **Step 8: Verify**

```bash
npm run typecheck && npm run lint && npm test -- --run --reporter=basic && npm run build
```

- [ ] **Step 9: Manual sanity check**

```bash
npm run dev
```

Visit each page, view source, confirm a `<script type="application/ld+json">` is present with the expected schema.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(seo): JSON-LD Person on root layout + BreadcrumbList on /projects/[slug] and /oss"
```

---

### Task 22: Final verification

**Files:** none modified — pure verification gate.

- [ ] **Step 1: Full unit suite**

```bash
npm test -- --run --reporter=basic
```

Expected: all tests pass.

- [ ] **Step 2: Typecheck + lint + format**

```bash
npm run typecheck && npm run lint && npm run format:check
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: succeeds, no warnings about missing files or unused exports.

- [ ] **Step 4: Full e2e suite**

```bash
npm run test:e2e
```

Expected: all 3 spec files (home, oss, projects) pass.

- [ ] **Step 5: Manual smoke (5-second test)**

```bash
npm run dev
```

- Open `/`. Read for 5 seconds. Can a stranger describe what you do?
- Mouse-move the hero — shader should respond subtly.
- Click "View work" → smooth scroll to projects.
- Open `/oss` → constellation animates above PR table; click a node → table filters.
- Open `/projects/b2b-marketplace` → 7 sections present (Context, My role, Architecture, Key technical decisions, Constraints, What I'd do differently, Tech stack).
- Open Footer → Resume (PDF) link downloads the placeholder.
- Toggle OS reduce-motion → reload `/` and `/oss` → no orbits, no shader animation.

- [ ] **Step 6: Lighthouse manual run** (Chrome DevTools, Incognito)

Targets: performance ≥90, accessibility 100, best-practices 100, SEO 100.

If any score misses: investigate before declaring Phase 1 done. Common causes:
- Performance < 90: r3f bundle size — verify `dynamic()` import or `Suspense` is doing its job; check Network tab for unexpected payloads.
- A11y < 100: a missing `alt`, contrast issue, or missing label — DevTools Accessibility tree shows the offender.

- [ ] **Step 7: Commit any final tweaks (if any)**

```bash
git add -A
git commit -m "chore: final Phase 1 polish from verification pass" || echo "nothing to commit"
```

- [ ] **Step 8: Done — Phase 1 ships**

Phase 2 (writing route, scroll reveals, Cal.com URL when supplied, real resume PDF, BlogPosting JSON-LD, /writing OG images) gets its own plan after this lands. The defaults for "Available for" and Cal.com remain placeholders until Maruthan supplies the real values.

---

## Self-Review

**Spec coverage check:**

| Spec § | Where in plan |
|---|---|
| §4.1 Cuts | Tasks 2, 3, 4, 5, 6 (Typewriter), 7 (HeroBackground) |
| §4.2 Adds | Tasks 7+8 (Hero shader), 14+15+16 (constellation), 19 (resume), 20 (OG), 21 (JSON-LD), 9 (Available for), 10 (TechStack), 11 (Featured trim), 12 (OSS quote cards), 13 (Cal.com), 6 (Hero copy) |
| §5.1 Hero shader | Tasks 7, 8 |
| §5.2 OSS constellation | Tasks 14, 15, 16 |
| §5.3 Scroll reveals | Phase 2 — not in this plan (per spec §11) |
| §6 Case study format | Task 17 |
| §7 Content rewrites | Tasks 6, 9, 10, 11, 12, 13 |
| §8 IA | Unchanged in Phase 1 (no new routes) |
| §9 Tech additions: `/writing` | Phase 2 |
| §9 Resume PDF | Task 19 |
| §9 Per-route OG | Task 20 |
| §9 JSON-LD Person + Breadcrumb | Task 21; BlogPosting → Phase 2 |
| §9 Cal.com placeholder | Task 13 |
| §9 reduced-motion audit | Tasks 8, 15 |
| §11 Phasing | Followed: Phase 1 in this plan, Phase 2 deferred |
| §12 Success criteria | Task 22 |

**Placeholder scan:** None. The Cal.com URL and the resume PDF binary are explicitly called out as user-supplied artifacts in §13 of the spec; the plan installs a placeholder PDF and an undefined `scheduleHref` so the code paths exist.

**Type consistency:** `OssPrTable` gains a `projectFilter?: string | null` prop in Task 16 — Task 15's `OssConstellation` exposes `selectedProject: string | null` and `onSelectProject: (name: string | null) => void`, and the new `OssExplorer` uses `useState<string | null>` to bridge them. Naming consistent.

**Scope:** 22 tasks, ~5 days. No hidden subsystems — Phase 2 is a separate spec section and gets its own plan.
