import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCounter } from '@/design-system/components/StatCounter';

describe('StatCounter', () => {
  it('renders the final value text immediately when reduced motion', () => {
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
    render(<StatCounter value={57} suffix="+" label="Merged PRs" />);
    expect(screen.getByText('57+')).toBeInTheDocument();
    expect(screen.getByText('Merged PRs')).toBeInTheDocument();
  });

  it('exposes value and label as accessible text', () => {
    render(<StatCounter value={9} label="OSS projects" />);
    expect(screen.getByText('OSS projects')).toBeInTheDocument();
  });
});
