'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';
import { sectionReveal } from '@/design-system/motion/variants';
import { cn } from '@/design-system/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ eyebrow, title, description, className, children, ...props }, ref) => {
    const reduced = useReducedMotion();

    return (
      <motion.section
        ref={ref}
        className={cn('scroll-mt-20 py-20', className)}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.2 }}
        variants={reduced ? undefined : sectionReveal}
        {...(props as Record<string, unknown>)}
      >
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
      </motion.section>
    );
  },
);
Section.displayName = 'Section';
