import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion, getReducedMotion } from '@/design-system/motion/reducedMotion';

function setMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('reducedMotion', () => {
  beforeEach(() => {
    setMatchMedia(false);
  });

  it('getReducedMotion returns false when prefers-reduced-motion: no-preference', () => {
    setMatchMedia(false);
    expect(getReducedMotion()).toBe(false);
  });

  it('getReducedMotion returns true when prefers-reduced-motion: reduce', () => {
    setMatchMedia(true);
    expect(getReducedMotion()).toBe(true);
  });

  it('useReducedMotion hook returns the current preference', () => {
    setMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('useReducedMotion returns false on first render when no media query support', () => {
    Object.defineProperty(window, 'matchMedia', { writable: true, value: undefined });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
