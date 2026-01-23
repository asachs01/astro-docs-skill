---
title: Common Patterns
description: Frequently used patterns in Astro v5 projects.
sidebar:
  order: 4
---

## Middleware

Intercept requests before page rendering:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, request, redirect, url } = context;

  // Auth check
  const token = request.headers.get('authorization');
  if (!token && url.pathname.startsWith('/dashboard')) {
    return redirect('/login');
  }

  // Set data for pages via locals
  locals.user = await verifyToken(token);

  return next();
});
```

Access in pages via `Astro.locals`:

```astro
---
const { user } = Astro.locals;
---
<p>Welcome, {user.name}!</p>
```

## Actions

Type-safe server functions callable from any page:

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  subscribe: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }),
    handler: async ({ email, name }) => {
      await db.subscribers.create({ email, name });
      return { success: true, message: `Welcome, ${name}!` };
    },
  }),
};
```

Call from a page:

```astro
---
import { actions } from 'astro:actions';

if (Astro.request.method === 'POST') {
  const result = await actions.subscribe(Astro.request);
}
---

<form method="POST" action={actions.subscribe}>
  <input name="email" type="email" required />
  <input name="name" required />
  <button type="submit">Subscribe</button>
</form>
```

## API Endpoints

```typescript
// src/pages/api/users.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const limit = url.searchParams.get('limit') ?? '10';
  const users = await db.users.findMany({ take: Number(limit) });

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.email) {
    return new Response(JSON.stringify({ error: 'Email required' }), {
      status: 400,
    });
  }

  const user = await db.users.create({ data: body });
  return new Response(JSON.stringify(user), { status: 201 });
};
```

## Sessions

Store user data across requests:

```javascript
// astro.config.mjs
export default defineConfig({
  session: { driver: 'fs' },
});
```

```astro
---
const session = await Astro.session;

// Read
const cart = await session.get('cart') ?? [];

// Write
await session.set('cart', [...cart, newItem]);

// Destroy
await session.destroy();
---
```

## View Transitions

Smooth page transitions without full reload:

```astro
---
// In your layout
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <ViewTransitions />
</head>
```

Persist elements across navigations:

```astro
<audio id="player" transition:persist>
  <source src="/music.mp3" />
</audio>
```

## Image Optimization

```astro
---
import { Image, getImage } from 'astro:assets';
import heroImg from '../assets/hero.jpg';
---

<!-- Component (recommended) -->
<Image src={heroImg} alt="Hero" width={800} />

<!-- Programmatic -->
{async () => {
  const optimized = await getImage({ src: heroImg, width: 400 });
  return <img src={optimized.src} {...optimized.attributes} />;
}}
```

## RSS Feed

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'A blog about stuff',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

## Environment Variables

```ini
# .env
PUBLIC_API_URL=https://api.example.com
SECRET_KEY=super-secret
```

```astro
---
// Server-side (all vars available)
const secret = import.meta.env.SECRET_KEY;

// Client-side (only PUBLIC_ prefix)
const apiUrl = import.meta.env.PUBLIC_API_URL;

// Built-in
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;
---
```

## Dynamic Imports

```astro
---
// Conditional component loading
const Component = (await import(`../components/${name}.astro`)).default;
---

<Component />
```

## Error Pages

```astro
---
// src/pages/404.astro
---
<html>
  <body>
    <h1>Page Not Found</h1>
    <a href="/">Go home</a>
  </body>
</html>
```

```astro
---
// src/pages/500.astro (SSR only)
---
<html>
  <body>
    <h1>Server Error</h1>
  </body>
</html>
```

## Redirects

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/old-page': '/new-page',
    '/blog/[...slug]': '/articles/[...slug]',
  },
});
```

Or in middleware:

```typescript
if (url.pathname === '/old') {
  return redirect('/new', 301);
}
```
