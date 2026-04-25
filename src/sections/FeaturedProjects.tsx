import { Section } from '@/design-system/components/Section';
import { ProjectCard } from '@/design-system/components/ProjectCard';
import { featuredProjects } from '@/content/projects';

export function FeaturedProjects() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Work"
      title="Selected projects"
      description="A subset of what I've shipped. Detailed case studies with architecture notes will live at /projects."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
