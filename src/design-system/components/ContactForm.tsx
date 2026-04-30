'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/design-system/utils/cn';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

type ActionResult =
  | { status: 'ok' }
  | { status: 'fallback'; mailtoHref: string }
  | { status: 'error'; message?: string }
  | { status: 'rate_limited'; message: string };

interface ContactFormProps {
  action: (input: FormValues) => Promise<ActionResult>;
}

const fieldClass =
  'w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--color-brand-500)] focus:outline-none';

export function ContactForm({ action }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [result, setResult] = useState<ActionResult | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    const r = await action(values);
    setResult(r);
    if (r.status === 'ok') reset();
  });

  if (result?.status === 'ok') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="rounded-md border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4 text-sm text-[var(--color-success)]"
      >
        Thanks — your message is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-[var(--fg)]">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={fieldClass}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-[var(--color-error)]">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-[var(--fg)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={fieldClass}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-[var(--color-error)]">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-[var(--fg)]">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(fieldClass, 'resize-y')}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-[var(--color-error)]">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from users, baited for bots. */}
      <div aria-hidden="true" className="absolute left-[-10000px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-brand-500)] px-4 text-base font-medium text-white transition-colors hover:bg-[var(--color-brand-600)] disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>

      <div role="status" aria-live="polite" className="space-y-1">
        {result?.status === 'fallback' && (
          <p className="text-xs text-[var(--muted)]">
            Email isn&apos;t configured here yet —{' '}
            <a href={result.mailtoHref} className="text-[var(--color-brand-500)] hover:underline">
              open email client
            </a>{' '}
            to send directly.
          </p>
        )}

        {result?.status === 'rate_limited' && (
          <p className="text-xs text-[var(--color-error)]">{result.message}</p>
        )}

        {result?.status === 'error' && result.message && (
          <p className="text-xs text-[var(--color-error)]">{result.message}</p>
        )}
      </div>
    </form>
  );
}
