import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/design-system/components/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('applies primary variant class by default', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-\[var\(--color-brand-500\)\]/);
  });

  it('applies ghost variant when specified', () => {
    render(<Button variant="ghost">X</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toMatch(/bg-transparent/);
    expect(cls).not.toMatch(/bg-\[var\(--color-brand-500\)\]/);
  });

  it('disables when disabled prop set', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards type attribute', () => {
    render(<Button type="submit">X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
