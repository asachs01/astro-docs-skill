---
title: Configuration
description: Astro configuration options reference.
sidebar:
  order: 2
---

## Basic Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Options here
});
```

## Core Options

### `site`

Your deployed URL. Required for sitemaps, canonical URLs, and RSS feeds.

```javascript
site: 'https://example.com'
```

### `base`

Deploy path prefix (for subdirectory deployments).

```javascript
base: '/docs'  // Site at example.com/docs/
```

### `trailingSlash`

Control trailing slash behavior.

```javascript
trailingSlash: 'always' | 'never' | 'ignore'
```

### `output`

Rendering mode.

```javascript
output: 'static'  // Default: prerender all pages
output: 'server'  // On-demand rendering (needs adapter)
```

### `adapter`

Server adapter for SSR deployment.

```javascript
import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

adapter: vercel()
```

## Integrations

```javascript
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

integrations: [
  react(),
  tailwind(),
  mdx(),
  sitemap(),
]
```

Add integrations via CLI:

```bash
npx astro add react tailwind
```

## Image Optimization

```javascript
image: {
  // Allow remote image domains
  domains: ['cdn.example.com', 'images.unsplash.com'],

  // Allow remote image URL patterns
  remotePatterns: [
    { protocol: 'https', hostname: '**.amazonaws.com' }
  ],

  // Default image service
  service: { entrypoint: 'astro/assets/services/sharp' },
}
```

## i18n Routing

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de'],
  routing: {
    prefixDefaultLocale: false,  // /about vs /en/about
  },
  fallback: {
    fr: 'en',  // Fall back to English for missing French pages
  },
}
```

## Prefetch

```javascript
prefetch: {
  prefetchAll: true,           // Prefetch all links
  defaultStrategy: 'viewport', // 'hover' | 'viewport' | 'load'
}
```

## Session

```javascript
session: {
  driver: 'fs',           // 'fs' | 'redis' | 'netlify-blobs' | etc.
  // Driver-specific options:
  // base: '.sessions',   // for 'fs' driver
}
```

## Vite Config

Pass-through to Vite:

```javascript
vite: {
  plugins: [/* Vite plugins */],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' }
    }
  },
  build: {
    rollupOptions: { /* ... */ }
  },
  server: {
    proxy: { '/api': 'http://localhost:3001' }
  },
}
```

## Dev Server

```javascript
server: {
  port: 4321,      // Default dev port
  host: true,      // Expose to network
}
```

## Build Options

```javascript
build: {
  inlineStylesheets: 'auto', // 'auto' | 'always' | 'never'
}
```

## Full Example

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://mysite.com',
  output: 'server',
  adapter: vercel(),

  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap(),
  ],

  image: {
    domains: ['cdn.mysite.com'],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },

  prefetch: {
    defaultStrategy: 'viewport',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  },
});
```
