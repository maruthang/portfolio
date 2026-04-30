import { contact } from '@/content/contact';
import { BackToTop } from '@/design-system/components/BackToTop';

export function Footer() {
  const year = new Date().getFullYear();
  const built = process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString().slice(0, 10);

  return (
    <footer className="border-t border-[var(--border)] py-10 text-sm text-[var(--muted)]">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[var(--fg)]">
            maruthan<span className="text-[var(--color-brand-500)]">.dev</span>
          </p>
          <p className="mt-2">© {year} Maruthan G</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-wide uppercase">Connect</p>
          <ul className="mt-2 space-y-1">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--fg)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/resume.pdf" download className="hover:text-[var(--fg)]">
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-wide uppercase">Built with</p>
              <p className="mt-2">Next.js · TypeScript · Tailwind v4</p>
              <p>
                <a
                  href="https://github.com/maruthang/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--fg)]"
                >
                  View source
                </a>{' '}
                · Last build {built}
              </p>
            </div>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
