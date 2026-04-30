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
        Full-stack developer building production B2B systems and contributing to the dev tools I use
        every day.
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
