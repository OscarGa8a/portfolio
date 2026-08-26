export const siteUrl = 'https://oscar-garcia.dev';

const whatsappNumber = '573106495249';

export function whatsappUrl(lang: 'es' | 'en', context = 'portfolio') {
  const message = lang === 'es'
    ? `Hola Oscar, vi tu portafolio y quiero contarte sobre mi ${context}.`
    : `Hi Oscar, I saw your portfolio and would like to tell you about my ${context}.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const contact = {
  email: 'mailto:oscar.ga8a@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oscar-garcia-dev/',
  github: 'https://github.com/OscarGa8a',
} as const;

export const author = {
  name: 'Oscar García',
  brand: 'Oscar Dev',
  jobTitle: { es: 'Desarrollador de soluciones digitales', en: 'Digital Solutions Developer' },
  email: 'oscar.ga8a@gmail.com',
  phone: '+573106495249',
  countryCode: 'CO',
  experienceSince: '2019',
} as const;
