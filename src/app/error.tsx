'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] runtime error', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-sm tracking-wide text-[var(--color-error)] uppercase">Error</p>
      <h1 className="font-mono text-3xl font-bold sm:text-4xl">Something went wrong</h1>
      <p className="max-w-md text-[var(--muted)]">
        An unexpected error occurred while rendering this page.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-brand-500)] px-4 text-base font-medium text-white hover:bg-[var(--color-brand-600)]"
      >
        Try again
      </button>
    </div>
  );
}
