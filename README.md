# Pull Request I — Single Repository Workflow

Presentación interactiva sobre Pull Requests en Git (modelo single-repository).
Construida con **Next.js 15**, **Tailwind CSS v4**, **Motion** y **Lucide**.

## 📦 Stack

- Next.js 15 (App Router) + React 19
- TypeScript strict
- Tailwind CSS v4 con `@theme` en `globals.css`
- Motion (`motion/react`) para animaciones
- Lucide React para iconografía
- Fonts: Inter, Space Grotesk, JetBrains Mono (vía `next/font/google`)

## 🚀 Cómo correrlo

Recomendado **pnpm**, pero también funciona con npm:

```bash
pnpm install
pnpm dev
```

```bash
# o con npm
npm install
npm run dev
```

Abrí http://localhost:3000

### Build de producción

```bash
pnpm build
pnpm start
```

## ⌨️ Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `→` `Espacio` `PgDn` | Siguiente slide |
| `←` `PgUp` | Slide anterior |
| `Esc` | Volver al inicio |
| `F` | Toggle fullscreen |

> Más atajos (notas del presentador, temporizador, sonidos, modo pánico) se incorporan en las fases siguientes.

## 📁 Estructura

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 + @theme tokens
│   ├── layout.tsx           # Fonts + metadata
│   └── page.tsx             # Renderiza <Presentation />
├── components/
│   ├── Presentation.tsx     # Controlador + AnimatePresence
│   ├── ProgressBar.tsx      # Barra naranja superior animada
│   └── slides/
│       ├── Slide01Cover.tsx
│       ├── Slide02Problem.tsx
│       ├── Slide03WhatIsPR.tsx
│       ├── Slide04SingleRepo.tsx
│       ├── Slide05Flow.tsx
│       ├── Slide06Demo.tsx
│       ├── Slide07MergeStrategies.tsx
│       └── Slide08Closing.tsx
├── hooks/
│   └── useKeyboardShortcuts.ts
└── types/
    └── index.ts
```

## 🎨 Sistema de diseño

Estilo moderno, minimalista, audaz. Alto contraste blanco / negro carbón / grises con un único acento naranja.

| Token | Valor |
|-------|-------|
| `--color-bg-primary` | `#FFFFFF` |
| `--color-bg-secondary` | `#F5F5F5` |
| `--color-bg-dark` | `#0A0A0A` |
| `--color-text-primary` | `#0A0A0A` |
| `--color-text-secondary` | `#6B6B6B` |
| `--color-divider` | `#E5E5E5` |
| `--color-accent` | `#FF6B35` |
| `--color-success` | `#2D9F4F` |
| `--color-merged` | `#6B3FA0` |


Hecho con ☕ por **Deploy en Viernes**
