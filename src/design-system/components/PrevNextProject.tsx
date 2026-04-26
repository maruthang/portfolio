import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PrevNextItem {
  slug: string;
  title: string;
}

export function PrevNextProject({ prev, next }: { prev?: PrevNextItem; next?: PrevNextItem }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className="grid gap-4 border-t border-[var(--border)] pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/projects/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-md border border-[var(--border)] p-4 transition-colors hover:border-[var(--color-brand-500)]/60"
        >
          <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <ArrowLeft className="h-3 w-3" /> Previous
          </span>
          <span className="font-mono text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--color-brand-500)]">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-col gap-1 rounded-md border border-[var(--border)] p-4 text-right transition-colors hover:border-[var(--color-brand-500)]/60"
        >
          <span className="flex items-center justify-end gap-2 text-xs text-[var(--muted)]">
            Next <ArrowRight className="h-3 w-3" />
          </span>
          <span className="font-mono text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--color-brand-500)]">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
