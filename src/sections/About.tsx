import { Section } from '@/design-system/components/Section';
import { StatCounter } from '@/design-system/components/StatCounter';
import { stats } from '@/content/stats';

export function About() {
  return (
    <Section id="about" eyebrow="01 / About" title="A few things about me">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 text-[var(--muted)]">
          <p className="text-[var(--fg)]">
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              What I ship —
            </span>{' '}
            production web and mobile apps at <span className="text-[var(--fg)]">Finstein</span>{' '}
            across NestJS, Next.js, Angular, and React Native (Expo). B2B platforms, analytics
            dashboards, real-time messaging, payments, mobile apps. Before that I taught programming
            and robotics as a STEM instructor at LMES Academy.
          </p>
          <p>
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              What I make better —
            </span>{' '}
            the dev tools I use every day. Active contributor to{' '}
            <span className="text-[var(--fg)]">VS Code</span>, the{' '}
            <span className="text-[var(--fg)]">NestJS ecosystem</span> (CLI, Swagger, GraphQL),{' '}
            <span className="text-[var(--fg)]">Node.js undici</span>, and{' '}
            <span className="text-[var(--fg)]">BullMQ</span>. 57 merged PRs and counting.
          </p>
          <p>
            Currently exploring data engineering — Databricks, PySpark, Delta Lake, dbt, Power BI.
            Based in Chennai, India.
          </p>
          <p className="text-[var(--fg)]">
            <span className="font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
              Available for —
            </span>{' '}
            full-time roles and contract work.{' '}
            <a
              href="/resume.pdf"
              className="text-[var(--color-brand-500)] hover:underline"
              download
            >
              Download resume (PDF)
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 self-start">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </Section>
  );
}
