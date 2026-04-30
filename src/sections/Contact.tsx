import { Section } from '@/design-system/components/Section';
import { ContactForm } from '@/design-system/components/ContactForm';
import { sendContactMessage } from '@/app/actions/contact';
import { contact } from '@/content/contact';

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="05 / Contact"
      title="Let's talk"
      description="Hiring, collaboration, or just saying hi — all welcome."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <p className="text-[var(--muted)]">
            Direct line:{' '}
            <a
              href={`mailto:${contact.email}`}
              className="text-[var(--color-brand-500)] hover:underline"
            >
              {contact.email}
            </a>
          </p>
          {contact.scheduleHref && (
            <p className="text-[var(--muted)]">
              Or{' '}
              <a
                href={contact.scheduleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand-500)] hover:underline"
              >
                book a call
              </a>
              .
            </p>
          )}
          <div className="space-y-2">
            <h3 className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              Find me elsewhere
            </h3>
            <ul className="space-y-1 text-sm">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--fg)] hover:text-[var(--color-brand-500)]"
                  >
                    {s.label} <span className="text-[var(--muted)]">— {s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ContactForm action={sendContactMessage} />
      </div>
    </Section>
  );
}
