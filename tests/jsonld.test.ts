import { describe, it, expect } from 'vitest';
import { personSchema, breadcrumbListSchema } from '@/lib/jsonld';

describe('personSchema', () => {
  it('builds a JSON-LD Person object with the given identity', () => {
    const json = personSchema({
      name: 'Maruthan G',
      url: 'https://example.com',
      sameAs: ['https://github.com/maruthang'],
    });
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Person');
    expect(json.name).toBe('Maruthan G');
    expect(json.url).toBe('https://example.com');
    expect(json.sameAs).toEqual(['https://github.com/maruthang']);
  });
});

describe('breadcrumbListSchema', () => {
  it('builds a BreadcrumbList with positions starting at 1', () => {
    const json = breadcrumbListSchema([
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Projects', url: 'https://example.com/projects' },
    ]);
    expect(json['@type']).toBe('BreadcrumbList');
    expect(json.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com/',
    });
    expect(json.itemListElement[1]?.position).toBe(2);
  });
});
