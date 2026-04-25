import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/design-system/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ eyebrow, title, description, className, children, ...props }, ref) => (
    <section ref={ref} className={cn('scroll-mt-20 py-20', className)} {...props}>
      {(eyebrow || title || description) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="font-mono text-sm tracking-wide text-[var(--color-brand-500)] uppercase">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="mt-2 font-mono text-3xl font-bold sm:text-4xl">{title}</h2>}
          {description && <p className="mt-3 text-[var(--muted)]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  ),
);
Section.displayName = 'Section';
