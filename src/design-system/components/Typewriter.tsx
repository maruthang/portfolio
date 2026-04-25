'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';
import { cn } from '@/design-system/utils/cn';

export interface TypewriterProps {
  words: string[];
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseMs?: number;
  className?: string;
}

export function Typewriter({
  words,
  typingSpeedMs = 80,
  deletingSpeedMs = 40,
  pauseMs = 1500,
  className,
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [text, setText] = useState('');
  const stateRef = useRef({ index: 0, text: '', phase: 'typing' as 'typing' | 'deleting' });

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const s = stateRef.current;
      const current = words[s.index] ?? '';

      if (s.phase === 'typing') {
        if (s.text.length < current.length) {
          s.text = current.slice(0, s.text.length + 1);
          setText(s.text);
          timer = setTimeout(tick, typingSpeedMs);
          return;
        }
        timer = setTimeout(() => {
          s.phase = 'deleting';
          tick();
        }, pauseMs);
        return;
      }

      if (s.phase === 'deleting') {
        if (s.text.length > 0) {
          s.text = s.text.slice(0, -1);
          setText(s.text);
          timer = setTimeout(tick, deletingSpeedMs);
          return;
        }
        s.phase = 'typing';
        s.index = (s.index + 1) % words.length;
        timer = setTimeout(tick, typingSpeedMs);
      }
    };

    timer = setTimeout(tick, typingSpeedMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reduced, words, typingSpeedMs, deletingSpeedMs, pauseMs]);

  if (reduced) {
    return (
      <span data-testid="typewriter" aria-live="polite" className={className}>
        {words[0] ?? ''}
      </span>
    );
  }

  return (
    <span data-testid="typewriter" aria-live="polite" className={cn('inline-block', className)}>
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[0.05em] animate-pulse bg-[var(--color-brand-500)] align-middle" />
    </span>
  );
}
