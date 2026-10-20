import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const protocolIds = ['modbus', 'opc-ua', 'bacnet', 'iec-104', 'iec-61850', 's7', 'sunspec', 'openadr', 'ocpp', 'dnp3'] as const;

export const collections = {
	// Documentation, rendered by Starlight under /docs/.
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	// Protocol landing pages at /protocols/<id>/.
	protocols: defineCollection({
		loader: glob({ pattern: '*.mdx', base: './src/content/protocols' }),
		schema: z.object({
			name: z.string(),
			standard: z.string(),
			summary: z.string(),
			order: z.number(),
			facts: z.array(z.object({ label: z.string(), value: z.string() })),
			icon: z.string().optional(),
			docs: z.string().optional(),
		}),
	}),

	// Projects (libraries, tools, suites, planned work) at /projects/.
	projects: defineCollection({
		loader: file('./src/data/projects.json'),
		schema: z.object({
			name: z.string(),
			category: z.enum(['library', 'cli', 'transport', 'discovery', 'interop', 'ui', 'mcp', 'gateway']),
			description: z.string(),
			protocols: z.array(z.enum(protocolIds)),
			status: z.enum(['available', 'planned']),
			repo: z.string().optional(),
			install: z.string().optional(),
			icon: z.string().optional(),
			// Short feature list shown on the project page.
			highlights: z.array(z.string()).optional(),
		}),
	}),

	// Blog posts at /blog/<id>/.
	blog: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				date: z.coerce.date(),
				updated: z.coerce.date().optional(),
				authors: z.array(z.string()).default(['OT Fabric']),
				tags: z.array(z.string()).default([]),
				cover: z.object({ image: image(), alt: z.string() }).optional(),
				featured: z.boolean().default(false),
				draft: z.boolean().default(false),
			}),
	}),
};
