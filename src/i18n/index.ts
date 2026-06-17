export type Locale = 'es' | 'en';
export type Translations = Record<string, string>;

import { es } from './es';
import { en } from './en';

const translations: Record<Locale, Translations> = { es, en };

export function t(lang: Locale, key: string): string {
  const locale = translations[lang];
  if (!(key in locale)) {
    throw new Error(`Missing translation key "${key}" for locale "${lang}"`);
  }
  return locale[key];
}
