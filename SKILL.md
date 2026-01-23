---
name: astro-docs
description: |
  Scaffold and develop Astro projects with correct v5 patterns. Use when:
  (1) creating new Astro projects (blogs, docs/Starlight, ecommerce, portfolios, landing pages),
  (2) scaffolding individual Astro components, pages, layouts, or islands,
  (3) setting up content collections with the Content Layer API,
  (4) configuring integrations, routing, or deployment,
  (5) working with .astro files or astro.config.* detected in the project.
  Auto-activates when .astro files or Astro project structure is detected.
  For edge cases or unfamiliar APIs, fetch live docs from https://docs.astro.build/en/.
author: Claude Code
version: 1.0.0
date: 2026-01-23
---

# Astro Project Scaffolding & Development

## Context / Trigger Conditions

- User asks to create a new Astro project or site
- User asks to scaffold components, pages, layouts, or islands
- User asks about Astro-specific patterns (content collections, view transitions, islands, etc.)
- Working directory contains `.astro` files, `astro.config.*`, or `src/pages/`
- User mentions "Astro", "Starlight", or "astro components"

## Prerequisites

- **Node.js**: v18.20.8+, v20.3.0+, or v22.0.0+ (v19/v21 not supported)
- **Package manager**: npm, pnpm, or yarn

## Quick Project Creation

```bash
# Standard project
npm create astro@latest

# With template
npm create astro@latest -- --template <template-name>

# Starlight docs site
npm create astro@latest -- --template starlight

# With integrations
npm create astro@latest -- --add react --add tailwind
```

## Project Structure (Astro v5)

```
project-root/
  public/              # Static assets (copied as-is to build output)
    robots.txt
    favicon.svg
  src/
    components/        # Reusable .astro or framework components
    content/           # (optional) Content collection data
    images/            # Images processed by Astro's image optimization
    layouts/           # Page layout components
    pages/             # File-based routing (each file = a route)
      index.astro
      about.astro
      blog/
        [slug].astro   # Dynamic route
    styles/            # Global CSS/Sass
    content.config.ts  # Content collection definitions
  astro.config.mjs     # Astro configuration
  tsconfig.json        # TypeScript config (extends astro/tsconfigs/base)
  package.json
```

## Astro Component Anatomy

```astro
---
// Component Script (server-side only, never sent to browser)
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

// Props with TypeScript
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Default description" } = Astro.props;

// Fetch data, access environment variables, etc.
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<!-- Component Template (HTML + JS Expressions) -->
<Layout title={title}>
  <h1>{title}</h1>
  <p>{description}</p>

  {/* Conditional rendering */}
  {data && <Card title={data.name} />}

  {/* List rendering */}
  <ul>
    {data.items.map(item => <li>{item.name}</li>)}
  </ul>

  {/* Named slot */}
  <slot name="sidebar" />

  {/* Default slot */}
  <slot />
</Layout>

<style>
  /* Scoped by default */
  h1 { color: navy; }
</style>

<script>
  // Client-side JavaScript (bundled, deduped)
  console.log('This runs in the browser');
</script>
```

## Content Collections (Content Layer API - Astro v5)

### Configuration: `src/content.config.ts`

```typescript
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
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
    author: reference('authors'),        // Reference another collection
    tags: z.array(z.string()).default([]),
  })
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().url().optional(),
  })
});

// Remote data collection (inline loader)
const products = defineCollection({
  loader: async () => {
    const response = await fetch("https://api.example.com/products");
    const data = await response.json();
    return data.map((item: any) => ({ id: item.sku, ...item }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
    inStock: z.boolean(),
  })
});

export const collections = { blog, authors, products };
```

### Querying Collections

```astro
---
import { getCollection, getEntry, render } from 'astro:content';

// Get all entries
const posts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// Get single entry
const featured = await getEntry('blog', 'my-first-post');

// Render markdown content
const { Content, headings } = await render(featured);
---
```

