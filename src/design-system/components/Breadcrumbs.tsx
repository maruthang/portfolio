import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--fg)]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--fg)]">{item.label}</span>
            )}
            {i < items.length - 1 && (
              <ChevronRight className="h-3 w-3 text-[var(--muted)]" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
