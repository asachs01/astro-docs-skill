---
title: Starlight Theming
description: Deep dive into Starlight's CSS custom property system, semantic color naming, and reusable theme packages.
sidebar:
  order: 5
---

Starlight's CSS custom properties use **semantic names** that invert between light and dark modes. This is the most common source of theming bugs — the variable names do NOT correspond to literal colors.

## Semantic Color System

:::danger[Critical Concept]
Starlight's color variable names are **inverted from what you'd expect**. "White" means foreground (text), "Black" means background. This naming is intentional — it describes the *role*, not the *appearance*.
:::

| Variable | Meaning | Light Mode Value | Dark Mode Value |
|----------|---------|-----------------|-----------------|
| `--sl-color-white` | **Foreground/text** | Dark color | Light color |
| `--sl-color-black` | **Background** | White/light | Dark/black |
| `--sl-color-gray-1` | Darkest text gray | Very dark | Very light |
| `--sl-color-gray-2` | Text color source | Dark | Light |
| `--sl-color-gray-3` | Muted text | Medium-dark | Medium-light |
| `--sl-color-gray-4` | Borders, subtle | Medium-light | Medium-dark |
| `--sl-color-gray-5` | Subtle backgrounds | Light | Dark |
| `--sl-color-gray-6` | Lightest bg gray | Very light | Very dark |

The gray scale (1-6) runs from **text-weight to background-weight**, regardless of actual lightness in a given mode.

## CSS Layer Architecture

Starlight wraps all its styles in `@layer starlight.base`. Per CSS spec, unlayered styles always take precedence over layered styles. This has two important consequences:

1. Your custom CSS (unlayered) will **automatically override** Starlight's defaults
2. You **MUST define values for BOTH modes** explicitly, or your dark-mode values bleed into light mode

:::caution
If you only define `:root` (dark mode) custom properties, light mode will inherit those same values. This typically results in white text on a white background — unreadable.
:::

## Complete Theme Example

```css
/* src/styles/custom.css */

/* :root = dark mode defaults (Starlight's default theme is dark) */
:root {
  --sl-color-white: #ffffff;
  --sl-color-black: #1a1a2e;
  --sl-color-gray-1: #e0e0e0;
  --sl-color-gray-2: #c0c0c0;
  --sl-color-gray-3: #a0a0a0;
  --sl-color-gray-4: #606060;
  --sl-color-gray-5: #383838;
  --sl-color-gray-6: #272730;

  --sl-color-accent-low: #1a1a4e;
  --sl-color-accent: #6c63ff;
  --sl-color-accent-high: #c4c1ff;
}

/* MUST define light mode separately */
:root[data-theme='light'] {
  --sl-color-white: #1a1a2e;
  --sl-color-black: #ffffff;
  --sl-color-gray-1: #2a2a3e;
  --sl-color-gray-2: #444466;
  --sl-color-gray-3: #666688;
  --sl-color-gray-4: #9999aa;
  --sl-color-gray-5: #ccccdd;
  --sl-color-gray-6: #f0f0f5;

  --sl-color-accent-low: #e8e7ff;
  --sl-color-accent: #5046e5;
  --sl-color-accent-high: #2d2691;
}
```

## Accent Color Triplet

The accent color has three variants whose "direction" flips between modes:

| Variable | Purpose | Dark Mode | Light Mode |
|----------|---------|-----------|------------|
| `--sl-color-accent-low` | Background tint (subtle highlight) | Dark shade | Light tint |
| `--sl-color-accent` | The accent color itself | Bright/vivid | Medium |
| `--sl-color-accent-high` | Text-safe variant (readable on bg) | Light/pastel | Dark/saturated |

The direction flip ensures contrast: `accent-low` is always a subtle background, and `accent-high` is always readable as text on top of `accent-low`.

## Key Variable Reference

Understanding which derived variables control which UI elements:

```css
/* Text & Background */
--sl-color-text            /* Derived from --sl-color-gray-2 */
--sl-color-text-accent     /* Links and interactive text */
--sl-color-bg              /* = --sl-color-black (the "background" semantic) */

/* Navigation */
--sl-color-bg-nav          /* Top navigation bar background */
--sl-color-bg-sidebar      /* Sidebar background */
--sl-color-hairline-light  /* Border/divider color */

/* Active states */
/* Active nav link text uses --sl-color-white (the "foreground" semantic) */
/* Sidebar active link background uses --sl-color-accent-low */
/* Sidebar active link text uses --sl-color-accent-high */
```

## Common Theming Mistakes

:::note[Checklist]
Before deploying a custom theme, verify:
1. Toggle between dark and light mode — both should be readable
2. Check sidebar active states — text should contrast with highlight background
3. Verify inline code and code blocks are legible in both modes
4. Test the search modal in both modes
:::

### Mistake 1: Only Defining Dark Mode

```css
/* BAD: Only defines :root (dark mode) */
:root {
  --sl-color-white: #ffffff;
  --sl-color-black: #0a0a1a;
}
/* Light mode inherits these values → white text on dark background,
   but Starlight's light mode expects the inverse! */
```

### Mistake 2: Using Literal Color Names Mentally

```css
/* This looks wrong but IS correct for light mode: */
:root[data-theme='light'] {
  --sl-color-white: #1a1a2e;  /* "white" = foreground = dark text in light mode */
  --sl-color-black: #ffffff;  /* "black" = background = white in light mode */
}
```

### Mistake 3: Partial Overrides

Since unlayered CSS always beats `@layer starlight.base`, defining only _some_ variables can leave others at Starlight's defaults, creating mismatched contrast ratios.

**Rule**: If you override any color variable, override the full set for both modes.

## Reusable Theme Package Pattern

For organizations needing consistent theming across multiple Starlight sites, create a shared npm package:

### Package Structure

```
@org/astro-theme/
  src/
    styles/
      theme.css          # CSS custom properties for both modes
    preset.js            # Config helper function
  package.json
```

### Preset Helper (`src/preset.js`)

```javascript
// Merges theme CSS and head elements with user's Starlight config
export function starlightPreset(userConfig = {}) {
  return {
    ...userConfig,
    customCss: [
      '@org/astro-theme/styles/theme.css',
      ...(userConfig.customCss || []),
    ],
    head: [
      ...(userConfig.head || []),
      // Add org-wide head elements here (fonts, analytics, etc.)
    ],
  };
}
```

### Package.json

```json
{
  "name": "@org/astro-theme",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./styles/theme.css": "./src/styles/theme.css",
    "./preset": "./src/preset.js"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "files": ["src/"]
}
```

### Consuming the Theme

1. Add `.npmrc` to consuming project:

```ini
@org:registry=https://npm.pkg.github.com
```

2. Use in `astro.config.mjs`:

```javascript
import { starlightPreset } from '@org/astro-theme/preset';

export default defineConfig({
  integrations: [
    starlight(starlightPreset({
      title: 'My Docs',
      sidebar: [/* ... */],
    })),
  ],
});
```

The preset merges theme CSS before user CSS (so user CSS can override), and concatenates head elements rather than replacing them.

## Version Compatibility

- **Social config format**: Starlight v0.31 uses object format `{ github: 'url' }`, v0.37+ uses array format `[{ icon: 'github', label: 'GitHub', href: 'url' }]`
- **Upgrade command**: `npx @astrojs/upgrade` updates Astro and all official integrations together
