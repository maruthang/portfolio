'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';

const SESSION_KEY = 'portfolio-booted';

export function BootLoader() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [shouldRun, setShouldRun] = useState<boolean | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShouldRun(false);
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setShouldRun(false);
        return;
      }
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage unavailable — fall through and run boot.
    }
    setShouldRun(true);
  }, [reduced]);

  useEffect(() => {
    if (!shouldRun) return;
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
  }, [shouldRun]);

  if (!shouldRun || gone) return null;

  return (
    <div className="boot-loader" role="status" aria-label="Loading portfolio">
      <div aria-hidden="true" className="boot-counter">
        {count}
      </div>
      <div
        aria-hidden="true"
        className="boot-bar"
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="boot-fill" style={{ width: `${count}%` }} />
      </div>
      <div aria-hidden="true" className="boot-text">
        Maruthan G
      </div>
    </div>
  );
}
