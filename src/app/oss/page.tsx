import type { Metadata } from 'next';
import { Section } from '@/design-system/components/Section';
import { Card } from '@/design-system/components/Card';
import { OssPrTable } from '@/design-system/components/OssPrTable';
import { ossStats, ossProjects, ossAllPrs } from '@/content/oss';

export const metadata: Metadata = {
  title: 'Open Source — Maruthan G',
  description: 'Full open-source contribution history across NestJS, VS Code, BullMQ, and more.',
};

export default function OssPage() {
  return (
    <Section
      eyebrow="Open Source"
      title="Every contribution"
      description="The full searchable list. Click any PR to verify on GitHub."
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
          <p className="text-sm text-[var(--muted)]">Open PRs</p>
        </Card>
        <Card>
          <p className="font-mono text-4xl font-bold text-[var(--fg)]">{ossStats.projectCount}</p>
          <p className="text-sm text-[var(--muted)]">OSS projects</p>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="mb-4 font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
          By project
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {ossProjects.map((p) => (
            <li key={p.name} className="rounded-md border border-[var(--border)] p-3">
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-[var(--fg)] hover:text-[var(--color-brand-500)]"
              >
                {p.name}
              </a>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {p.merged} merged · {p.open} open · {p.focus}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <h3 className="mb-4 font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
          All pull requests
        </h3>
        <OssPrTable prs={ossAllPrs} />
      </div>
    </Section>
  );
}
