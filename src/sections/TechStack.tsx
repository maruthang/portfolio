import { Section } from '@/design-system/components/Section';
import { TechChip } from '@/design-system/components/TechChip';
import { techStack, techCategoriesInOrder } from '@/content/techStack';

export function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="02 / Stack"
      title="What I build with"
      description="Production-tested across multiple roles. Items marked ◌ are areas I'm currently learning."
    >
      <div className="space-y-8">
        {techCategoriesInOrder.map((cat) => {
          const items = techStack.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="mb-3 font-mono text-sm tracking-wide text-[var(--muted)] uppercase">
                {cat}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <TechChip key={t.name} tech={t} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
