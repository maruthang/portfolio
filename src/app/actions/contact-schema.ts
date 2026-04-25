import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { status: 'ok' }
  | { status: 'fallback'; mailtoHref: string }
  | { status: 'error'; fieldErrors?: Record<string, string[]>; message?: string };
