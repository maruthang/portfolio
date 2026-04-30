import { ArrowUpRight } from 'lucide-react';
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
        {frontmatter.tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]"
          >
            {t}
          </span>
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
