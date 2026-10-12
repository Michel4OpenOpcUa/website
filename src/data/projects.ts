// Helpers around the `projects` and `protocols` content collections.
// Project entries live in src/data/projects.json; protocol pages in src/content/protocols/.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Protocol = CollectionEntry<'protocols'>;
export type Category = Project['data']['category'];

export const categories: { id: Category; label: string; description: string }[] = [
	{ id: 'library', label: 'Protocol libraries', description: 'Pure Go clients and servers. No cgo.' },
	{ id: 'cli', label: 'CLI tools', description: 'Command-line tools to discover, read, write and diagnose devices.' },
	{ id: 'transport', label: 'Building blocks', description: 'Transport layers shared by the protocol libraries.' },
	{ id: 'discovery', label: 'Discovery', description: 'Find out what is actually running on a network.' },
	{ id: 'interop', label: 'Interop suites', description: 'Dockerized reference stacks that test implementations against each other.' },
	{ id: 'ui', label: 'UI apps', description: 'Graphical applications built on the libraries.' },
	{ id: 'mcp', label: 'MCP servers', description: 'Let AI agents work with industrial devices through the Model Context Protocol.' },
	{ id: 'gateway', label: 'Gateways and connectors', description: 'Move OT data into IT, cloud and analytics systems.' },
];

export const repoUrl = (repo: string) => `https://github.com/otfabric/${repo}`;

export async function getProjects() {
	const order = categories.map((c) => c.id);
	const all = await getCollection('projects');
	return all.sort((a, b) => order.indexOf(a.data.category) - order.indexOf(b.data.category));
}

export async function getProtocols() {
	return (await getCollection('protocols')).sort((a, b) => a.data.order - b.data.order);
}

/** Projects that carry this protocol, available ones first in catalog order. */
export async function projectsFor(protocol: string) {
	return (await getProjects()).filter((p) => p.data.status === 'available' && p.data.protocols.includes(protocol as never));
}
