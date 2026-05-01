'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentProps } from 'react';

export function RevealCodeBlock({ children, ...props }: ComponentProps<'pre'>) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <pre
        className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    );
  }

  return (
    <motion.pre
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed"
      {...(props as object)}
    >
      {children}
    </motion.pre>
  );
}
