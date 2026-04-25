import { describe, it, expect } from 'vitest';
import { cn } from '@/design-system/utils/cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
  });

  it('merges conflicting Tailwind classes — last wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('honors conditional class objects', () => {
    expect(cn('base', { active: true, inactive: false })).toBe('base active');
  });
});
