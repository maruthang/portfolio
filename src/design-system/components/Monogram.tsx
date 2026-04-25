import { cn } from '@/design-system/utils/cn';

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-brand-500)] font-mono text-base font-bold text-white',
        className,
      )}
    >
      <span>M</span>
    </span>
  );
}
