import { describe, it, expect } from 'vitest';
import { getAllPostSlugs, getPostMDX } from '@/lib/writing';

describe('writing loader', () => {
  it('rejects invalid slugs', () => {
    expect(getPostMDX('../../etc/passwd')).toBeNull();
    expect(getPostMDX('UPPER-case')).toBeNull();
    expect(getPostMDX('with spaces')).toBeNull();
  });

  it('returns null for non-existent valid-shaped slugs', () => {
    expect(getPostMDX('this-post-does-not-exist-anywhere')).toBeNull();
  });

  it('returns the list of slugs from the writing directory', () => {
    const slugs = getAllPostSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    // We don't assert specific slugs here — Tasks 3-5 add them.
  });
});
