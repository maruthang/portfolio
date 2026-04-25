import { techStack } from '@/content/techStack';

export function TechMarquee() {
  // Repeat the list twice so the loop is seamless
  const items = [...techStack, ...techStack];
  return (
    <div
      aria-hidden="true"
      className="relative -mx-4 overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div className="marquee-track flex w-max items-center gap-8 text-sm whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-[var(--muted)]">
            <span>{t.name}</span>
            <span className="text-[var(--color-brand-500)]/40">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
