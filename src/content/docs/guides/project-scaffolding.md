---
title: Project Scaffolding
description: Create complete Astro projects for different use cases.
sidebar:
  order: 1
---

The skill can scaffold complete Astro projects tailored to specific use cases. Each recipe creates the right file structure, configuration, and patterns for Astro v5.

## Blog Site

A typical blog includes content collections, dynamic routing, and layouts for posts.

**Files created:**

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Sitemap, MDX integrations |
| `src/content.config.ts` | Blog collection with glob loader |
| `src/layouts/BaseLayout.astro` | HTML shell with nav |
| `src/layouts/BlogPostLayout.astro` | Post layout with metadata |
| `src/pages/index.astro` | Home with recent posts |
| `src/pages/blog/index.astro` | All posts listing |
| `src/pages/blog/[...slug].astro` | Dynamic post pages |
| `src/content/blog/` | Markdown posts directory |

**Key patterns:**

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
});

export const collections = { blog };
```

## E-commerce Site

Interactive product pages with cart functionality using framework islands.

**Files created:**

| File | Purpose |
|------|---------|
| `astro.config.mjs` | React + Tailwind integrations |
| `src/content.config.ts` | Products collection (remote loader) |
| `src/layouts/ShopLayout.astro` | Layout with cart sidebar |
| `src/pages/products/index.astro` | Product grid |
| `src/pages/products/[id].astro` | Product detail page |
| `src/components/CartButton.jsx` | Interactive cart (client:load) |
| `src/pages/api/checkout.ts` | Payment API endpoint |

**Key pattern — remote data loader:**

```typescript
const products = defineCollection({
  loader: async () => {
    const response = await fetch("https://api.stripe.com/products");
    const data = await response.json();
    return data.map((item) => ({ id: item.id, ...item }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
    images: z.array(z.string().url()),
  })
});
```

## Documentation Site (Starlight)

See the dedicated [Starlight guide](/astro-docs-skill/guides/starlight/) for full details.

```bash
npm create astro@latest -- --template starlight
```

## Portfolio Site

Image-heavy project showcase with view transitions.

**Files created:**

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Image optimization config |
| `src/content.config.ts` | Projects collection |
| `src/layouts/BaseLayout.astro` | With ViewTransitions |
| `src/pages/index.astro` | Hero + featured projects |
| `src/pages/projects/[...slug].astro` | Project detail |
| `src/components/ProjectCard.astro` | Card with transition:name |

**Key pattern — view transitions:**

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>

<!-- Elements with matching transition:name animate between pages -->
<img transition:name={`project-${id}`} src={image} alt={title} />
```

## Landing Page

Static, performance-focused single page.

**Files created:**

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Minimal config, tailwind |
| `src/pages/index.astro` | Full landing page |
| `src/components/Hero.astro` | Hero section |
| `src/components/Features.astro` | Feature grid |
| `src/components/CTA.astro` | Call-to-action |
| `src/components/Footer.astro` | Footer |
