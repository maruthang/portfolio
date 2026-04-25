import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import type { Project } from '@/content/projects';

const statusVariant: Record<Project['status'], 'default' | 'success' | 'warning' | 'error'> = {
  live: 'success',
  archived: 'default',
  oss: 'default',
  learning: 'warning',
};

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  archived: 'Archived',
  oss: 'OSS',
  learning: 'Learning',
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col gap-4 transition-colors hover:border-[var(--color-brand-500)]/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-lg leading-tight font-semibold text-[var(--fg)]">
          {project.title}
        </h3>
        <Badge variant={statusVariant[project.status]}>{statusLabel[project.status]}</Badge>
      </div>

      <p className="text-sm text-[var(--muted)]">{project.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]"
          >
            {t}
          </span>
        ))}
      </div>

      {project.links && (
        <div className="mt-auto flex flex-wrap gap-3 text-sm">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[var(--color-brand-500)] hover:underline"
            >
              Live <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {project.links.case && (
            <a
              href={project.links.case}
              className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Case study →
            </a>
          )}
        </div>
      )}
    </Card>
  );
}
