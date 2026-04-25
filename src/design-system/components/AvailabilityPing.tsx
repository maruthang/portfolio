import type { ReactNode } from 'react';
import { cn } from '@/design-system/utils/cn';

export function AvailabilityPing({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-3 py-1 text-xs font-medium text-[var(--color-success)]',
        className,
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          data-testid="ping-halo"
          aria-hidden="true"
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75"
        />
        <span
          data-testid="ping-dot"
          aria-hidden="true"
          className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]"
        />
      </span>
      {children}
    </span>
  );
}
