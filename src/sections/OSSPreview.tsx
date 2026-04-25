import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/design-system/components/Section';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { ossStats, ossProjects, ossHighlights } from '@/content/oss';

export function OSSPreview() {
  return (
    <Section
      id="oss"
      eyebrow="04 / Open Source"
      title="Open source contributions"
      description="The work I'm proudest of. Full table with every PR will live at /oss."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="font-mono text-4xl font-bold text-[var(--color-brand-500)]">
            {ossStats.totalMerged}
          </p>
          <p className="text-sm text-[var(--muted)]">Merged PRs</p>
        </Card>
        <Card>
          <p className="font-mono text-4xl font-bold text-[var(--fg)]">{ossStats.totalOpen}</p>
          <p className="text-sm text-[var(--muted)]">Open PRs in flight</p>
        </Card>
        <Card>
          <p className="font-mono text-4xl font-bold text-[var(--fg)]">{ossStats.projectCount}</p>
          <p className="text-sm text-[var(--muted)]">OSS projects</p>
        </Card>
      </div>

      <div className="mt-10 grid gap-3">
        <h3 className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
          Recent merged highlights
        </h3>
        {ossHighlights.map((h) => (
          <a
            key={h.href}
            href={h.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-start justify-between gap-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--color-brand-500)]/60"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[var(--color-brand-500)]">{h.project}</span>
                <Badge>{h.pr}</Badge>
              </div>
              <p className="text-sm text-[var(--fg)]">{h.title}</p>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)]" />
          </a>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="mb-3 font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
          Currently contributing to
        </h3>
        <div className="flex flex-wrap gap-2">
          {ossProjects.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--border)] px-3 py-1.5 font-mono text-xs text-[var(--fg)] transition-colors hover:border-[var(--color-brand-500)]/60"
              title={p.focus}
            >
              {p.name}{' '}
              <span className="text-[var(--muted)]">
                ({p.merged} merged · {p.open} open)
              </span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
