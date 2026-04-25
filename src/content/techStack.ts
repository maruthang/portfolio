export type TechCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Databases'
  | 'Cloud & DevOps'
  | 'Data Engineering';

export interface Tech {
  name: string;
  category: TechCategory;
  proficiency?: string;
  learning?: boolean;
}

export const techStack: Tech[] = [
  // Languages
  { name: 'TypeScript', category: 'Languages', proficiency: 'Daily driver' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'PHP', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'Scala', category: 'Languages', learning: true },

  // Frontend
  { name: 'Next.js', category: 'Frontend', proficiency: 'Production' },
  { name: 'React', category: 'Frontend', proficiency: 'Production' },
  { name: 'Angular', category: 'Frontend', proficiency: 'Production' },
  { name: 'React Native', category: 'Frontend', proficiency: 'Production' },
  { name: 'Expo', category: 'Frontend' },
  { name: 'Ionic', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Redux Toolkit', category: 'Frontend' },
  { name: 'D3.js', category: 'Frontend' },

  // Backend
  { name: 'NestJS', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'Node.js', category: 'Backend', proficiency: 'Production + OSS' },
  { name: 'Express', category: 'Backend' },
  { name: 'BullMQ', category: 'Backend', proficiency: 'OSS contributor' },
  { name: 'Socket.io', category: 'Backend' },
  { name: 'TypeORM', category: 'Backend' },
  { name: 'WordPress / WooCommerce', category: 'Backend' },

  // Databases
  { name: 'PostgreSQL', category: 'Databases', proficiency: 'Production' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'MariaDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'Delta Lake', category: 'Databases', learning: true },
  { name: 'Firebase', category: 'Databases' },

  // Cloud
  { name: 'AWS', category: 'Cloud & DevOps' },
  { name: 'Azure', category: 'Cloud & DevOps' },
  { name: 'Docker', category: 'Cloud & DevOps' },
  { name: 'GitLab CI', category: 'Cloud & DevOps' },
  { name: 'Vercel', category: 'Cloud & DevOps' },

  // Data Engineering (learning)
  { name: 'Databricks', category: 'Data Engineering', learning: true },
  { name: 'PySpark', category: 'Data Engineering', learning: true },
  { name: 'dbt', category: 'Data Engineering', learning: true },
  { name: 'Power BI', category: 'Data Engineering', learning: true },
];

export const techCategoriesInOrder: TechCategory[] = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud & DevOps',
  'Data Engineering',
];
