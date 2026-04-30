export type ProjectStatus = 'live' | 'archived' | 'oss' | 'learning';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  tech: string[];
  featured: boolean;
  links?: {
    live?: string;
    repo?: string;
    case?: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'b2b-marketplace',
    title: 'B2B Multi-Vendor Marketplace',
    summary:
      'B2B marketplace with reverse-auction bidding, KYC/seller verification, AI-powered product creation (AWS Lambda), live chat, and dispute management. 17+ custom WordPress plugins, full Docker Compose infra, and a backup → deploy → rollback CI/CD pipeline.',
    status: 'live',
    tech: [
      'WordPress',
      'WooCommerce',
      'PHP',
      'MariaDB',
      'Redis',
      'Docker',
      'GitLab CI',
      'AWS Lambda',
    ],
    featured: true,
  },
  {
    slug: 'conversational-commerce-bot',
    title: 'Conversational Commerce Bot',
    summary:
      'Production WhatsApp ↔ WooCommerce bridge. Customers browse, manage carts, place orders, and resolve disputes via WhatsApp. HMAC-SHA256 webhook verification, idempotency via SQLite, multi-step conversation state.',
    status: 'live',
    tech: ['NestJS 11', 'TypeScript', 'SQLite', 'Express 5', 'Meta WhatsApp Cloud API'],
    featured: true,
  },
  {
    slug: 'sales-analytics-platform',
    title: 'Enterprise Sales & Commerce Analytics',
    summary:
      'Multi-channel analytics platform aggregating 8+ e-commerce and quick-commerce channels. Real-time dashboards, dynamic report builder, cohort analysis, 2FA/MFA (TOTP), CASL RBAC, and 192+ API endpoints.',
    status: 'live',
    tech: [
      'NestJS 10',
      'Next.js 15',
      'React 18',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Socket.io',
      'D3.js',
    ],
    featured: true,
  },
  {
    slug: 'fitness-ecosystem',
    title: 'Cross-Platform Fitness Ecosystem',
    summary:
      'Mobile app, admin dashboard, and marketing site for a fitness platform. Trainer bookings, workout planning, AI coaching (GPT-4o), social fitness, real-time messaging, payment processing, push notifications.',
    status: 'live',
    tech: [
      'NestJS 10',
      'React Native + Expo 51',
      'Next.js 15',
      'PostgreSQL',
      'Socket.io',
      'OpenAI GPT-4o',
    ],
    featured: true,
  },
  {
    slug: 'health-wellness-app',
    title: 'Health & Wellness Mobile App',
    summary:
      'Hybrid mobile app for hydration tracking, step counting, and health goal management with Keycloak-based SSO and Firebase push notifications.',
    status: 'live',
    tech: ['NestJS 10', 'Angular 18', 'Ionic 8', 'Capacitor 6', 'MySQL', 'Keycloak', 'Firebase'],
    featured: false,
  },
  {
    slug: 'enterprise-data-warehouse',
    title: 'Enterprise Data Warehouse',
    summary:
      'Medallion architecture (Bronze → Silver → Gold) powering executive Power BI dashboards in the insurance domain. SCD Type 1/2, Delta Lake optimizations, and Databricks Asset Bundles for IaC.',
    status: 'learning',
    tech: ['Databricks', 'PySpark', 'Scala', 'Delta Lake', 'dbt', 'Azure ADLS', 'Power BI'],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
