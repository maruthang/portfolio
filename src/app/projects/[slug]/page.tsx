import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getProjectMDX, getAllProjectSlugs } from '@/lib/mdx';
import { ProjectHero } from '@/design-system/components/ProjectHero';
import { MDXContent } from '@/design-system/components/MDXContent';
import { Breadcrumbs } from '@/design-system/components/Breadcrumbs';
import { PrevNextProject } from '@/design-system/components/PrevNextProject';
import { projects } from '@/content/projects';
import { breadcrumbListSchema } from '@/lib/jsonld';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getProjectMDX(slug);
  if (!data) return { title: 'Project not found' };
  return {
    title: `${data.frontmatter.title} — Maruthan G`,
    description: data.frontmatter.summary,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getProjectMDX(slug);
  if (!data) notFound();

  const allSlugs = getAllProjectSlugs();
  const idx = allSlugs.indexOf(slug);
  const prevSlug = idx > 0 ? allSlugs[idx - 1] : undefined;
  const nextSlug = idx >= 0 && idx < allSlugs.length - 1 ? allSlugs[idx + 1] : undefined;
  const prevTitle = prevSlug ? projects.find((p) => p.slug === prevSlug)?.title : undefined;
  const nextTitle = nextSlug ? projects.find((p) => p.slug === nextSlug)?.title : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';
  const crumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Projects', url: `${siteUrl}/projects` },
    { name: data.frontmatter.title, url: `${siteUrl}/projects/${slug}` },
  ];

  return (
    <article className="space-y-12 py-10">
      <Script
        id={`ld-bc-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema(crumbs)) }}
      />
      <Breadcrumbs
        items={[{ label: 'Projects', href: '/projects' }, { label: data.frontmatter.title }]}
      />
      <ProjectHero frontmatter={data.frontmatter} />
      <MDXContent source={data.content} />
      <PrevNextProject
        prev={prevSlug && prevTitle ? { slug: prevSlug, title: prevTitle } : undefined}
        next={nextSlug && nextTitle ? { slug: nextSlug, title: nextTitle } : undefined}
      />
    </article>
  );
}
