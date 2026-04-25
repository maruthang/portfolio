import { describe, it, expect } from 'vitest';
import { tokensToCss } from '@/../scripts/generate-tokens-css';

describe('tokensToCss', () => {
  it('emits a :root block', () => {
    const css = tokensToCss();
    expect(css).toMatch(/^:root\s*\{/m);
  });

  it('emits brand color custom properties', () => {
    const css = tokensToCss();
    expect(css).toContain('--color-brand-500: #58a6ff;');
    expect(css).toContain('--color-brand-50: #e6f1ff;');
  });

  it('emits spacing custom properties', () => {
    const css = tokensToCss();
    expect(css).toContain('--spacing-4: 1rem;');
  });

  it('emits radius custom properties', () => {
    const css = tokensToCss();
    expect(css).toContain('--radius-md: 0.5rem;');
  });

  it('emits motion custom properties', () => {
    const css = tokensToCss();
    expect(css).toContain('--duration-base: 250ms;');
    expect(css).toContain('--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);');
  });

  it('emits semantic color properties', () => {
    const css = tokensToCss();
    expect(css).toContain('--color-semantic-success: #3fb950;');
  });
});
