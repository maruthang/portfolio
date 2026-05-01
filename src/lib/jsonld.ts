export interface PersonInput {
  name: string;
  url: string;
  sameAs?: string[];
  jobTitle?: string;
}

export function personSchema(input: PersonInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: input.url,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export interface BlogPostingInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string; // ISO date
  authorName: string;
}

export function blogPostingSchema(input: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    author: { '@type': 'Person' as const, name: input.authorName },
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': input.url },
  };
}
