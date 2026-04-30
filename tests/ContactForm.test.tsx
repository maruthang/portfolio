import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/design-system/components/ContactForm';

describe('ContactForm', () => {
  it('renders name, email, message fields and submit button', () => {
    render(<ContactForm action={vi.fn()} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows validation error on short message', async () => {
    const user = userEvent.setup();
    render(<ContactForm action={vi.fn()} />);
    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'short');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
  });

  it('calls action with valid input and shows success state', async () => {
    const action = vi.fn().mockResolvedValue({ status: 'ok' });
    const user = userEvent.setup();
    render(<ContactForm action={action} />);
    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there, this is plenty long enough.');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane',
        email: 'jane@example.com',
        message: 'Hello there, this is plenty long enough.',
      }),
    );
    // Honeypot must remain empty for legitimate submissions.
    expect(action.mock.calls[0]![0]).toMatchObject({ company: '' });
  });

  it('shows mailto fallback link when action returns fallback', async () => {
    const action = vi.fn().mockResolvedValue({
      status: 'fallback',
      mailtoHref: 'mailto:test@example.com',
    });
    const user = userEvent.setup();
    render(<ContactForm action={action} />);
    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there, this is plenty long enough.');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    const link = await screen.findByRole('link', { name: /open email client/i });
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
  });
});
