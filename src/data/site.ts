// Navigation and site-wide settings shared by the website layout and the docs header.

export const site = {
	name: 'OT Fabric',
	url: 'https://otfabric.io',
	github: 'https://github.com/otfabric',
	linkedin: 'https://www.linkedin.com/company/otfabric',
	email: 'admin@otfabric.io',
	description:
		'Open-source protocol libraries and tools that break down OT data silos, built by people and AI agents together.',
};

export const nav = [
	{ label: 'Docs', href: '/docs/' },
	{ label: 'Protocols', href: '/protocols/' },
	{ label: 'Projects', href: '/projects/' },
	{ label: 'Ecosystem', href: '/ecosystem/' },
	{ label: 'Blog', href: '/blog/' },
	{ label: 'About', href: '/about/' },
	{ label: 'Contact', href: '/contact/' },
];

/** People behind OT Fabric, shown on the contact page. */
export const people = [
	{
		name: 'Bart Van Bos',
		role: 'Founder',
		email: 'bartvanbos@otfabric.io',
		linkedin: 'https://www.linkedin.com/in/bartvanbos',
		github: 'https://github.com/boeboe',
	},
];

export const isActive = (pathname: string, href: string) =>
	pathname === href || pathname.startsWith(href);
