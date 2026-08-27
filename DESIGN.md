---
name: Oscar Dev Portfolio
description: Dark-mode editorial digital portfolio for senior digital solutions developer
colors:
  bg-main: "#121214"
  bg-sec: "#181719"
  card-bg: "#1D1B1D"
  text-main: "#EBDDCA"
  text-sec: "#B8AD9E"
  accent: "#F29A2E"
  accent-strong: "#FFAA42"
  accent-mid: "#EB902E"
  accent-dark: "#CE7C2B"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
    lineHeight: 1.15
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontWeight: 400
    letterSpacing: "normal"
    lineHeight: 1.6
rounded:
  sm: "0.375rem"
  md: "0.75rem"
  lg: "1rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  2xl: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg-main}"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.5rem"
  card-premium:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System

<!-- google-labs-code:design-md-schema 1 -->

## Overview
Oscar Dev utiliza una estética editorial dark-mode cálida con alto contraste y sofisticación sobria. La identidad visual prioriza la claridad, la legibilidad del contenido y la precisión sobre clichés decorativos típicos de interfaces generadas por IA.

## Colors
- **Fondos**:
  - `bg-main` (`#121214`): Base oscura profunda que evita el negro puro `#000000`.
  - `bg-sec` (`#181719`): Separación sutil de secciones y elevación tonal.
  - `card-bg` (`#1D1B1D`): Superficie para tarjetas y contenedores interactivos.
- **Tipografía y Contenido**:
  - `text-main` (`#EBDDCA`): Blanco pergamino cálido para títulos principales y texto de cuerpo (alto contraste sin fatiga visual).
  - `text-sec` (`#B8AD9E`): Gris cálido tenue para metadatos, etiquetas y descripciones secundarias.
- **Acentos**:
  - `accent` (`#F29A2E`): Dorado ámbar distintivo para CTAs principales, indicadores activos y focus rings.
  - `accent-strong` (`#FFAA42`), `accent-mid` (`#EB902E`), `accent-dark` (`#CE7C2B`): Variaciones tonales para estados hover y activos.

## Typography
- **Display / Títulos**: `Bricolage Grotesque Variable` (Pesos: 600, 700, 800). Grotesca con carácter e interletreado óptico ajustado para encabezados.
- **Cuerpo / Interfaz**: System-first clean sans-serif stack (`system-ui, -apple-system, Segoe UI, Roboto, sans-serif`). Limpia, de renderizado nativo veloz y alta legibilidad sin sobrecargar el bundle ni caer en fuentes genéricas de IA.
- **Escala de Jerarquía**:
  - `Hero Title`: `clamp(2.25rem, 5vw, 4rem)`, tracking tight, line-height 1.1.
  - `Títulos de Sección (H2)`: `clamp(1.75rem, 3.5vw, 2.75rem)`, font-weight 700.
  - `Títulos de Tarjetas (H3)`: `1.25rem` a `1.5rem`, font-weight 600.
  - `Cuerpo de Texto`: `1rem` (`16px`) / `1.125rem` (`18px`), line-height 1.6.

## Layout
- **Ancho Máximo**: Contenedor estándar en `max-w-7xl` (`80rem`) con espaciado horizontal fluido (`px-4 sm:px-6 lg:px-8`).
- **Ritmo Vertical**: Espaciado generoso entre secciones principales (`py-16 md:py-24 lg:py-32`).
- **Grillas**: Grid CSS responsivo que se adapta de 1 columna en móvil a 2 o 3 columnas en desktop.

## Elevation & Depth
- **Elevación Tonal**: La profundidad se crea mediante capas de color (`#121214` → `#181719` → `#1D1B1D`) y bordes finos translúcidos (`rgba(255, 255, 255, 0.06)`).
- **Brillo Sutil (Hover Glow)**: Resplandor ámbar controlado en hover de tarjetas (`0 14px 44px -18px rgba(242, 154, 46, 0.18)`).
- **Sin Sombras Pesadas**: Profundidad táctil sin sombras negras difusas o artificiales.

## Shapes
- **Tarjetas y Superficies**: Esquinas redondeadas suaves (`rounded-2xl` / `rounded-xl`).
- **Píldoras y Botones**: Bordes completamente redondeados (`rounded-full`) para badges, píldoras y botones de acción principal.
- **Focus Rings**: Anillo de foco de alta visibilidad `outline-3 outline-offset-4 outline-[#F29A2E]` para navegación accesible por teclado.

## Components
- **Navbar**: Barra de navegación sticky con efecto glassmorphism (`backdrop-blur-md`, borde inferior sutil).
- **Botones**:
  - *Primario*: Fondo ámbar dorado (`#F29A2E`), texto oscuro (`#121214`), peso bold, forma de píldora.
  - *Secundario / Outline*: Fondo transparente, borde fino, texto ámbar en hover.
- **Tarjetas de Proyecto**: Tarjetas limpias con vista previa multimedia optimizada, metadatos estructurados de problema/solución y enlaces directos contextuales a WhatsApp.

## Do's and Don'ts
- **HACER (DO)**:
  - Mantener los colores cálidos y aterrizados (pergamino `#EBDDCA` sobre carbón `#121214`).
  - Usar colores sólidos en titulares para garantizar máxima legibilidad y contraste WCAG AA.
  - Proveer enlaces de contacto directos con mensaje contextual.
  - Respetar las preferencias de accesibilidad (`prefers-reduced-motion`).
- **NO HACER (DON'T)**:
  - NO usar texto con gradientes arcoíris o bordes luminosos multicolores (marca típica de IA).
  - NO usar negro puro `#000000` ni blanco estéril `#FFFFFF`.
  - NO inventar métricas, calificaciones de estrellas falsas o testimonios no verificados.
  - NO agregar animaciones decorativas pesadas que retrasen la lectura o interacción.
