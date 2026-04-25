'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { LenisProvider } from '@/design-system/motion/LenisProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  );
}
