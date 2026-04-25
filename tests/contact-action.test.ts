import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendContactMessage } from '@/app/actions/contact';
import { contactSchema } from '@/app/actions/contact-schema';

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: 'test' }, error: null }),
    };
  },
}));

describe('contactSchema', () => {
  it('accepts valid input', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello there, this is a longer message body.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short message', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      message: 'A perfectly fine length message.',
    });
    expect(result.success).toBe(false);
  });
});

describe('sendContactMessage', () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  it('returns a fallback status when RESEND_API_KEY is absent', async () => {
    const result = await sendContactMessage({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'A perfectly fine length message.',
    });
    expect(result.status).toBe('fallback');
    if (result.status === 'fallback') {
      expect(result.mailtoHref).toMatch(/^mailto:/);
    }
  });

  it('returns ok status when RESEND_API_KEY is present', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    const result = await sendContactMessage({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'A perfectly fine length message.',
    });
    expect(result.status).toBe('ok');
  });

  it('returns error status when input is invalid', async () => {
    const result = await sendContactMessage({
      name: '',
      email: 'bad',
      message: 'x',
    });
    expect(result.status).toBe('error');
    if (result.status === 'error') {
      expect(result.fieldErrors).toBeDefined();
    }
  });
});
