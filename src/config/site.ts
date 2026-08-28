export const siteUrl = 'https://oscar-garcia.dev';

export const whatsappShortLink = 'https://wa.me/message/YXFZES54VJ2IK1';

export function whatsappUrl(_lang?: 'es' | 'en', _context = 'portfolio') {
  return whatsappShortLink;
}

export const contact = {
  email: 'mailto:oscar.garcia.development@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oscar-garcia-dev/',
  github: 'https://github.com/OscarGa8a',
  instagram: 'https://www.instagram.com/oscargarcia.dev/',
  tiktok: 'https://www.tiktok.com/@oscargarcia.dev',
  facebook: 'https://www.facebook.com/oscardev.co',
} as const;

export const author = {
  name: 'Oscar García',
  brand: 'Oscar Dev',
  jobTitle: { es: 'Desarrollador de soluciones digitales', en: 'Digital Solutions Developer' },
  email: 'oscar.garcia.development@gmail.com',
  phone: '+573180209851',
  countryCode: 'CO',
  experienceSince: '2019',
} as const;

