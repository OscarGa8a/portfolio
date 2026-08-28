// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

if (!process.env.PUBLIC_CLOUDINARY_CLOUD_NAME) {
  process.env.PUBLIC_CLOUDINARY_CLOUD_NAME = 'dsd6blpz0';
}

export default defineConfig({
  site: 'https://oscar-garcia.dev',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [icon()],
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
