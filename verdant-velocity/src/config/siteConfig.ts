export const siteConfig = {
  owner: 'carterdaly',
  name: 'Carter Daly',
  label: 'data & ml',
  heroHeading: 'pursuing models for unsolved problems',
  heroSubheading:
    'Nuclear fusion, race strategy, and time-series systems — with a bias toward interpretable, high-impact ML.',
  heroParagraph:
    'Research-driven ML with an obsession for signals over noise — building interpretable models for fusion stability, F1 strategy, and resilient forecasting systems.',
  metaTitle: 'Carter Daly — data & ml',
  metaDescription:
    'Nuclear fusion, race strategy, and time-series systems — with a bias toward interpretable, high-impact ML.',
  location: 'Location TBD',
  links: {
    github: 'https://github.com/carterdaly',
    linkedin: 'https://www.linkedin.com/in/carterwdaly',
    email: 'mailto:TODO@TODO.com',
    resume: '#',
  },
  contactCtaLabel: 'Email me',
  secondaryCtaLabel: 'Download CV',
  stats: {
    years: '—',
    projects: '—',
    clients: '—',
  },
  assets: {
    ogDefault: '/og-default.png',
    faviconSvg: '/favicon.svg',
    faviconIco: null,
  },
  site: 'https://carterdaly.github.io',
} as const;

export type SiteConfig = typeof siteConfig;
