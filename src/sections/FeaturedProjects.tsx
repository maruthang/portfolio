import { Section } from '@/design-system/components/Section';
import { HorizontalScrollProjects } from '@/design-system/visuals/HorizontalScrollProjects';
import { featuredProjects } from '@/content/projects';

export function FeaturedProjects() {
  return (
    <Section
      id="projects"
      eyebrow="03 / Work"
      title="Selected projects"
      description="A subset of what I've shipped. Detailed case studies with architecture notes will live at /projects."
    >
      <HorizontalScrollProjects projects={featuredProjects} />
    </Section>
  );
}
