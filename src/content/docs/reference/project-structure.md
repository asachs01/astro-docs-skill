---
title: Project Structure
description: Astro v5 project directory layout and file conventions.
sidebar:
  order: 1
---

## Directory Layout

```
project-root/
├── public/              # Static assets (unprocessed)
│   ├── robots.txt
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── assets/          # Images/assets for Astro to process
│   ├── components/      # .astro and framework components
│   ├── content/         # Content collection data files
│   │   └── blog/
│   │       ├── post-1.md
│   │       └── post-2.md
│   ├── layouts/         # Page layout components
│   ├── pages/           # File-based routing
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── blog/
│   │       └── [...slug].astro
│   ├── styles/          # Global CSS/Sass
│   ├── middleware.ts    # Request middleware
│   ├── actions/         # Server actions
│   │   └── index.ts
│   └── content.config.ts  # Collection definitions
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript config
└── package.json
```

## Key Directories

### `src/pages/`

Every file creates a route:

| File | Route |
|------|-------|
| `src/pages/index.astro` | `/` |
| `src/pages/about.astro` | `/about` |
| `src/pages/blog/index.astro` | `/blog` |
| `src/pages/blog/[slug].astro` | `/blog/:slug` |
| `src/pages/[...path].astro` | Catch-all |

Supported file types: `.astro`, `.md`, `.mdx`, `.html`, `.ts`/`.js` (API endpoints)

### `src/components/`

Convention (not required). Holds reusable `.astro` components and framework components (`.jsx`, `.vue`, `.svelte`).

### `src/layouts/`

Convention (not required). Layout components that wrap pages with common structure (head, nav, footer).

### `src/content/`

Convention for content collection data files (Markdown, JSON, YAML). Referenced by loaders in `content.config.ts`.

### `public/`

Static files served as-is. No processing, no bundling. Use for:
- Fonts
- `robots.txt`, `manifest.json`
- Files that need a predictable URL

### `src/assets/` vs `public/`

| Location | Processing | Use for |
|----------|-----------|---------|
| `src/assets/` or `src/images/` | Optimized, hashed filenames | Images you import in components |
| `public/` | None, copied as-is | Fonts, favicons, files needing stable URLs |

## Configuration Files

### `astro.config.mjs`

Required for integrations, adapters, and build config. Supports `.js`, `.mjs`, `.cjs`, `.ts`.

### `tsconfig.json`

Required for editor support. Extend Astro's base config:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

Options: `base`, `strict`, `strictest`

### `content.config.ts`

Defines content collections and their schemas. Lives at project root `src/content.config.ts`.

## Special Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Request middleware (runs before pages) |
| `src/actions/index.ts` | Type-safe server actions |
| `src/env.d.ts` | TypeScript environment declarations |
| `.astro/` | Generated types and collection schemas (gitignored) |
