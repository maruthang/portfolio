import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePalette } from '@/design-system/components/ThemePalette';

describe('ThemePalette', () => {
  it('renders a trigger button', () => {
    render(<ThemePalette />);
    expect(screen.getByRole('button', { name: /change accent color/i })).toBeInTheDocument();
  });

  it('opens a popover with 4 swatches when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemePalette />);
    await user.click(screen.getByRole('button', { name: /change accent color/i }));
    expect(screen.getByRole('button', { name: /accent: blue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accent: cyan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accent: orange/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accent: magenta/i })).toBeInTheDocument();
  });

  it('sets data-accent on html when a swatch is selected', async () => {
    const user = userEvent.setup();
    render(<ThemePalette />);
    await user.click(screen.getByRole('button', { name: /change accent color/i }));
    await user.click(screen.getByRole('button', { name: /accent: cyan/i }));
    expect(document.documentElement.getAttribute('data-accent')).toBe('cyan');
  });
});
