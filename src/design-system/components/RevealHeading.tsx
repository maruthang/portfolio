'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentProps } from 'react';

export function RevealHeading({ children, ...props }: ComponentProps<'h2'>) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <h2 className="mt-10 font-mono text-2xl font-bold sm:text-3xl" {...props}>
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-10 font-mono text-2xl font-bold sm:text-3xl"
      {...(props as object)}
    >
      {children}
    </motion.h2>
  );
}
