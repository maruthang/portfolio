import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OssPrTable } from '@/design-system/components/OssPrTable';
import type { OssPr } from '@/content/oss';

const sample: OssPr[] = [
  {
    project: 'nestjs/swagger',
    number: 3803,
    title: 'fix(plugin): skip auto-generated decorator',
    href: 'https://example.test/1',
    status: 'merged',
    mergedOn: '2026-02-10',
  },
  {
    project: 'microsoft/vscode',
    number: 307960,
    title: 'fix: handle heredoc in terminal',
    href: 'https://example.test/2',
    status: 'merged',
    mergedOn: '2026-03-08',
  },
  {
    project: 'nodejs/undici',
    number: 5100,
    title: 'feat: per-request throwOnMaxRedirect',
    href: 'https://example.test/3',
    status: 'open',
  },
];

describe('OssPrTable', () => {
  it('renders all PRs by default', () => {
    render(<OssPrTable prs={sample} />);
    expect(screen.getByText(/skip auto-generated/i)).toBeInTheDocument();
    expect(screen.getByText(/handle heredoc/i)).toBeInTheDocument();
    expect(screen.getByText(/throwOnMaxRedirect/i)).toBeInTheDocument();
  });

  it('filters by search input on PR title', async () => {
    const user = userEvent.setup();
    render(<OssPrTable prs={sample} />);
    const search = screen.getByPlaceholderText(/search/i);
    await user.type(search, 'heredoc');
    expect(screen.getByText(/handle heredoc/i)).toBeInTheDocument();
    expect(screen.queryByText(/skip auto-generated/i)).not.toBeInTheDocument();
  });

  it('filters by status when "Open" filter is clicked', async () => {
    const user = userEvent.setup();
    render(<OssPrTable prs={sample} />);
    await user.click(screen.getByRole('button', { name: /open$/i }));
    expect(screen.getByText(/throwOnMaxRedirect/i)).toBeInTheDocument();
    expect(screen.queryByText(/skip auto-generated/i)).not.toBeInTheDocument();
  });

  it('shows result count', () => {
    render(<OssPrTable prs={sample} />);
    expect(screen.getByText(/3 of 3/i)).toBeInTheDocument();
  });
});
