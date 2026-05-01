/** Edge-safe static manifest for writing posts (no Node.js fs APIs). */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date e.g. "2026-04-15"
}

export const posts: PostMeta[] = [
  {
    slug: 'bullmq-over-celery-nestjs',
    title: 'Why I picked BullMQ over Celery for a NestJS analytics platform',
    description:
      'Picking the queue picks the operational shape of the whole system. Here is why a TypeScript-native one beat the obvious cross-language default.',
    date: '2026-04-15',
  },
  {
    slug: 'whatsapp-commerce-bot-three-things',
    title: 'Shipping a WhatsApp commerce bot: HMAC, idempotency, and conversation state',
    description:
      'Three primitives you cannot half-ass when wiring WhatsApp into your e-commerce backend. Pick each one deliberately.',
    date: '2026-03-28',
  },
  {
    slug: '57-oss-prs-reading-other-peoples-code',
    title: "What 57 OSS PRs taught me about reading other people's code",
    description:
      'Five lessons that did not exist for me on PR #1. Distilled from contributions to VS Code, NestJS, undici, BullMQ, and the Angular CLI.',
    date: '2026-03-10',
  },
];
