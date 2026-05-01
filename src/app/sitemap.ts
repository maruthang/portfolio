import type { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/lib/mdx';
import { getAllPostSlugs } from '@/lib/writing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-tawny-two-72.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/oss`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  const writingRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${SITE_URL}/writing/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
