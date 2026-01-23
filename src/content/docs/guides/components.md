---
title: Components & Pages
description: Scaffold Astro components, pages, and layouts with correct patterns.
sidebar:
  order: 2
---

## Astro Component Anatomy

Every `.astro` component has two parts: the **component script** (frontmatter) and the **component template**.

```astro
---
// Component Script — runs on the server only
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Default" } = Astro.props;
---

<!-- Component Template — rendered to HTML -->
<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>
  <slot />
</div>

<style>
  /* Scoped to this component by default */
  .card {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
  }
</style>
```

## Props with TypeScript

Define a `Props` interface for automatic type checking:

```astro
---
interface Props {
  title: string;
  href: string;
  isActive?: boolean;
  variant?: 'primary' | 'secondary';
}

const { title, href, isActive = false, variant = 'primary' } = Astro.props;
---

<a href={href} class:list={[variant, { active: isActive }]}>
  {title}
</a>
```

## Slots

### Default Slot

```astro
---
// Container.astro
---
<div class="container">
  <slot />  <!-- Children render here -->
</div>
```

### Named Slots

```astro
---
// Layout.astro
---
<header>
  <slot name="header" />
</header>
<main>
  <slot />  <!-- Default slot -->
</main>
<footer>
  <slot name="footer">
    <p>Default footer content</p>  <!-- Fallback -->
  </slot>
</footer>
```

Usage:

```astro
<Layout>
  <h1 slot="header">My Page</h1>
  <p>Main content goes here</p>
  <nav slot="footer">Custom footer</nav>
</Layout>
```

### Slot Transfers (Nested Layouts)

```astro
---
// HomeLayout.astro
import BaseLayout from './BaseLayout.astro';
---
<BaseLayout>
  <slot name="head" slot="head" />
  <slot />
</BaseLayout>
```

## Pages

Pages live in `src/pages/` and create routes automatically.

### Static Page

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <h1>About Us</h1>
  <p>Content here.</p>
</BaseLayout>
```

### Dynamic Route

```astro
---
// src/pages/blog/[slug].astro
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

<Content />
```

### Rest Parameters (Catch-all)

```astro
---
// src/pages/docs/[...path].astro
export function getStaticPaths() {
  return [
    { params: { path: 'getting-started' } },
    { params: { path: 'guides/routing' } },
    { params: { path: undefined } },  // matches /docs/
  ];
}
---
```

## Layouts

Layouts are reusable page shells with slots for content:

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
    <slot />
  </body>
</html>
```

## Expressions & Conditional Rendering

```astro
---
const items = ['Astro', 'React', 'Vue'];
const showBanner = true;
---

{/* Conditional */}
{showBanner && <div class="banner">Welcome!</div>}

{/* Ternary */}
<p>{items.length > 0 ? 'Has items' : 'Empty'}</p>

{/* Map */}
<ul>
  {items.map(item => <li>{item}</li>)}
</ul>

{/* Dynamic attributes */}
<div class:list={['base', { active: true, hidden: false }]} />
```

## Styles

```astro
<!-- Scoped (default) -->
<style>
  h1 { color: navy; }
</style>

<!-- Global -->
<style is:global>
  body { margin: 0; }
</style>

<!-- Import external CSS -->
<style>
  @import '../styles/global.css';
</style>
```

## Client-Side Scripts

```astro
<!-- Bundled and deduped (runs once even if component used multiple times) -->
<script>
  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav')?.classList.toggle('open');
  });
</script>

<!-- Inline (no processing, runs for each instance) -->
<script is:inline>
  alert('Hello!');
</script>
```
