# 🚀 PLAYBOOK MAESTRO: INGENIERÍA WEB DE ALTO RENDIMIENTO, MOTION & AI-SEO

> **Documento de Ingeniería Universal y Agnóstico de Entorno.**  
> Esta guía documenta el estándar técnico completo para auditar, rediseñar, optimizar y certificar cualquier sitio web o aplicación web con una puntuación de **100/100 en Google Lighthouse**, posicionamiento en Google Tradicional e indexación en motores de Inteligencia Artificial (ChatGPT, Claude, Gemini, Perplexity).

---

## 📑 ÍNDICE MAESTRO

1. [Ecosistema Completo de Skills para Agentes de IA](#1-ecosistema-completo-de-skills-para-agentes-de-ia)
2. [Fase 1: Auditoría de Diseño, UX y Anti-Slop (`impeccable` + `design-taste-frontend` + `minimalist-ui`)](#fase-1-auditoría-de-diseño-ux-y-anti-slop)
3. [Fase 2: Auditoría de Motion y Cinemática WAAPI (`emil-design-eng` + `find-animation-opportunities`)](#fase-2-auditoría-de-motion-y-cinemática-waapi)
4. [Fase 3: Suite de Pruebas Automatizadas en Navegador Real (`playwright-core`)](#fase-3-suite-de-pruebas-automatizadas-en-navegador-real)
5. [Fase 4: Estrategia Integral de SEO y AI-SEO / AEO (`ai-seo` + `seo` + `seo-audit`)](#fase-4-estrategia-integral-de-seo-y-ai-seo--aeo)
6. [Fase 5: Grafo de Entidades, E-E-A-T y Canales de Conversión](#fase-5-grafo-de-entidades-e-e-a-t-y-canales-de-conversión)
7. [Fase 6: Infraestructura, Cabeceras de Seguridad y Caché Inmutable](#fase-6-infraestructura-cabeceras-de-seguridad-y-caché-inmutable)
8. [Fase 7: Suite de Auditoría Google Lighthouse y Certificación 100/100 (`accessibility`)](#fase-7-suite-de-auditoría-google-lighthouse-y-certificación-100100)
9. [Checklist Final de Lanzamiento a Producción](#9-checklist-final-de-lanzamiento-a-producción)

---

## 1. Ecosistema Completo de Skills para Agentes de IA

Las *Skills* son paquetes modulares de directivas y estándares técnicos que se instalan desde el registro abierto oficial ([skills.sh](https://skills.sh/)) utilizando el gestor de paquetes de agentes `npx skills`:

```bash
# Búsqueda interactiva en el registro de skills:
npx skills find <término-de-búsqueda>

# Instalación global en el entorno del agente:
npx skills add <autor/repositorio@nombre-skill> -g -y
```

### 📦 Catálogo Detallado de Skills Utilizadas:

| Skill | Fuente / Repositorio | Comando de Búsqueda / Instalación | Función Específica en el Proyecto |
| :--- | :--- | :--- | :--- |
| **`impeccable`** | `skills.sh` / `anthropics/skills` | `npx skills find impeccable` | Auditoría integral de UX, jerarquía visual, ritmo tipográfico, carga cognitiva y redacción de copy comercial. |
| **`design-taste-frontend`** | `skills.sh` / `vercel-labs/agent-skills` | `npx skills find design-taste-frontend` | Erradicación de clichés de IA (*anti-slop*), definición de dirección estética editorial y diseño de Bento Grids asimétricos. |
| **`minimalist-ui`** | `skills.sh` / `vercel-labs/agent-skills` | `npx skills find minimalist-ui` | Paletas monocromáticas oscuras, eliminación de sombras pesadas y gradientes artificiales, bordes sutiles de luz. |
| **`redesign-existing-projects`** | `skills.sh` | `npx skills find redesign-existing-projects` | Metodología de auditoría previa antes de tocar código, preservando la identidad comercial del cliente mientras se eleva la calidad técnica. |
| **`emil-design-eng`** | `skills.sh` | `npx skills find emil-design-eng` | Encodificación de los principios de diseño de Emil Kowalski: cero rebotes (*zero spring-bounce*), velocidad y desaceleración monótona. |
| **`find-animation-opportunities`** | `skills.sh` | `npx skills find find-animation-opportunities` | Análisis de qué elementos justifican movimiento (micro-interacciones) y cuáles deben permanecer estáticos para evitar *layout shifts*. |
| **`ai-seo`** | `skills.sh` | `npx skills find ai-seo` | Implementación del estándar internacional [llmstxt.org](https://llmstxt.org) (`llms.txt` y `llms-full.txt`) para motores de IA. |
| **`seo` & `seo-audit`** | `skills.sh` / `anthropics/skills` | `npx skills find seo` | Generación del grafo Schema.org JSON-LD (`Person`, `ProfessionalService`, `WebSite`, `FAQPage`), OpenGraph y directivas de rastreo. |
| **`accessibility`** | `skills.sh` / `anthropics/skills` | `npx skills find accessibility` | Auditoría y remediación estricta de normas internacionales WCAG 2.2 (ratios de contraste > 4.5:1 y coincidencia de nombres accesibles). |
| **`astro`** | `skills.sh` | `npx skills find astro` | Arquitectura de islas (*Islands Architecture*), compilación SSG estática a cero JavaScript en el cliente donde no se requiere. |
| **`tailwind-css-patterns`** | `skills.sh` | `npx skills find tailwind-css-patterns` | Patrones de utilidad limpia en Tailwind CSS v4 (`@tailwindcss/vite`), eliminando archivos CSS gigantes y variables globales desordenadas. |
| **`typescript-advanced-types`** | `skills.sh` | `npx skills find typescript-advanced-types` | Tipado estricto de diccionarios de internacionalización (i18n) y contratos de interfaces de componentes. |

---

## Fase 1: Auditoría de Diseño, UX y Anti-Slop

### 🧠 Skills: `impeccable`, `design-taste-frontend`, `minimalist-ui`, `redesign-existing-projects`

### 1. Erradicación del "AI Slop":
- **Eliminar clichés visuales**: Fondos negros puros (#000000) con resplandores morados/azules genéricos (*heavy blur gradients*), sombras flotantes irreales y textos con contraste deficiente.
- **Paleta Editorial Oscura**:
  - Fondo primario: Carbón profundo neutro (`#0d0e12` o `bg-bg-main`).
  - Fondo secundario de tarjetas: `#14161d` (`bg-bg-sec/80`).
  - Bordes de definición: `border-white/5` a `border-white/10`.
  - Color de acento cálido con propósito: Ámbar / Naranja quemado (`text-accent` / `#f29a2e`).

### 2. Estructura Bento Grid Asimétrica:
- En lugar de listas repetitivas de tarjetas iguales, estructurar bloques con jerarquía visual:
  - Tarjeta destacada (2 columnas): Caso de estudio principal con métricas de negocio.
  - Tarjetas secundarias (1 columna): Soluciones especializadas o servicios complementarios.

### 3. Jerarquía Tipográfica y Copywriting de Negocio:
- Usar tipografía con personalidad y carácter (*Bricolage Grotesque*, *Geist*, *Inter Variable*).
- **Regla Impeccable de Copy**: Reemplazar frases vacías por propuestas de valor concretas.
  - ❌ *Evitar*: "Soy desarrollador web fullstack apasionado por el código limpio."
  - ✅ *Aplicar*: "Desarrollo web con pensamiento de negocio. Sitios de alta conversión y plataformas escalables."

---

## Fase 2: Auditoría de Motion y Cinemática WAAPI

### 🧠 Skills: `emil-design-eng`, `find-animation-opportunities`

### 1. El Principio del Cero Rebote (Zero Spring-Bounce):
En interfaces profesionales y herramientas de negocio, las animaciones que "rebotan" como una pelota de goma transmiten inmadurez y retrasan la acción del usuario. La desaceleración debe ser continua y monótona.

### 2. El Problema de los Acordeones en CSS Tradicional:
- El uso de `max-height: 500px` causa que el contenido se abra con una velocidad distorsionada según la cantidad de texto.
- Las transiciones de altura con CSS puro provocan bloqueos del hilo principal y tirones (*layout shifts*).

### 3. Implementación Canónica con Web Animations API (WAAPI):
```typescript
/**
 * Controlador de acordeón con física monótona y cálculo dinámico de altura
 * Curva: cubic-bezier(0.16, 1, 0.3, 1) | Duración: 250ms abrir / 200ms cerrar
 */
export class AccordionController {
  private element: HTMLElement;
  private content: HTMLElement;
  private isAnimating = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.content = element.querySelector('[data-accordion-content]')!;
  }

  toggle() {
    if (this.element.hasAttribute('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.element.setAttribute('open', 'true');
    const startHeight = this.element.offsetHeight;
    const endHeight = startHeight + this.content.scrollHeight;

    const anim = this.element.animate(
      [
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ],
      { duration: 250, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    anim.onfinish = () => {
      this.element.style.height = 'auto';
      this.isAnimating = false;
    };
  }

  close() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const startHeight = this.element.offsetHeight;
    const endHeight = startHeight - this.content.scrollHeight;

    const anim = this.element.animate(
      [
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ],
      { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );

    anim.onfinish = () => {
      this.element.removeAttribute('open');
      this.element.style.height = 'auto';
      this.isAnimating = false;
    };
  }
}
```

---

## Fase 3: Suite de Pruebas Automatizadas en Navegador Real

### 🧠 Herramienta: `playwright-core`

Para garantizar que los componentes no se rompan ni generen saltos visuales:

1. **Instalación**:
   ```bash
   pnpm add -D playwright-core
   ```
2. **Script de Verificación Cinemática (`scripts/verify-kinematics.mjs`)**:
   - Levanta un servidor HTTP estático en memoria.
   - Lanza Chromium en modo headless.
   - Hace clic en los acordeones y mide cuadro a cuadro la altura en píxeles.
   - **Criterio de Aprobación**: Altura inicial = 77px, Altura final = 145px, Delta de retroceso cinemático = 0px.

---

## Fase 4: Estrategia Integral de SEO y AI-SEO / AEO

### 🧠 Skills: `ai-seo`, `seo`, `seo-audit`

### 1. Estándar `llms.txt` y `llms-full.txt` (llmstxt.org):
Los modelos de lenguaje (LLMs) rastrean la web para alimentar sus respuestas. Creamos dos archivos en la carpeta pública:

#### A. `/public/llms.txt` (Resumen estructurado para contexto rápido de IA):
```markdown
# [Nombre del Proyecto / Profesional]

> [Propuesta de valor en una sola oración clara y directa]

## Especialidades Principales
- [Especialidad 1]: [Descripción de alcance y solución técnica]
- [Especialidad 2]: [Descripción de alcance y solución técnica]

## Casos de Estudio Reales
- [Proyecto A]: [Problema resuelto, métricas de rendimiento y stack]
- [Proyecto B]: [Problema resuelto, métricas de rendimiento y stack]

## Stack Tecnológico y Criterio de Selección
- [Framework Web]: [Por qué se elige según el tipo de proyecto]
- [Framework Mobile]: [Por qué se elige según el tipo de proyecto]

## Canales Oficiales y Enlaces
- Web: https://tudominio.com
- WhatsApp Directo: https://wa.me/...
- Email: contacto@tudominio.com
- LinkedIn: https://linkedin.com/in/...
- GitHub: https://github.com/...
```

#### B. `/public/llms-full.txt` (Dossier completo de autoridad):
Contiene la totalidad de casos de estudio, métricas comerciales, justificaciones técnicas profundas y la lista completa de Preguntas Frecuentes (FAQ) con sus respuestas bilingües.

---

### 2. Schema.org JSON-LD Multigrafo `@graph`:
Inyectado en el `<head>` del layout principal para conectar la entidad en el Knowledge Graph de Google:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://tudominio.com/#person",
      "name": "Nombre Profesional",
      "jobTitle": "Senior Software Architect",
      "url": "https://tudominio.com",
      "knowsAbout": [
        "Software Architecture",
        "Frontend Engineering",
        "Mobile Development",
        "Web Performance Optimization"
      ],
      "sameAs": [
        "https://www.linkedin.com/in/tu-perfil",
        "https://github.com/tu-usuario",
        "https://www.instagram.com/tu-perfil",
        "https://www.tiktok.com/@tu-perfil",
        "https://www.facebook.com/tu-pagina"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://tudominio.com/#service",
      "name": "Nombre Comercial",
      "url": "https://tudominio.com",
      "priceRange": "$$",
      "areaServed": "Worldwide",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://tudominio.com/#website",
      "url": "https://tudominio.com",
      "name": "Nombre Comercial",
      "inLanguage": ["es", "en"]
    },
    {
      "@type": "FAQPage",
      "@id": "https://tudominio.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuál es tu stack tecnológico?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Desarrollo con Astro para sitios de alta conversión y Angular para plataformas complejas."
          }
        }
      ]
    }
  ]
}
</script>
```

---

### 3. Directivas en `robots.txt` para Crawlers de IA:
```
User-agent: *
Allow: /

# Permitir indexación de bots de IA
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://tudominio.com/sitemap.xml
```

---

## Fase 5: Grafo de Entidades, E-E-A-T y Canales de Conversión

1. **Desambiguación de Entidad (E-E-A-T)**:
   - Dividir los canales en dos grupos:
     - **Canales de Interfaz de Usuario**: Enlaces con alta autoridad profesional y conversión visible (LinkedIn, GitHub, Instagram, TikTok).
     - **Canales del Grafo de Entidad**: Incluir todos (incluso Facebook) dentro del `sameAs` del JSON-LD para que los motores de búsqueda conecten todas tus presencias sin fugar tráfico en la UI.
2. **Enrutamiento Directo a WhatsApp**:
   - Usar shortlinks directos de WhatsApp Business (`https://wa.me/message/TU_ID_SHORTLINK`) que ya traen mensaje predeterminado para eliminar pasos intermedios.

---

## Fase 6: Infraestructura, Cabeceras de Seguridad y Caché Inmutable

Para proteger el sitio contra vulnerabilidades (Clickjacking, XSS, MIME Sniffing) y conseguir tiempos de carga de **0ms** en visitas recurrentes:

### 1. Plantilla para Cloudflare Pages (`public/_headers`):
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-XSS-Protection: 1; mode=block

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/llms.txt
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  Content-Type: text/plain; charset=UTF-8

/llms-full.txt
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  Content-Type: text/plain; charset=UTF-8

/robots.txt
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  Content-Type: text/plain; charset=UTF-8

/sitemap.xml
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  Content-Type: application/xml; charset=UTF-8
```

### 2. Plantilla para Vercel (`vercel.json`):
```json
{
  "cleanUrls": false,
  "trailingSlash": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/llms.txt",
      "headers": [
        { "key": "Content-Type", "value": "text/plain; charset=UTF-8" },
        { "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
      ]
    },
    {
      "source": "/llms-full.txt",
      "headers": [
        { "key": "Content-Type", "value": "text/plain; charset=UTF-8" },
        { "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
      ]
    }
  ]
}
```

### 3. Plantilla para Netlify (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "pnpm build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

## Fase 7: Suite de Auditoría Google Lighthouse y Certificación 100/100

### 🧠 Skills & Herramientas: `accessibility`, `lighthouse`, `playwright-core`

### 1. Instalación de dependencias:
```bash
pnpm add -D lighthouse playwright-core
```

### 2. Script de Auditoría Automatizada (`scripts/run-lighthouse.mjs`):
```javascript
import { chromium } from 'playwright-core';
import lighthouse from 'lighthouse';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp'
};

async function startStaticServer(port = 54321) {
  const distDir = path.join(process.cwd(), 'dist');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
    if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
  await new Promise(resolve => server.listen(port, resolve));
  return server;
}

async function runAudit() {
  const server = await startStaticServer(54321);
  const browser = await chromium.launch({
    args: ['--remote-debugging-port=9222', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const url = 'http://127.0.0.1:54321/';
  
  // Auditoría Mobile
  const mobile = await lighthouse(url, {
    port: 9222,
    output: 'json',
    formFactor: 'mobile',
    throttlingMethod: 'simulate'
  });

  // Auditoría Desktop
  const desktop = await lighthouse(url, {
    port: 9222,
    output: 'json',
    formFactor: 'desktop'
  });

  console.log('📱 MOBILE:', {
    Performance: Math.round(mobile.lhr.categories.performance.score * 100),
    Accessibility: Math.round(mobile.lhr.categories.accessibility.score * 100),
    BestPractices: Math.round(mobile.lhr.categories['best-practices'].score * 100),
    SEO: Math.round(mobile.lhr.categories.seo.score * 100),
  });

  console.log('💻 DESKTOP:', {
    Performance: Math.round(desktop.lhr.categories.performance.score * 100),
    Accessibility: Math.round(desktop.lhr.categories.accessibility.score * 100),
    BestPractices: Math.round(desktop.lhr.categories['best-practices'].score * 100),
    SEO: Math.round(desktop.lhr.categories.seo.score * 100),
  });

  await browser.close();
  server.close();
}

runAudit().catch(console.error);
```

### 3. Las Dos Reglas de Oro de Accesibilidad para el 100%:
1. **Ratio de Contraste (WCAG AA > 4.5:1)**:
   - Jamás utilizar opacidades decorativas (ej. `text-white/60` o `text-text-sec/60`) sobre textos informativos o legales en fondos oscuros. Usar colores contrastados puros.
2. **Coincidencia de Nombre Accesible (WCAG 2.5.3 - Label in Name)**:
   - Todo botón o enlace con texto visible DEBE contener dicho texto literal dentro del `aria-label`.
   - ❌ *Incorrecto*: `<a href="/en/" aria-label="Cambiar a inglés">EN</a>`
   - ✅ *Correcto*: `<a href="/en/" aria-label="EN - Cambiar el idioma a inglés">EN</a>`

---

## 9. Checklist Final de Lanzamiento a Producción

- [x] **Diseño Anti-Slop**: Bento Grid modular, tipografía intencional y cero clichés de IA.
- [x] **Motion Emil Kowalski**: Acordeones y micro-interacciones con WAAPI y cero rebotes.
- [x] **Pruebas Automatizadas**: Playwright validando cinemática y consistencia visual en Chromium.
- [x] **AI-SEO**: Archivos `llms.txt` y `llms-full.txt` desplegados en `/public`.
- [x] **Schema.org**: JSON-LD con `Person`, `ProfessionalService`, `WebSite` y `FAQPage`.
- [x] **Robots.txt & Sitemap**: Permisos explícitos para rastreadores de IA y referencia al mapa del sitio.
- [x] **Seguridad & Caché**: Cabeceras HSTS, `X-Frame-Options: DENY` y caché inmutable de 1 año para `/_astro/*`.
- [x] **Google Lighthouse**: Certificación de **100/100** en Rendimiento, Accesibilidad, Buenas Prácticas y SEO.
