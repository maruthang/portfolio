import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-sm tracking-wide text-[var(--color-brand-500)] uppercase">404</p>
      <h1 className="font-mono text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="max-w-md text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-brand-500)] px-4 text-base font-medium text-white hover:bg-[var(--color-brand-600)]"
        >
          Back home
        </Link>
        <Link
          href="/projects"
          className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 text-base font-medium text-[var(--fg)] hover:bg-[var(--surface)]"
        >
          See projects
        </Link>
      </div>
    </div>
  );
}
