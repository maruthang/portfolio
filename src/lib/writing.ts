import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const POST_DIR = join(process.cwd(), 'src/content/writing');
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO date string, e.g. "2026-04-30"
  slug: string;
  tags?: string[];
}

export interface PostMDX {
  frontmatter: PostFrontmatter;
  content: string;
}

export function getAllPostSlugs(): string[] {
  if (!existsSync(POST_DIR)) return [];
  return readdirSync(POST_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostMDX(slug: string): PostMDX | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const file = join(POST_DIR, `${slug}.mdx`);
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

export function getAllPostsSortedByDate(): PostFrontmatter[] {
  return getAllPostSlugs()
    .map((slug) => getPostMDX(slug)?.frontmatter)
    .filter((fm): fm is PostFrontmatter => !!fm)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function estimateReadingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
