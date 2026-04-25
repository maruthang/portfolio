import Link from 'next/link';
import { ThemeToggle } from '@/design-system/components/ThemeToggle';
import { ThemePalette } from '@/design-system/components/ThemePalette';
import { MobileDrawer } from '@/design-system/components/MobileDrawer';

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/oss', label: 'OSS' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-semibold">
          maruthan<span className="text-[var(--color-brand-500)]">.dev</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[var(--muted)] hover:text-[var(--fg)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemePalette />
          <ThemeToggle />
          <MobileDrawer links={navLinks} />
        </div>
      </div>
    </header>
  );
}
