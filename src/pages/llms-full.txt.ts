import { getPosts } from '../data/blog';
import { docSection, getDocs, mdxToMarkdown, postSection, projectSection, protocolSection } from '../data/llms';
import { getProjects, getProtocols } from '../data/projects';
import { longDescription } from '../data/seo';
import { site } from '../data/site';
import about from './about.mdx?raw';

// Every page's text in one file, each section headed by its title and canonical URL.
export async function GET() {
	const protocols = await Promise.all((await getProtocols()).map(protocolSection));
	const docs = await getDocs();
	const projects = (await getProjects()).filter((p) => p.data.status === 'available').map(projectSection);
	const posts = (await getPosts()).map(postSection);
	const aboutPage = [`# About OT Fabric`, `URL: ${site.url}/about/`, mdxToMarkdown(about)].join('\n\n');

	const text =
		[`# ${site.name}\n\n> ${longDescription}`, aboutPage, ...protocols, ...docs.map((d) => docSection(d, docs)), ...projects, ...posts].join('\n\n---\n\n') + '\n';
	return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
