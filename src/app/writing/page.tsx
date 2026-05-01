import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/design-system/components/Section';
import { getAllPostsSortedByDate } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing — Maruthan G',
  description: 'Notes on engineering, OSS, and the trade-offs behind production systems.',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function WritingIndexPage() {
  const posts = getAllPostsSortedByDate();
  return (
    <Section
      eyebrow="Writing"
      title="Notes from the work"
      description="Engineering trade-offs, OSS contribution patterns, and lessons from production."
    >
      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {posts.map((p) => (
            <li key={p.slug} className="py-6">
              <Link href={`/writing/${p.slug}`} className="group block">
                <p className="font-mono text-xs text-[var(--muted)]">{formatDate(p.date)}</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--fg)] group-hover:text-[var(--color-brand-500)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-[var(--muted)]">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
