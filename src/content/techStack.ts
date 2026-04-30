export type TechCategory = 'Backend' | 'Frontend' | 'Mobile' | 'Data & Infra';

export interface Tech {
  name: string;
  category: TechCategory;
  proficiency?: string;
  learning?: boolean;
}

export const techStack: Tech[] = [
  // Backend
  { name: 'NestJS', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'Node.js', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'TypeScript', category: 'Backend', proficiency: 'Daily driver' },
  { name: 'Express', category: 'Backend' },
  { name: 'BullMQ', category: 'Backend', proficiency: 'OSS contributor' },
  { name: 'Socket.io', category: 'Backend' },
  { name: 'TypeORM', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Backend', proficiency: 'Production' },
  { name: 'MySQL', category: 'Backend' },
  { name: 'MariaDB', category: 'Backend' },
  { name: 'Redis', category: 'Backend' },
  { name: 'WordPress / WooCommerce', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  { name: 'SQL', category: 'Backend' },

  // Frontend
  { name: 'Next.js', category: 'Frontend', proficiency: 'Production' },
  { name: 'React', category: 'Frontend', proficiency: 'Production' },
  { name: 'Angular', category: 'Frontend', proficiency: 'Production' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'Redux Toolkit', category: 'Frontend' },
  { name: 'D3.js', category: 'Frontend' },

  // Mobile
  { name: 'React Native', category: 'Mobile', proficiency: 'Production' },
  { name: 'Expo', category: 'Mobile' },
  { name: 'Ionic', category: 'Mobile' },
  { name: 'Capacitor', category: 'Mobile' },

  // Data & Infra
  { name: 'Databricks', category: 'Data & Infra', learning: true },
  { name: 'PySpark', category: 'Data & Infra', learning: true },
  { name: 'Delta Lake', category: 'Data & Infra', learning: true },
  { name: 'dbt', category: 'Data & Infra', learning: true },
  { name: 'Power BI', category: 'Data & Infra', learning: true },
  { name: 'Scala', category: 'Data & Infra', learning: true },
  { name: 'Python', category: 'Data & Infra' },
  { name: 'Docker', category: 'Data & Infra' },
  { name: 'GitLab CI', category: 'Data & Infra' },
  { name: 'AWS', category: 'Data & Infra' },
  { name: 'Azure', category: 'Data & Infra' },
  { name: 'Vercel', category: 'Data & Infra' },
  { name: 'Firebase', category: 'Data & Infra' },
];

export const techCategoriesInOrder: TechCategory[] = [
  'Backend',
  'Frontend',
  'Mobile',
  'Data & Infra',
];
