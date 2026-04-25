import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Typewriter } from '@/design-system/components/Typewriter';

describe('Typewriter', () => {
  it('renders the first word immediately, statically, with reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    render(<Typewriter words={['Full Stack', 'OSS']} />);
    expect(screen.getByText('Full Stack')).toBeInTheDocument();
  });

  it('renders the typed prefix while typing', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    vi.useFakeTimers();
    render(<Typewriter words={['Hello']} typingSpeedMs={10} pauseMs={50} />);
    await act(async () => {
      vi.advanceTimersByTime(40);
    });
    const node = document.querySelector('[data-testid="typewriter"]');
    expect(node?.textContent ?? '').toContain('Hell');
    vi.useRealTimers();
  });

  it('renders an aria-live polite region for accessibility', () => {
    render(<Typewriter words={['x']} />);
    const node = document.querySelector('[data-testid="typewriter"]');
    expect(node?.getAttribute('aria-live')).toBe('polite');
  });
});
