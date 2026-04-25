import { describe, it, expect } from 'vitest';
import { colors, spacing, typography } from '@/design-system/tokens';

describe('design tokens', () => {
  it('exposes the brand color scale 50-950', () => {
    const expectedKeys = [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      '950',
    ];
    expect(Object.keys(colors.brand)).toEqual(expectedKeys);
  });

  it('uses VSCode-blue as the brand 500 accent', () => {
    expect(colors.brand[500]).toBe('#58a6ff');
  });

  it('uses a 4px spacing base scale', () => {
    expect(spacing['1']).toBe('0.25rem');
    expect(spacing['4']).toBe('1rem');
  });

  it('declares CSS-variable-based font families', () => {
    expect(typography.fontFamily.sans[0]).toBe('var(--font-geist-sans)');
    expect(typography.fontFamily.mono[0]).toBe('var(--font-geist-mono)');
  });
});
