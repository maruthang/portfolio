export const contact = {
  email: 'maruthangt@gmail.com',
  location: 'Chennai, India',
  availability: 'Open to opportunities',
  socials: [
    { label: 'GitHub', href: 'https://github.com/maruthang', handle: '@maruthang' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/maruthan-g-6a7415201',
      handle: 'maruthan-g',
    },
    { label: 'Telegram', href: 'https://t.me/Maruthang', handle: '@Maruthang' },
  ],
} as const;

export type Social = (typeof contact.socials)[number];
