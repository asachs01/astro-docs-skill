// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://asachs01.github.io',
	base: '/astro-docs-skill',
	integrations: [
		starlight({
			title: 'Astro Docs Skill',
			description: 'Claude Code skill for scaffolding and developing Astro projects with correct v5 patterns.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/asachs01/astro-docs-skill' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Project Scaffolding', slug: 'guides/project-scaffolding' },
						{ label: 'Components & Pages', slug: 'guides/components' },
						{ label: 'Content Collections', slug: 'guides/content-collections' },
						{ label: 'Starlight Docs Sites', slug: 'guides/starlight' },
						{ label: 'Starlight Theming', slug: 'guides/starlight-theming' },
						{ label: 'Islands & Interactivity', slug: 'guides/islands' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Project Structure', slug: 'reference/project-structure' },
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Directives', slug: 'reference/directives' },
						{ label: 'Common Patterns', slug: 'reference/patterns' },
					],
				},
			],
		}),
	],
});
