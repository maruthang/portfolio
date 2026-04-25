import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMagneticHover } from '@/design-system/motion/useMagneticHover';

describe('useMagneticHover', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useMagneticHover());
    expect(result.current).toHaveProperty('current');
  });

  it('does not throw when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    const { result } = renderHook(() => useMagneticHover());
    expect(result.current).toHaveProperty('current');
  });
});
