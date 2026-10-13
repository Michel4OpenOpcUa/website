import { render } from 'astro:content';
import { getPosts } from '../data/blog';
import { docsUrl, getDocs, mdxToMarkdown } from '../data/llms';
import { getProtocols, projectsFor, repoUrl } from '../data/projects';
import { longDescription } from '../data/seo';
import { site } from '../data/site';
import about from './about.mdx?raw';

// Every page's text in one file, each section headed by its title and canonical URL.
export async function GET() {
	const section = (title: string, url: string, description: string | undefined, body: string) =>
		[`# ${title}`, `URL: ${url}`, description ? `> ${description}` : '', body].filter(Boolean).join('\n\n');

	const protocols = await Promise.all(
		(await getProtocols()).map(async (p) => {
			const facts = p.data.facts.map((f) => `- ${f.label}: ${f.value}`).join('\n');
			const projects = (await projectsFor(p.id)).map((x) => `- ${x.data.name}: ${x.data.description} (${repoUrl(x.data.repo!)})`).join('\n');
			const body = [`Standard: ${p.data.standard}`, facts, mdxToMarkdown(p.body ?? ''), `## OT Fabric projects for ${p.data.name}`, projects].join('\n\n');
			return section(p.data.name, `${site.url}/protocols/${p.id}/`, p.data.summary, body);
		}),
	);
	const docs = (await getDocs()).map((d) => section(d.data.title, docsUrl(d.id), d.data.description, mdxToMarkdown(d.body ?? '')));
	const posts = (await getPosts()).map((p) =>
		section(p.data.title, `${site.url}/blog/${p.id}/`, p.data.description, `Published: ${p.data.date.toISOString().slice(0, 10)}\n\n${mdxToMarkdown(p.body ?? '')}`),
	);
	const aboutPage = section('About OT Fabric', `${site.url}/about/`, undefined, mdxToMarkdown(about));

	const text = [`# ${site.name}\n\n> ${longDescription}`, aboutPage, ...protocols, ...docs, ...posts].join('\n\n---\n\n') + '\n';
	return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