### Dynamic Routes from Collections

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <time>{post.data.pubDate.toLocaleDateString()}</time>
  <Content />
</article>
```

## Layouts

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer">
        <p>&copy; {new Date().getFullYear()}</p>
      </slot>
    </footer>
  </body>
</html>
```

## Islands Architecture (Client Directives)

```astro
---
import ReactCounter from '../components/Counter.jsx';
import VueWidget from '../components/Widget.vue';
import SvelteToggle from '../components/Toggle.svelte';
---

<!-- No JS sent to client (static HTML only) -->
<ReactCounter />

<!-- Hydrate on page load -->
<ReactCounter client:load />

<!-- Hydrate when visible in viewport -->
<VueWidget client:visible />

<!-- Hydrate when idle -->
<SvelteToggle client:idle />

<!-- Hydrate on specific media query -->
<ReactCounter client:media="(max-width: 768px)" />

<!-- Only render on client (skip SSR) -->
<ReactCounter client:only="react" />
```

## Server Islands (Astro v5)

```astro
---
import UserGreeting from '../components/UserGreeting.astro';
---

<!-- Defer rendering, show fallback while loading -->
<UserGreeting server:defer>
  <div slot="fallback">Loading user data...</div>
</UserGreeting>
```

## Astro Configuration (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://example.com',
  base: '/docs',               // If deployed to subpath
  trailingSlash: 'always',

  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap(),
  ],

  // SSR adapter (for on-demand rendering)
  adapter: vercel(),
  output: 'server',            // 'static' (default) | 'server' | 'hybrid'

  // Vite config passthrough
  vite: {
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  },

  // Image optimization
  image: {
    domains: ['cdn.example.com'],
  },

  // i18n routing
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
});
```

## Starlight Documentation Site

### Setup

```bash
npm create astro@latest -- --template starlight
```

### Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/...' },
      ],
      sidebar: [
        { label: 'Guides', items: [
          { label: 'Getting Started', slug: 'guides/getting-started' },
          { label: 'Configuration', slug: 'guides/configuration' },
        ]},
        { label: 'Reference', autogenerate: { directory: 'reference' } },
      ],
      defaultLocale: 'en',
      locales: { en: { label: 'English' }, es: { label: 'Español' } },
    }),
  ],
});
```

### Content structure

```
src/content/docs/
  index.mdx              # Home page
  guides/
    getting-started.md
    configuration.md
  reference/
    api.md
    cli.md
```

### Frontmatter

```yaml
---
title: Getting Started
description: Learn how to get started with our project.
sidebar:
  order: 1
  badge:
    text: New
    variant: tip
---
```

## Common Patterns

### View Transitions

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>

<!-- Named transition -->
<h1 transition:name="title">{title}</h1>

<!-- Transition animation -->
<div transition:animate="slide">Content</div>
```

### Middleware (`src/middleware.ts`)

```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Run before each page render
  const { locals, request, redirect } = context;

  // Set data available in all pages via Astro.locals
  locals.user = await getUser(request);

  if (!locals.user && context.url.pathname.startsWith('/dashboard')) {
    return redirect('/login');
  }

  return next();
});
```

### Actions (`src/actions/index.ts`)

```typescript
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  newsletter: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      await addToNewsletter(email);
      return { success: true };
    },
  }),
};
```

### Endpoints (`src/pages/api/data.ts`)

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify({ message: 'Hello' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  return new Response(JSON.stringify({ received: body }), { status: 200 });
};
```

### Sessions (Astro v5)

```typescript
// astro.config.mjs - enable sessions
export default defineConfig({
  session: {
    driver: 'fs', // or 'redis', 'netlify-blobs', etc.
  },
});
```

```astro
---
// In any server-rendered page/endpoint
const session = await Astro.session;
const visits = (await session.get('visits') ?? 0) + 1;
await session.set('visits', visits);
---
```

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
---

<!-- Optimized image with automatic format conversion -->
<Image src={heroImage} alt="Hero" width={800} />

