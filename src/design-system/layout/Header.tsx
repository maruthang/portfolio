import Link from 'next/link';
import { ThemeToggle } from '@/design-system/components/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-semibold">
          maruthan<span className="text-[var(--color-brand-500)]">.dev</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/projects" className="text-[var(--muted)] hover:text-[var(--fg)]">
            Projects
          </Link>
          <Link href="/blog" className="text-[var(--muted)] hover:text-[var(--fg)]">
            Blog
          </Link>
          <Link href="/oss" className="text-[var(--muted)] hover:text-[var(--fg)]">
            OSS
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
