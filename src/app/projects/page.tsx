import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/design-system/components/Section';
import { ProjectCard } from '@/design-system/components/ProjectCard';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Projects — Maruthan G',
  description: 'Selected projects shipped across full-stack, mobile, and data domains.',
};

export default function ProjectsIndexPage() {
  return (
    <Section
      eyebrow="Projects"
      title="Everything I've shipped"
      description="Production work across web, mobile, and data engineering. Click any project for the case study."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="block focus-visible:outline-none"
            aria-label={`Read case study: ${p.title}`}
          >
            <ProjectCard project={p} />
          </Link>
        ))}
      </div>
    </Section>
  );
}
