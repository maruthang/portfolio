import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroShader } from '@/design-system/visuals/HeroShader';

describe('HeroShader', () => {
  it('renders a static fallback (no canvas) under prefers-reduced-motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (q: string) => ({
        matches: q.includes('prefers-reduced-motion') ? true : false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    const { container } = render(<HeroShader />);
    expect(container.querySelector('[data-testid="hero-shader-fallback"]')).not.toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('marks the visual as decorative (aria-hidden) and non-interactive (pointer-events-none)', () => {
    const { container } = render(<HeroShader />);
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.getAttribute('aria-hidden')).toBe('true');
    expect(root!.className).toContain('pointer-events-none');
  });
});
