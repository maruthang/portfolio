import { Section } from '@/design-system/components/Section';
import { StatCounter } from '@/design-system/components/StatCounter';
import { stats } from '@/content/stats';

export function About() {
  return (
    <Section id="about" eyebrow="01 / About" title="A few things about me">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 text-[var(--muted)]">
          <p>
            I&apos;m a full-stack developer at <span className="text-[var(--fg)]">Finstein</span>,
            where I ship production web and mobile applications across NestJS, Next.js, Angular, and
            React Native (Expo). Before that I taught programming and robotics as a STEM instructor
            at LMES Academy.
          </p>
          <p>
            What I love most is improving the tools developers depend on. I&apos;m an active
            contributor to <span className="text-[var(--fg)]">VS Code</span>, the{' '}
            <span className="text-[var(--fg)]">NestJS ecosystem</span> (CLI, Swagger, GraphQL),{' '}
            <span className="text-[var(--fg)]">Node.js undici</span>,{' '}
            <span className="text-[var(--fg)]">BullMQ</span>, and a handful of other open source
            projects. 57 merged PRs and counting.
          </p>
          <p>
            Currently upskilling in <span className="text-[var(--fg)]">Data Engineering</span> —
            Databricks, PySpark, Delta Lake, dbt, and Power BI. Based in Chennai, India.
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
