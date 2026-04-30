import { HeroBackground } from '@/design-system/visuals/HeroBackground';
import { AvailabilityPing } from '@/design-system/components/AvailabilityPing';
import { Badge } from '@/design-system/components/Badge';
import { Typewriter } from '@/design-system/components/Typewriter';
import { contact } from '@/content/contact';

const ROLES = ['Full Stack Developer', 'OSS Contributor', 'Bug Hunter', 'Tooling Builder'];

const buttonBase =
  'inline-flex h-10 items-center justify-center rounded-md px-4 text-base font-medium transition-colors';
const primaryStyles = `${buttonBase} bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]`;
const outlineStyles = `${buttonBase} border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface)]`;
const ghostStyles = `${buttonBase} text-[var(--fg)] hover:bg-[var(--surface)]`;

export function Hero() {
  return (
    <section className="relative py-20 sm:py-32">
      <HeroBackground />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <AvailabilityPing>{contact.availability}</AvailabilityPing>
        <Badge>{contact.location}</Badge>
      </div>

      <h1 className="mt-6 font-mono text-4xl leading-tight font-bold sm:text-6xl">
        <span className="hero-line hero-line-1">
          Hi, I&apos;m <span className="text-[var(--color-brand-500)]">Maruthan</span>
        </span>
        <span className="hero-line hero-line-2 text-[var(--muted)]">
          <Typewriter words={ROLES} />
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
        Full-stack developer at Finstein shipping production web and mobile apps across NestJS,
        Next.js, Angular, and React Native. Active OSS contributor — 57 merged PRs across VS Code,
        NestJS, Node.js undici, BullMQ, and more.
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
