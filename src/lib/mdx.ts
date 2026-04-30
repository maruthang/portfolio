import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const PROJECT_DIR = join(process.cwd(), 'src/content/projects');
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  summary: string;
  role?: string;
  dates?: string;
  tech: string[];
  status: 'live' | 'archived' | 'oss' | 'learning';
  cover?: string;
  links?: { live?: string; repo?: string };
}

export interface ProjectMDX {
  frontmatter: ProjectFrontmatter;
  content: string;
}

export function getAllProjectSlugs(): string[] {
  if (!existsSync(PROJECT_DIR)) return [];
  return readdirSync(PROJECT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getProjectMDX(slug: string): ProjectMDX | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const file = join(PROJECT_DIR, `${slug}.mdx`);
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data as ProjectFrontmatter, content };
}