<!-- Remote image (must configure domains in astro.config) -->
<Image src="https://cdn.example.com/photo.jpg" alt="Remote" width={400} height={300} />
```

## Scaffolding Recipes

### Blog Site

Key files to create:
1. `astro.config.mjs` - with sitemap, mdx integrations
2. `src/content.config.ts` - blog collection with glob loader
3. `src/layouts/BaseLayout.astro` - HTML shell
4. `src/layouts/BlogPostLayout.astro` - post layout with metadata
5. `src/pages/index.astro` - home with recent posts
6. `src/pages/blog/index.astro` - all posts listing
7. `src/pages/blog/[...slug].astro` - dynamic post pages
8. `src/content/blog/` - markdown posts directory

### E-commerce Site

Key files to create:
1. `astro.config.mjs` - with react (for cart), tailwind
2. `src/content.config.ts` - products collection (remote loader from Stripe/Shopify)
3. `src/layouts/ShopLayout.astro` - with cart sidebar
4. `src/pages/products/index.astro` - product grid
5. `src/pages/products/[id].astro` - product detail
6. `src/components/CartButton.jsx` - client:load for interactivity
7. `src/pages/api/checkout.ts` - payment endpoint

### Portfolio Site

Key files to create:
1. `astro.config.mjs` - with image optimization config
2. `src/content.config.ts` - projects collection
3. `src/layouts/BaseLayout.astro` - with ViewTransitions
4. `src/pages/index.astro` - hero + featured projects
5. `src/pages/projects/[...slug].astro` - project details
6. `src/components/ProjectCard.astro` - with transition:name

## Live Docs Lookup

For edge cases, unfamiliar APIs, or the latest updates not covered above, fetch the relevant documentation page:

- **Base URL**: `https://docs.astro.build/en/`
- **Key sections**:
  - `/install-and-setup/` - Installation
  - `/basics/project-structure/` - Project structure
  - `/basics/astro-components/` - Components
  - `/basics/astro-pages/` - Pages
  - `/basics/layouts/` - Layouts
  - `/guides/content-collections/` - Content collections
  - `/guides/routing/` - Routing
  - `/guides/styling/` - CSS/styling
  - `/guides/view-transitions/` - View transitions
  - `/guides/server-islands/` - Server islands
  - `/guides/integrations-guide/` - Integrations
  - `/guides/deploy/` - Deployment guides
  - `/guides/actions/` - Actions
  - `/guides/middleware/` - Middleware
  - `/guides/endpoints/` - API endpoints
  - `/guides/sessions/` - Sessions
  - `/reference/configuration-reference/` - Config reference
  - `/reference/api-reference/` - API reference
  - `/reference/directives-reference/` - Directives (client:, etc.)
- **Starlight**: `https://starlight.astro.build/`

Use the `context7` MCP tool or `firecrawl` to fetch current docs when needed. Prefer `context7/query-docs` with library ID `astro` for quick lookups.

## Important Notes

- Astro v5 uses **Content Layer API** — `src/content.config.ts` with `glob()`/`file()` loaders replaces the legacy `src/content/` directory convention
- The `render()` function is now imported from `'astro:content'` (not a method on the entry)
- `getStaticPaths()` uses `post.id` (not `post.slug`) for route params
- All component script code runs on the server only — never reaches the browser
- `<style>` tags in `.astro` files are scoped by default; use `is:global` for global styles
- Use `client:*` directives only on framework components (React, Vue, Svelte, etc.)
- TypeScript is supported natively; extend `astro/tsconfigs/strict` for best DX
- Images in `src/` are optimized; images in `public/` are served as-is
- **GitHub Pages base path**: When deploying to a subpath (e.g., `username.github.io/repo-name`), set both `site` and `base` in `astro.config.mjs`. Starlight sidebar `slug` references are handled correctly, but hero action `link` values in MDX frontmatter do **NOT** get `base` prepended automatically — you must include the full path (e.g., `/repo-name/getting-started/`) in frontmatter links
