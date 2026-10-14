// Plain-text views of the site for LLMs and AI search (https://llmstxt.org/):
// /llms.txt is the index, /llms-full.txt carries the full text of every page.
import { getCollection } from 'astro:content';
import { getPosts } from './blog';
import { categories, getProjects, getProtocols, repoUrl } from './projects';
import { longDescription } from './seo';
import { site } from './site';

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

/** Turn MDX into readable Markdown: drop imports, unwrap components, make links absolute. */
export function mdxToMarkdown(source: string) {
	const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
	// Leave fenced code untouched; only rewrite the prose between fences.
	return body
		.split(/(^```[\s\S]*?^```)/m)
		.map((part, i) => (i % 2 ? part : rewriteProse(part)))
		.join('')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function rewriteProse(text: string) {
	return text
		.replace(/^(import|export) .*$/gm, '')
		.replace(/<LinkCard\b[^>]*\/>/g, (tag) => `- [${attr(tag, 'title')}](${attr(tag, 'href')}): ${attr(tag, 'description') ?? ''}`)
		.replace(/<Badge\b[^>]*\/>/g, (tag) => `(${attr(tag, 'text')})`)
		.replace(/<(Aside|Callout)\b[^>]*>/g, (tag) => `**${attr(tag, 'title') ?? capitalize(attr(tag, 'type') ?? 'note')}:**`)
		.replace(/<TabItem\b[^>]*>/g, (tag) => `**${attr(tag, 'label')}**`)
		.replace(/<(YouTube|Video)\b[^>]*\/>/g, '')
		.replace(/<\/?(Aside|Callout|Tabs|TabItem|Steps|CardGrid)\b[^>]*>/g, '')
		.replace(/^[ \t]+(?=\S)/gm, (indent) => indent.replace(/\t/g, '  '))
		.replace(/\]\((\/[^)]*)\)/g, (_, path) => `](${site.url}${path})`);
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const docsUrl = (id: string) => `${site.url}/${id}/`;

/** Docs pages in sidebar-friendly order: overview pages before their children. */
export async function getDocs() {
	const docs = await getCollection('docs', (doc) => doc.id !== '404');
	const rank = (id: string) => ['library', 'cli', 'testing'].indexOf(id.split('/').at(-1)!) + 1;
	return docs.sort((a, b) => {
		const pa = a.id.split('/').slice(0, 3).join('/');
		const pb = b.id.split('/').slice(0, 3).join('/');
		return pa === pb ? rank(a.id) - rank(b.id) : a.id.localeCompare(b.id);
	});
}

export async function llmsIndex() {
	const [protocols, projects, docs, posts] = await Promise.all([getProtocols(), getProjects(), getDocs(), getPosts()]);
	const available = projects.filter((p) => p.data.status === 'available');
	const planned = projects.filter((p) => p.data.status === 'planned');
	const line = (title: string, url: string, description?: string) =>
		`- [${title}](${url})${description ? `: ${description}` : ''}`;

	return [
		`# ${site.name}`,
		`> ${longDescription}`,
		[
			'OT Fabric is an open-source organization on GitHub (https://github.com/otfabric). For each operational technology (OT) protocol it publishes a library with client and server support, a command-line tool where field work needs one, and a Dockerized interoperability suite that tests the implementation against independent stacks. Everything is MIT-licensed unless a repository says otherwise.',
			'The roadmap covers every relevant OT protocol, IT-to-OT gateways and data connectors, and MCP servers so AI agents can work with industrial devices safely. The project is built by people and AI agents together: engineers set direction and own every decision, and public tests and interop suites hold every change to the same bar.',
		].join('\n\n'),
		'## Protocols',
		protocols.map((p) => line(p.data.standard.startsWith(p.data.name) ? p.data.name : `${p.data.name} (${p.data.standard})`, `${site.url}/protocols/${p.id}/`, p.data.summary)).join('\n'),
		'## Documentation',
		docs.map((d) => line(d.data.title, docsUrl(d.id), d.data.description)).join('\n'),
		'## Projects',
		categories
			.map((c) => ({ c, items: available.filter((p) => p.data.category === c.id) }))
			.filter(({ items }) => items.length)
			.map(({ c, items }) => `### ${c.label}\n\n${items.map((p) => line(p.data.name, `${site.url}/projects/${p.id}/`, `${p.data.description} Source: ${repoUrl(p.data.repo!)}`)).join('\n')}`)
			.join('\n\n'),
		...(posts.length
			? ['## Blog', posts.map((p) => line(p.data.title, `${site.url}/blog/${p.id}/`, p.data.description)).join('\n')]
			: []),
		'## Optional',
		[
			line('About OT Fabric', `${site.url}/about/`, 'Why OT Fabric exists, how it is built, and where it is heading.'),
			line('Contact', `${site.url}/contact/`, `Email ${site.email}, or reach the team on LinkedIn and GitHub.`),
			line('Full text for LLMs', `${site.url}/llms-full.txt`, 'Every protocol page, documentation page and blog post in one Markdown file.'),
			...planned.map((p) => line(`${p.data.name} (planned)`, `${site.url}/projects/`, p.data.description)),
		].join('\n'),
	].join('\n\n') + '\n';
}
