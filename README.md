# Oscar Dev — Portfolio v2

Portfolio bilingüe de Oscar Dev, enfocado en presentar soluciones digitales para negocios reales y convertir visitas calificadas en conversaciones por WhatsApp.

## Enfoque

- Marca: Oscar Dev.
- Audiencia: negocios locales, pequeñas empresas y emprendedores con presencia digital débil o procesos manuales.
- Oferta: sitios web, e-commerce, aplicaciones web/móviles y plataformas a medida.
- Mensaje: desarrollo web con pensamiento de negocio.
- Conversión principal: conversación contextual por WhatsApp.
- Idiomas: español en `/` e inglés en `/en/`.

La narrativa y los casos siguen las fuentes internas de Oscar Dev. No se publican métricas, testimonios ni resultados cuantitativos sin evidencia y permiso.

## Stack

- Astro 6, salida estática.
- Tailwind CSS 4.
- TypeScript estricto.
- Imágenes optimizadas por Astro y Sharp.
- Fuentes variables locales mediante Fontsource.
- i18n propio y tipado para ES/EN.

## Requisitos

- Node.js 22.14 o superior.
- pnpm 11.

Este repositorio usa exclusivamente pnpm. `pnpm-lock.yaml` es la fuente de verdad para instalaciones reproducibles.

## Desarrollo

```sh
pnpm install
pnpm dev
```

Comandos disponibles:

| Comando | Uso |
| --- | --- |
| `pnpm dev` | Servidor local |
| `pnpm check` | Diagnóstico de Astro y TypeScript |
| `pnpm build` | Build estático de producción |
| `pnpm validate` | Check + build |
| `pnpm preview` | Vista previa del build |
| `pnpm assets` | Regenera OG image y favicons desde los SVG fuente |

## Estructura

```text
src/
  assets/       imágenes fuente procesadas por Astro
  components/   secciones y comportamiento de la interfaz
  config/       URL, marca y enlaces de contacto
  i18n/         copy español e inglés
  layouts/      metadatos, schema y estructura global
  pages/        rutas ES/EN
  styles/       sistema visual Oscar Dev
public/         robots, sitemap, manifest y assets sociales
scripts/        generación reproducible de assets de marca
```

## SEO e i18n

- Canonical independiente por ruta.
- Alternates `hreflang` para ES, EN y `x-default`.
- Open Graph y Twitter Card con imagen propia de Oscar Dev.
- JSON-LD de `Person`, `ProfessionalService` y `WebSite` sin ratings ni resultados inventados.
- `robots.txt` y sitemap bilingüe.
- Un solo `h1` por idioma y secciones semánticas.

Antes de cambiar el dominio, actualiza tanto `site` en `astro.config.mjs` como `siteUrl` en `src/config/site.ts`, además de las URLs absolutas de `public/robots.txt` y `public/sitemap.xml`.

## Conversión y medición

Los CTAs principales abren WhatsApp con un mensaje contextual según idioma y ubicación. Cada CTA incluye atributos `data-event` y emite el evento de navegador `oscar-dev:event`.

El sitio no activa analítica ni envía datos por defecto. La capa de eventos es compatible con una integración posterior de Plausible (`window.plausible`) o Google Tag Manager/GA (`window.dataLayer`). Antes de activar un proveedor se deben definir finalidad, consentimiento, política de privacidad y credenciales reales.

Eventos incluidos:

- `whatsapp_click`
- `email_click`
- `project_link_click`

## Política de evidencia

- “Desde 2019”, experiencia en Colombia/Estados Unidos y los sectores mencionados provienen de la documentación de marca.
- Los proyectos se presentan como proyectos/casos, no como “casos de éxito”.
- Los resultados visibles son cualitativos y describen lo construido u organizado.
- Métricas, porcentajes, testimonios, logos de cliente adicionales y claims de negocio requieren fuente, periodo y permiso.

## Despliegue

El build produce archivos estáticos en `dist/` y puede desplegarse en Cloudflare Pages u otro hosting estático.

Configuración sugerida:

- Build command: `pnpm build`
- Output directory: `dist`
- Node.js: `22`

## Pendientes de contenido real

- Confirmar testimonios y permisos de publicación por cliente.
- Añadir métricas únicamente cuando exista fuente, periodo y contexto.
- Confirmar si Oscar acepta nuevos proyectos antes de mostrar un badge de disponibilidad.
- Elegir y configurar el proveedor de analítica solo si existe una necesidad de medición y una política de privacidad.
