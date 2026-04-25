'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';

export function BootLoader() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setGone(true);
      return;
    }
    let active = true;
    const start = performance.now();
    const duration = 800;

    const tick = () => {
      if (!active) return;
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setCount(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setGone(true), 200);
      }
    };
    requestAnimationFrame(tick);

    return () => {
      active = false;
    };
  }, [reduced]);

  if (reduced || gone) return null;

  return (
    <div className="boot-loader" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="boot-counter">{count}</div>
      <div
        className="boot-bar"
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="boot-fill" style={{ width: `${count}%` }} />
      </div>
      <div className="boot-text">Maruthan G</div>
    </div>
  );
}
