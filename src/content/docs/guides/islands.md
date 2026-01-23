---
title: Islands & Interactivity
description: Add client-side interactivity using Astro's islands architecture.
sidebar:
  order: 5
---

## Islands Architecture

Astro renders everything to static HTML by default. Interactive components are opt-in "islands" — isolated pieces of UI that hydrate independently.

This means:
- **Zero JS by default** — static components ship no JavaScript
- **Partial hydration** — only interactive parts load client JS
- **Framework-agnostic** — mix React, Vue, Svelte, etc. on the same page

## Client Directives

Add a `client:*` directive to any framework component to make it interactive:

```astro
---
import Counter from '../components/Counter.jsx';
---

<!-- Static HTML only (no JS) -->
<Counter />

<!-- Hydrate immediately on page load -->
<Counter client:load />

<!-- Hydrate when component enters viewport -->
<Counter client:visible />

<!-- Hydrate when browser is idle -->
<Counter client:idle />

<!-- Hydrate on media query match -->
<Counter client:media="(max-width: 768px)" />

<!-- Skip SSR, render only on client -->
<Counter client:only="react" />
```

### When to Use Each

| Directive | Use Case |
|-----------|----------|
| `client:load` | High-priority interactive UI (nav, modals, forms) |
| `client:visible` | Below-the-fold content (charts, carousels) |
| `client:idle` | Low-priority enhancements (analytics widgets) |
| `client:media` | Mobile-only or desktop-only interactions |
| `client:only` | Components that can't render on server (uses browser APIs) |

## Adding Framework Integrations

```bash
# Add React
npx astro add react

# Add Vue
npx astro add vue

# Add Svelte
npx astro add svelte

# Add Solid
npx astro add solid-js
```

## Example: React Counter

```jsx
// src/components/Counter.jsx
import { useState } from 'react';

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

```astro
---
import Counter from '../components/Counter.jsx';
---

<Counter client:visible initialCount={5} />
```

## Server Islands (Astro v5)

Server islands defer rendering of personalized/dynamic content without blocking the page:

```astro
---
import UserGreeting from '../components/UserGreeting.astro';
---

<!-- Component renders on server after initial page load -->
<UserGreeting server:defer>
  <div slot="fallback">
    <p>Loading your profile...</p>
  </div>
</UserGreeting>
```

Use cases:
- User-specific content (logged-in state, preferences)
- Real-time data that shouldn't block page render
- A/B testing variants
- Content behind authentication

## Sharing State Between Islands

Islands are isolated by default. To share state, use [Nano Stores](https://github.com/nanostores/nanostores):

```bash
npm install nanostores @nanostores/react @nanostores/vue
```

```typescript
// src/stores/cart.ts
import { atom, map } from 'nanostores';

export const cartItems = map<Record<string, number>>({});

export function addItem(id: string) {
  cartItems.setKey(id, (cartItems.get()[id] ?? 0) + 1);
}
```

```jsx
// React island
import { useStore } from '@nanostores/react';
import { cartItems, addItem } from '../stores/cart';

export function CartButton({ id }) {
  const items = useStore(cartItems);
  return <button onClick={() => addItem(id)}>Add ({items[id] ?? 0})</button>;
}
```

## Client-Side Scripts (No Framework)

For simple interactivity without a framework, use `<script>` tags:

```astro
<button id="theme-toggle">Toggle Theme</button>

<script>
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
</script>
```

Scripts are:
- **Bundled and deduped** by default (run once per page)
- Use `is:inline` to skip bundling (runs per component instance)
