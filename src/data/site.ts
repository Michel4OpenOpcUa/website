// Navigation and site-wide settings shared by the website layout and the docs header.

export const site = {
	name: 'OT Fabric',
	url: 'https://otfabric.io',
	github: 'https://github.com/otfabric',
	description:
		'Open-source protocol libraries and tools that break down OT data silos, built by people and AI agents together.',
};

export const nav = [
	{ label: 'Docs', href: '/docs/' },
	{ label: 'Protocols', href: '/protocols/' },
	{ label: 'Projects', href: '/projects/' },
	{ label: 'Blog', href: '/blog/' },
	{ label: 'About', href: '/about/' },
];

export const isActive = (pathname: string, href: string) =>
	pathname === href || pathname.startsWith(href);
