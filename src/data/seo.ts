// Search and AI-engine metadata shared by the website layout and the docs head:
// the default social image and schema.org JSON-LD builders.
import { people, site } from './site';

/** Default Open Graph / Twitter image (public/og-image.png). */
export const ogImage = {
	src: '/og-image.png',
	width: 1200,
	height: 630,
	alt: 'OT Fabric: unified data for industrial operations. Open-source protocol libraries and tools for Modbus, SunSpec, OPC UA, BACnet/IP, IEC 104, IEC 61850, Siemens S7 and OpenADR.',
};

/** Meta description for the homepage: what OT Fabric is, with the protocols people search for. */
export const homeDescription =
	'Open-source protocol libraries, CLIs and interoperability suites for Modbus, SunSpec, OPC UA, BACnet, IEC 104, IEC 61850, Siemens S7, OpenADR and OCPP.';

/** Longer description for the homepage and machine-readable summaries. */
export const longDescription =
	'OT Fabric builds open-source, MIT-licensed protocol libraries, command-line tools and interoperability test suites for industrial (OT) devices: Modbus, SunSpec, OPC UA, BACnet/IP, IEC 60870-5-104, IEC 61850 / MMS, Siemens S7, OpenADR and OCPP. Built by people and AI agents together.';

export const absolute = (path: string) => new URL(path, site.url).href;

const orgId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export const organization = {
	'@type': 'Organization',
	'@id': orgId,
	name: site.name,
	url: `${site.url}/`,
	logo: { '@type': 'ImageObject', url: absolute('/favicon.svg') },
	image: absolute(ogImage.src),
	description: longDescription,
	email: site.email,
	sameAs: [site.github, site.linkedin],
	contactPoint: { '@type': 'ContactPoint', contactType: 'general inquiries', email: site.email, url: `${site.url}/contact/` },
	founder: people.map((p) => ({
		'@type': 'Person',
		name: p.name,
		jobTitle: p.role,
		email: p.email,
		sameAs: [p.linkedin, p.github],
	})),
	knowsAbout: [
		'Operational technology (OT)',
		'Industrial automation',
		'Industrial interoperability',
		'Modbus',
		'SunSpec',
		'OPC UA',
		'BACnet',
		'IEC 60870-5-104',
		'IEC 61850',
		'Siemens S7',
		'OpenADR',
		'OCPP',
		'Model Context Protocol',
	],
};

export const website = {
	'@type': 'WebSite',
	'@id': websiteId,
	name: site.name,
	url: `${site.url}/`,
	description: site.description,
	inLanguage: 'en',
	publisher: { '@id': orgId },
};

export const orgRef = { '@id': orgId };
export const websiteRef = { '@id': websiteId };

export type Crumb = { name: string; path: string };

export const breadcrumbs = (crumbs: Crumb[]) => ({
	'@type': 'BreadcrumbList',
	itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name: crumb.name,
		item: absolute(crumb.path),
	})),
});

/** Wrap one or more nodes in a JSON-LD graph, safe to inline in a <script> tag. */
export const jsonLd = (...nodes: object[]) =>
	JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
