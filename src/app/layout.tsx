import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/design-system/layout/Header';
import { Footer } from '@/design-system/layout/Footer';
import { CustomCursor } from '@/design-system/components/CustomCursor';
import { BootLoader } from '@/design-system/components/BootLoader';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Maruthan G — Portfolio',
    template: '%s · Maruthan G',
  },
  description:
    'Full-stack developer at Finstein. OSS contributor across NestJS, VS Code, BullMQ, Node.js undici.',
  openGraph: {
    type: 'website',
    siteName: 'Maruthan G',
    url: siteUrl,
    title: 'Maruthan G — Portfolio',
    description: 'Full-stack developer and OSS contributor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maruthan G — Portfolio',
    description: 'Full-stack developer and OSS contributor',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BootLoader />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <CustomCursor />
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
