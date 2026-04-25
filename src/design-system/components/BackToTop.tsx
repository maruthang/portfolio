'use client';

import { ArrowUp } from 'lucide-react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';
import { cn } from '@/design-system/utils/cn';

export function BackToTop({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition-colors hover:border-[var(--color-brand-500)]/60 hover:text-[var(--color-brand-500)]',
        className,
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
