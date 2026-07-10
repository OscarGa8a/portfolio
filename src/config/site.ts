// Single source of truth for contact and social links.
// Used across Nav, Hero, FinalCta, Footer and About.

export const contact = {
  whatsapp: 'https://wa.me/573106495249',
  email: 'mailto:oscar.ga8a@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oscar-garcia-dev/',
  github: 'https://github.com/OscarGa8a',
} as const;

// Production URL — used for canonical links, Open Graph, and JSON-LD.
// TODO: replace with the real deployed domain (must match astro.config.mjs `site`).
export const siteUrl = 'https://oscar-garcia.dev';

// Author / brand identity. Drives structured data (schema.org) and meta tags.
export const author = {
  name: 'Oscar García',
  brand: 'Oscar García Dev',
  jobTitle: { es: 'Desarrollador web freelance', en: 'Freelance Web Developer' },
  // Plain values (no mailto:/wa.me wrappers) for schema.org.
  email: 'oscar.ga8a@gmail.com',
  phone: '+573106495249',
  countryCode: 'CO',
} as const;
