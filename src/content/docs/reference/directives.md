---
title: Directives
description: Client, server, and template directives in Astro.
sidebar:
  order: 3
---

## Client Directives

Control how framework components (React, Vue, Svelte, etc.) are hydrated on the client.

### `client:load`

Hydrate immediately on page load. Highest priority.

```astro
<InteractiveNav client:load />
```

**Use for:** Navigation, modals, forms, anything above the fold.

### `client:idle`

Hydrate once the page is done with initial load (uses `requestIdleCallback`).

```astro
<AnalyticsWidget client:idle />
```

**Use for:** Low-priority UI that doesn't need immediate interaction.

### `client:visible`

Hydrate when the component enters the viewport (uses `IntersectionObserver`).

```astro
<ChartComponent client:visible />
```

**Use for:** Below-the-fold content, lazy-loaded widgets.

Can customize the observer:

```astro
<HeavyComponent client:visible={{ rootMargin: "200px" }} />
```

### `client:media`

Hydrate when a CSS media query matches.

```astro
<MobileMenu client:media="(max-width: 768px)" />
```

**Use for:** Components only needed at certain viewport sizes.

### `client:only`

Skip server rendering. Render only on the client.

```astro
<BrowserOnlyChart client:only="react" />
```

**Must specify the framework:** `"react"`, `"vue"`, `"svelte"`, `"solid-js"`, `"lit"`, `"preact"`

**Use for:** Components using browser-only APIs (canvas, WebGL, localStorage at render time).

## Server Directives

### `server:defer`

Defer component rendering to after initial page load. The page ships immediately with fallback content, then the component renders on the server and streams in.

```astro
<UserProfile server:defer>
  <LoadingSkeleton slot="fallback" />
</UserProfile>
```

**Use for:** Personalized content, slow data fetches, authenticated content.

## Template Directives

### `class:list`

Build class strings from arrays, objects, and values:

```astro
<div class:list={[
  'base-class',
  { active: isActive, hidden: !show },
  conditionalClass && 'applied',
]} />
```

### `set:html`

Inject raw HTML (like `innerHTML`):

```astro
<div set:html={rawHtmlString} />
```

:::danger
Only use with trusted content. This bypasses Astro's HTML escaping.
:::

### `set:text`

Set text content (safely escaped):

```astro
<p set:text={userInput} />
```

### `is:global`

Make `<style>` apply globally instead of scoped:

```astro
<style is:global>
  body { margin: 0; }
  .prose h1 { font-size: 2rem; }
</style>
```

### `is:inline`

Skip processing for script/style tags:

```astro
<!-- No bundling, no deduplication -->
<script is:inline>
  console.log('Runs as-is for each component instance');
</script>

<style is:inline>
  /* Not scoped, not processed */
</style>
```

### `is:raw`

Skip Astro template processing for child content:

```astro
<div is:raw>
  {/* This won't be treated as a JS expression */}
  <p>Rendered literally including {curly braces}</p>
</div>
```

### `define:vars`

Pass component variables to `<script>` or `<style>` tags:

```astro
---
const textColor = 'navy';
const message = 'Hello';
---

<style define:vars={{ textColor }}>
  h1 { color: var(--textColor); }
</style>

<script define:vars={{ message }}>
  console.log(message);  // 'Hello'
</script>
```

:::note
`define:vars` scripts are automatically `is:inline` (not bundled).
:::

## Transition Directives

Used with [View Transitions](https://docs.astro.build/en/guides/view-transitions/).

### `transition:name`

Unique identifier for animating between pages:

```astro
<h1 transition:name="page-title">{title}</h1>
<img transition:name={`hero-${id}`} src={image} />
```

### `transition:animate`

Override the default animation:

```astro
<div transition:animate="slide">Slides in</div>
<div transition:animate="fade">Fades in</div>
<div transition:animate="none">No animation</div>
```

### `transition:persist`

Keep a component alive across page navigations (no re-render):

```astro
<AudioPlayer transition:persist />
<video transition:persist />
```
