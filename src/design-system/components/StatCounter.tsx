'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';

export interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export function StatCounter({ value, label, suffix = '' }: StatCounterProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 80 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (reduced) return;
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue, reduced]);

  return (
    <div ref={ref} className="space-y-1">
      <p className="font-mono text-3xl font-bold text-[var(--fg)] sm:text-4xl">
        {reduced ? `${value}${suffix}` : <motion.span>{display}</motion.span>}
      </p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
