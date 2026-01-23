---
title: Installation
description: How to install the Astro Docs skill for Claude Code.
sidebar:
  order: 1
---

## Prerequisites

- [Claude Code](https://claude.com/claude-code) CLI installed and configured
- A `~/.claude/skills/` directory (created automatically by Claude Code)

## Install the Skill

Clone or copy the skill into your Claude Code skills directory:

```bash
# Clone from GitHub
git clone https://github.com/asachs01/astro-docs-skill.git ~/.claude/skills/astro-docs
```

Or manually create the skill file:

```bash
mkdir -p ~/.claude/skills/astro-docs
# Copy SKILL.md into the directory
```

## Verify Installation

The skill is auto-discovered by Claude Code. No registration step is needed — placing the `SKILL.md` file in the correct directory is the installation.

You can verify it's active by asking Claude Code about Astro:

```
> How do I create a new Astro blog?
```

Or explicitly invoke the skill:

```
> /astro-docs
```

## How It Works

Claude Code skills are markdown files that provide domain-specific knowledge and patterns. The `astro-docs` skill:

1. **Auto-activates** when it detects `.astro` files, `astro.config.*`, or Astro-related questions
2. **Provides embedded knowledge** about Astro v5 patterns, syntax, and best practices
3. **Falls back to live docs** for edge cases by fetching from `docs.astro.build`

## Requirements for Astro Projects

When scaffolding Astro projects, you'll need:

- **Node.js** v18.20.8+, v20.3.0+, or v22.0.0+ (v19/v21 not supported)
- **npm**, **pnpm**, or **yarn** as package manager
