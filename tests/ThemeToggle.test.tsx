import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/design-system/components/ThemeToggle';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {ui}
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  it('renders an accessible toggle button', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('switches html class from light to dark on click', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
