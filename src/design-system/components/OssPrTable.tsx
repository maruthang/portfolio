'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import type { OssPr } from '@/content/oss';
import { cn } from '@/design-system/utils/cn';

type StatusFilter = 'all' | 'merged' | 'open';

export function OssPrTable({ prs }: { prs: OssPr[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prs.filter((pr) => {
      if (statusFilter !== 'all' && pr.status !== statusFilter) return false;
      if (!q) return true;
      return (
        pr.title.toLowerCase().includes(q) ||
        pr.project.toLowerCase().includes(q) ||
        String(pr.number).includes(q)
      );
    });
  }, [prs, query, statusFilter]);

  const filterButton = (label: string, value: StatusFilter) => (
    <button
      type="button"
      aria-pressed={statusFilter === value}
      onClick={() => setStatusFilter(value)}
      className={cn(
        'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
        statusFilter === value
          ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]'
          : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]',
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          />
          <input
            type="text"
            aria-label="Search pull requests"
            placeholder="Search PRs by title, project, or number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] py-2 pr-3 pl-9 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--color-brand-500)] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {filterButton('All', 'all')}
          {filterButton('Merged', 'merged')}
          {filterButton('Open', 'open')}
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Showing {filtered.length} of {prs.length}
      </p>

      <div className="overflow-hidden rounded-md border border-[var(--border)]">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface)] text-xs text-[var(--muted)] uppercase">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Project</th>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Merged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((pr) => (
              <tr key={`${pr.project}-${pr.number}`} className="hover:bg-[var(--surface)]/50">
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-brand-500)]">
                  {pr.project}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={pr.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--fg)] hover:underline"
                  >
                    #{pr.number} {pr.title}
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-[var(--muted)]" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2 py-0.5 text-[11px]',
                      pr.status === 'merged'
                        ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                        : 'border-[var(--color-brand-500)]/30 bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]',
                    )}
                  >
                    {pr.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{pr.mergedOn ?? '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                  No PRs match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
