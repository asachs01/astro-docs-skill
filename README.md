# Astro Docs Skill

A Claude Code skill for scaffolding and developing Astro projects with correct v5 patterns.

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## What It Does

This skill auto-activates when working with Astro projects and provides:

- **Project scaffolding** — Create complete Astro projects (blogs, docs, e-commerce, portfolios, landing pages)
- **Component patterns** — Scaffold components, pages, layouts, and islands with correct TypeScript patterns
- **Content Layer API** — Set up content collections with `glob()`/`file()` loaders and Zod schemas
- **Starlight docs** — Full support for documentation site scaffolding
- **Live docs fallback** — Fetches from `docs.astro.build` for edge cases

## Installation

Copy the skill into your Claude Code skills directory:

```bash
git clone https://github.com/asachs01/astro-docs-skill.git ~/.claude/skills/astro-docs
```

Or just copy the `SKILL.md` file:

```bash
mkdir -p ~/.claude/skills/astro-docs
cp SKILL.md ~/.claude/skills/astro-docs/
```

## Trigger Conditions

The skill auto-activates when:

- Working directory contains `.astro` files or `astro.config.*`
- You ask to create a new Astro project or site
- You mention "Astro", "Starlight", or "astro components"
- You ask about content collections, view transitions, or islands

## Documentation Site

This repo also contains a Starlight documentation site with full reference material.

### Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |

## Skill File

The actual Claude Code skill is the `SKILL.md` file at the root of `~/.claude/skills/astro-docs/`. The rest of this repo is the documentation site.

## License

MIT
