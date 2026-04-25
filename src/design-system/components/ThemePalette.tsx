'use client';

import { Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/design-system/utils/cn';

const ACCENTS = [
  { id: 'blue', label: 'Blue', hex: '#58a6ff' },
  { id: 'cyan', label: 'Cyan', hex: '#00e5c8' },
  { id: 'orange', label: 'Orange', hex: '#ff7a45' },
  { id: 'magenta', label: 'Magenta', hex: '#ff3da6' },
] as const;

type AccentId = (typeof ACCENTS)[number]['id'];
const STORAGE_KEY = 'portfolio-accent';
const DEFAULT_ACCENT: AccentId = 'blue';

export function ThemePalette({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<AccentId>(DEFAULT_ACCENT);

  useEffect(() => {
    const saved =
      (typeof localStorage !== 'undefined'
        ? (localStorage.getItem(STORAGE_KEY) as AccentId | null)
        : null) ?? DEFAULT_ACCENT;
    setCurrent(saved);
    document.documentElement.setAttribute('data-accent', saved);
  }, []);

  const choose = (id: AccentId) => {
    setCurrent(id);
    document.documentElement.setAttribute('data-accent', id);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, id);
    setOpen(false);
  };

  const currentHex = ACCENTS.find((a) => a.id === current)?.hex ?? ACCENTS[0]!.hex;

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Change accent color"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface)]"
      >
        <Palette className="h-4 w-4" />
        <span
          aria-hidden="true"
          className="absolute right-1 bottom-1 h-2 w-2 rounded-full border border-[var(--bg)]"
          style={{ background: currentHex }}
        />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Accent color"
          className="absolute top-full right-0 z-30 mt-2 flex gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg"
        >
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-label={`Accent: ${a.label}`}
              onClick={() => choose(a.id)}
              className={cn(
                'h-7 w-7 rounded-full border transition-transform hover:scale-110',
                current === a.id
                  ? 'border-[var(--fg)] ring-2 ring-[var(--fg)] ring-offset-2 ring-offset-[var(--surface)]'
                  : 'border-[var(--border)]',
              )}
              style={{ background: a.hex }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
