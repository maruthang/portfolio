import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/design-system/layout/Header';
import { Footer } from '@/design-system/layout/Footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maruthan G — Portfolio',
  description: 'Full-stack developer and OSS contributor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main
            id="main-content"
            className="mx-auto min-h-[calc(100vh-3.5rem-6rem)] max-w-5xl px-4 py-12"
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
