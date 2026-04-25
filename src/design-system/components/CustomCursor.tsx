'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/design-system/motion/reducedMotion';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    document.body.classList.add('has-custom-cursor');

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let raf = 0;
    let mx = -100;
    let my = -100;
    let dx = -100;
    let dy = -100;

    const tick = () => {
      dx += (mx - dx) * 0.18;
      dy += (my - dy) * 0.18;
      ring.style.transform = `translate(${dx}px, ${dy}px)`;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      ring.classList.add('cc-ring--visible');
      dot.classList.add('cc-dot--visible');
    };

    const isHoverTarget = (el: Element | null): boolean => {
      while (el) {
        const tag = el.tagName;
        if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return true;
        if (el instanceof HTMLElement && el.dataset.cursorHover) return true;
        el = el.parentElement;
      }
      return false;
    };

    const onOver = (e: MouseEvent) => {
      if (isHoverTarget(e.target as Element)) ring.classList.add('cc-ring--hover');
      else ring.classList.remove('cc-ring--hover');
    };
    const onDown = () => ring.classList.add('cc-ring--click');
    const onUp = () => ring.classList.remove('cc-ring--click');
    const onLeave = () => {
      ring.classList.remove('cc-ring--visible');
      dot.classList.remove('cc-dot--visible');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div ref={ringRef} className="cc-ring" aria-hidden="true" />
      <div ref={dotRef} className="cc-dot" aria-hidden="true" />
    </>
  );
}
