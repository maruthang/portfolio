import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Monogram } from '@/design-system/components/Monogram';

describe('Monogram', () => {
  it('renders the M letter', () => {
    render(<Monogram />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('marks itself decorative for screen readers', () => {
    render(<Monogram />);
    const node = screen.getByText('M').parentElement;
    expect(node?.getAttribute('aria-hidden')).toBe('true');
  });

  it('forwards a className when provided', () => {
    const { container } = render(<Monogram className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
