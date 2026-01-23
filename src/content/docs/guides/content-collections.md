---
title: Content Collections
description: Set up type-safe content collections with the Astro v5 Content Layer API.
sidebar:
  order: 3
---

## Overview

Astro v5 introduced the **Content Layer API** — a performant, scalable system for defining and querying content. Collections provide:

- **Type safety** via Zod schemas
- **Intellisense** in your editor
- **Built-in loaders** for local files (`glob()`, `file()`)
- **Custom loaders** for remote data (CMS, database, API)

## Configuration File

Define collections in `src/content.config.ts`:

```typescript
// 1. Import utilities
import { defineCollection, reference } from 'astro:content';

// 2. Import loaders
import { glob, file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define collections
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
});

// 5. Export
export const collections = { blog };
```

## Built-in Loaders

### `glob()` — One File Per Entry

For directories of Markdown, MDX, JSON, YAML, or TOML files:

```typescript
const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog"
  }),
  schema: z.object({ /* ... */ })
});
```

- Each file becomes one entry
- `id` is auto-generated from the filename
- Supports glob patterns: `['*.md', '!draft-*']`

### `file()` — Multiple Entries From One File

For a single JSON/YAML/TOML file containing multiple entries:

```typescript
const dogs = defineCollection({
  loader: file("src/data/dogs.json"),
  schema: z.object({
    id: z.string(),
    breed: z.string(),
    temperament: z.array(z.string()),
  })
});
```

With a custom parser (e.g., CSV):

```typescript
import { parse as parseCsv } from "csv-parse/sync";

const products = defineCollection({
  loader: file("src/data/products.csv", {
    parser: (text) => parseCsv(text, { columns: true, skipEmptyLines: true })
  })
});
```

## Remote/Custom Loaders

### Inline Loader (Simple)

```typescript
const countries = defineCollection({
  loader: async () => {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    // Must return array with `id` property
    return data.map((c) => ({ id: c.cca3, ...c }));
  },
  schema: z.object({
    name: z.object({ common: z.string() }),
    population: z.number(),
  })
});
```

### Loader Object (Advanced)

For incremental updates, caching, or publishing as npm packages — see the [Content Loader API reference](https://docs.astro.build/en/reference/content-loader-reference/).

## Schema Patterns

### Common Field Types

```typescript
schema: z.object({
  // Strings
  title: z.string(),
  slug: z.string().optional(),

  // Dates (coerce parses date strings)
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),

  // Booleans with defaults
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),

  // Arrays
  tags: z.array(z.string()).default([]),

  // Enums
  category: z.enum(['tutorial', 'guide', 'reference']),

  // Numbers
  readingTime: z.number().optional(),

  // URLs
  heroImage: z.string().url().optional(),
  externalLink: z.string().url().optional(),
})
```

### Collection References

Link entries across collections:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    author: reference('authors'),           // Single reference
    relatedPosts: z.array(reference('blog')), // Array of references
  })
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
  })
});
```

## Querying

### Get All Entries

```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
```

### Get Single Entry

```astro
---
import { getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-first-post');
---
```

### Filter by Subdirectory

```astro
---
const englishDocs = await getCollection('docs', ({ id }) => {
  return id.startsWith('en/');
});
---
```

### Resolve References

```astro
---
import { getEntry, getEntries } from 'astro:content';

const post = await getEntry('blog', 'welcome');
const author = await getEntry(post.data.author);
const related = await getEntries(post.data.relatedPosts);
---
```

## Rendering Content

```astro
---
import { getEntry, render } from 'astro:content';

const post = await getEntry('blog', 'my-post');
const { Content, headings } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />  <!-- Rendered markdown/MDX -->
</article>
```

:::note
In Astro v5, `render()` is imported from `'astro:content'` — it's no longer a method on the entry object.
:::

## Dynamic Routes

### Static (Default)

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },  // v5 uses post.id, not post.slug
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Content />
```

### SSR (On-Demand)

```astro
---
// src/pages/blog/[id].astro
import { getEntry, render } from 'astro:content';

const { id } = Astro.params;
if (!id) return Astro.redirect('/404');

const post = await getEntry('blog', id);
if (!post) return Astro.redirect('/404');

const { Content } = await render(post);
---

<Content />
```
