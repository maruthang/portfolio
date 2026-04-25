import { describe, it, expect } from 'vitest';
import { getProjectMDX, getAllProjectSlugs, type ProjectFrontmatter } from '@/lib/mdx';

describe('mdx loaders', () => {
  it('lists all project MDX slugs', () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toContain('b2b-marketplace');
    expect(slugs).toContain('sales-analytics-platform');
    expect(slugs.length).toBeGreaterThanOrEqual(6);
  });

  it('loads frontmatter and content for a known slug', () => {
    const result = getProjectMDX('b2b-marketplace');
    expect(result).not.toBeNull();
    if (!result) return;
    const fm: ProjectFrontmatter = result.frontmatter;
    expect(fm.title).toBeTruthy();
    expect(fm.slug).toBe('b2b-marketplace');
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(getProjectMDX('does-not-exist-xyz')).toBeNull();
  });
});
