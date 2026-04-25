export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] py-8 text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p>© {year} Maruthan G. Built with Next.js + Tailwind.</p>
        <a
          href="https://github.com/maruthang/portfolio"
          className="hover:text-[var(--fg)]"
          target="_blank"
          rel="noreferrer"
        >
          View source
        </a>
      </div>
    </footer>
  );
}
