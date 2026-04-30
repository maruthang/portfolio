import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPostMDX, getAllPostSlugs, estimateReadingTimeMinutes } from '@/lib/writing';
import { MDXContent } from '@/design-system/components/MDXContent';
import { Breadcrumbs } from '@/design-system/components/Breadcrumbs';
import { breadcrumbListSchema } from '@/lib/jsonld';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getPostMDX(slug);
  if (!data) return { title: 'Post not found' };
  return {
    title: `${data.frontmatter.title} — Maruthan G`,
    description: data.frontmatter.description,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPostMDX(slug);
  if (!data) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';
  const crumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Writing', url: `${siteUrl}/writing` },
    { name: data.frontmatter.title, url: `${siteUrl}/writing/${slug}` },
  ];

  const minutes = estimateReadingTimeMinutes(data.content);

  return (
    <article className="space-y-10 py-10">
      <Script
        id={`ld-bc-writing-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema(crumbs)) }}
      />
      <Breadcrumbs items={[{ label: 'Writing', href: '/writing' }, { label: data.frontmatter.title }]} />
      <header className="space-y-4">
        <p className="font-mono text-xs text-[var(--muted)]">
          {formatDate(data.frontmatter.date)} · {minutes} min read
        </p>
        <h1 className="font-mono text-3xl leading-tight font-bold sm:text-5xl">
          {data.frontmatter.title}
        </h1>
        <p className="max-w-3xl text-lg text-[var(--muted)]">{data.frontmatter.description}</p>
      </header>
      <MDXContent source={data.content} />
      <div className="pt-10">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all writing
        </Link>
      </div>
    </article>
  );
}
