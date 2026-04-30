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
