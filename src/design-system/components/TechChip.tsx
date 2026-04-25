import { cn } from '@/design-system/utils/cn';
import type { Tech } from '@/content/techStack';

export function TechChip({ tech }: { tech: Tech }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs',
        tech.learning
          ? 'border-[var(--color-warning)]/40 text-[var(--color-warning)]'
          : 'border-[var(--border)] text-[var(--fg)] hover:border-[var(--color-brand-500)]/60',
      )}
      title={tech.proficiency ?? (tech.learning ? 'Currently learning' : undefined)}
    >
      {tech.name}
      {tech.learning && <span aria-hidden> ◌</span>}
    </span>
  );
}
