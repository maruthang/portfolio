import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileDrawer } from '@/design-system/components/MobileDrawer';

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#blog', label: 'Blog' },
];

describe('MobileDrawer', () => {
  it('is closed by default', () => {
    render(<MobileDrawer links={links} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens when the toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileDrawer links={links} />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileDrawer links={links} />);
    await user.click(screen.getByRole('button', { name: /open menu/i }));
    await user.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
