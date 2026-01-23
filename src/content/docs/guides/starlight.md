---
title: Starlight Docs Sites
description: Scaffold documentation sites with Astro's Starlight theme.
sidebar:
  order: 4
---

## What is Starlight?

[Starlight](https://starlight.astro.build/) is a full-featured documentation theme built on Astro. It provides:

- Sidebar navigation with auto-generation
- Search (powered by Pagefind)
- i18n support
- Dark/light mode
- Built-in components (cards, tabs, asides)

## Quick Setup

```bash
npm create astro@latest -- --template starlight
```

## Configuration

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
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
});
```

## Content Structure

```
src/content/docs/
  index.mdx              # Home page
  getting-started/
    installation.md
    quick-start.md
  guides/
    routing.md
    deployment.md
  reference/
    api.md               # Auto-generated sidebar picks these up
    config.md
```

## Sidebar Configuration

### Manual Items

```javascript
sidebar: [
  {
    label: 'Guides',
    items: [
      { label: 'Getting Started', slug: 'guides/getting-started' },
      { label: 'Advanced', slug: 'guides/advanced' },
    ],
  },
]
```

### Auto-Generated from Directory

```javascript
sidebar: [
  {
    label: 'Reference',
    autogenerate: { directory: 'reference' },
  },
]
```

### Collapsed Groups

```javascript
sidebar: [
  {
    label: 'Advanced',
    collapsed: true,
    items: [/* ... */],
  },
]
```

### External Links

```javascript
sidebar: [
  {
    label: 'Resources',
    items: [
      { label: 'Astro Docs', link: 'https://docs.astro.build' },
    ],
  },
]
```

## Page Frontmatter

```yaml
---
title: My Page Title
description: A description for SEO and social sharing.
sidebar:
  order: 2           # Manual ordering within auto-generated groups
  label: Custom Label # Override the title in sidebar
  badge:
    text: New
    variant: tip     # tip | note | danger | caution | success
  hidden: false      # Hide from sidebar but keep accessible
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 4
---
```

## Built-in Components

### Cards

```mdx
import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Feature One" icon="rocket">
    Description of feature one.
  </Card>
  <Card title="Feature Two" icon="puzzle">
    Description of feature two.
  </Card>
</CardGrid>
```

### Tabs

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
  <TabItem label="npm">
    ```bash
    npm install astro
    ```
  </TabItem>
  <TabItem label="pnpm">
    ```bash
    pnpm add astro
    ```
  </TabItem>
</Tabs>
```

### Asides (Callouts)

```markdown
:::note
This is a note.
:::

:::tip
This is a helpful tip.
:::

:::caution
Be careful with this.
:::

:::danger
This could break things!
:::
```

### Steps

```mdx
import { Steps } from '@astrojs/starlight/components';

<Steps>
1. Install the package
2. Configure the settings
3. Deploy your site
</Steps>
```

## i18n

```javascript
starlight({
  title: 'My Docs',
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
    es: { label: 'Español', lang: 'es' },
    fr: { label: 'Français', lang: 'fr' },
  },
}),
```

Content structure for i18n:

```
src/content/docs/
  en/
    index.md
    guides/...
  es/
    index.md
    guides/...
```

## Customization

### Custom CSS

```javascript
starlight({
  customCss: ['./src/styles/custom.css'],
}),
```

### Override Components

```javascript
starlight({
  components: {
    Header: './src/components/CustomHeader.astro',
    Footer: './src/components/CustomFooter.astro',
  },
}),
```

## Updating Starlight

```bash
npx @astrojs/upgrade
```
