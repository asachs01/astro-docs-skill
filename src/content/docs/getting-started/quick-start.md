---
title: Quick Start
description: Get up and running with the Astro Docs skill in under a minute.
sidebar:
  order: 2
---

## Create a New Project

Just tell Claude Code what you want to build:

```
> Create a new Astro blog with content collections and a Tailwind theme
```

The skill will scaffold a complete project with the correct v5 patterns.

## Scaffold Components

Ask for specific Astro components:

```
> Create a responsive navigation component with mobile hamburger menu
```

```
> Scaffold a blog post layout with reading time and table of contents
```

## Set Up Content Collections

```
> Set up a content collection for my blog posts with title, date, tags, and author reference
```

The skill knows the Content Layer API and will generate the correct `content.config.ts` with Zod schemas.

## Common Requests

| Request | What the skill generates |
|---------|--------------------------|
| "Create an Astro blog" | Full project: config, layouts, pages, content collection, dynamic routes |
| "Add a docs site" | Starlight setup with sidebar, content structure, frontmatter |
| "Create a product page" | Component with props, TypeScript interface, scoped styles |
| "Add React interactivity" | Framework component with correct `client:` directive |
| "Set up i18n routing" | Config with locales, routing, and content structure |

## Live Docs Fallback

For APIs or features not covered by the embedded knowledge, the skill instructs Claude to fetch live documentation:

```
> How do I use the image() schema helper for content collections?
```

This triggers a lookup against `docs.astro.build` for the most current information.
