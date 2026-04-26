import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '@/design-system/components/Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders all items', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Projects', href: '/projects' }, { label: 'B2B Marketplace' }]}
      />,
    );
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('B2B Marketplace')).toBeInTheDocument();
  });

  it('renders link for items with href', () => {
    render(<Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: 'Detail' }]} />);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveAttribute('href', '/projects');
  });

  it('renders the last item as plain text (no link) when no href', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Detail' }]} />);
    expect(screen.queryByRole('link', { name: 'Detail' })).not.toBeInTheDocument();
  });
});
