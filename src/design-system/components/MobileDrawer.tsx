'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/design-system/utils/cn';

interface DrawerLink {
  href: string;
  label: string;
}

export function MobileDrawer({ links }: { links: DrawerLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--fg)] hover:bg-[var(--surface)] md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={cn(
              'fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col border-l border-[var(--border)] bg-[var(--bg)] p-6 shadow-xl md:hidden',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm uppercase tracking-wide text-[var(--muted)]">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--fg)] hover:bg-[var(--surface)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-base text-[var(--fg)] hover:bg-[var(--surface)]"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
