// The industrial protocol stack registry (src/data/ecosystem.json): every known
// implementation of the protocols OT Fabric covers, with its source and the date
// it was verified. It drives the landscape blog post and the /ecosystem/ map.
import registry from './ecosystem.json';

export type ImplType = 'independent' | 'derived' | 'commercial' | 'legacy';

export interface Release {
	version: string;
	date?: string;
	source: string;
	url?: string;
}

export interface Implementation {
	id: string;
	name: string;
	protocol: string;
	type: ImplType;
	languages: string[];
	license: string;
	/** A commercial licence is offered next to the open-source one. */
	commercialLicense?: boolean;
	url?: string;
	repo?: string;
	stars: number | null;
	forks?: number;
	repoCreated?: string;
	historySince?: string;
	lastCommit?: string;
	release: Release | null;
	prerelease?: Omit<Release, 'url'>;
	roles?: string[];
	capabilities?: string[];
	upstream?: string[];
	relation?: string;
	/** Name of the OT Fabric interop suite that runs this implementation. */
	interop?: string;
	maintenance?: string;
	emerging?: boolean;
	otfabric?: boolean;
	package?: string;
	notes?: string;
	sources: string[];
	verified: string;
}

export interface ProtocolSummary {
	id: string;
	name: string;
	standard: string;
	focus: string;
	maturity: string;
	commercial: string;
	summary: string;
}

export const ecosystem = registry as {
	title: string;
	verified: string;
	notes: string[];
	protocols: ProtocolSummary[];
	implementations: Implementation[];
};

export const implementations = ecosystem.implementations;
export const ecosystemProtocols = ecosystem.protocols;

export const byProtocol = (protocol: string) => implementations.filter((i) => i.protocol === protocol);
export const byId = (id: string) => implementations.find((i) => i.id === id);

export const typeLabels: Record<ImplType, string> = {
	independent: 'Independent stacks',
	derived: 'Derived libraries and bindings',
	commercial: 'Commercial SDKs',
	legacy: 'Legacy and reference',
};
export const typeOrder: ImplType[] = ['independent', 'derived', 'commercial', 'legacy'];

export const maintenanceLabels: Record<string, string> = {
	active: 'Active',
	slowing: 'Slowing',
	quiet: 'Quiet',
	archived: 'Archived',
	deprecated: 'Deprecated',
	discontinued: 'Discontinued',
	'n/a': 'Vendor product',
};

/** Coarse licence family, used for filtering. The SPDX string stays the source of truth. */
export function licenseFamily(license: string) {
	if (license === 'Commercial') return 'Commercial';
	if (/WITH|LGPL|MPL|EPL/.test(license)) return 'Weak copyleft';
	if (/GPL/.test(license)) return 'Copyleft';
	return 'Permissive';
}

export const interopUrl = (suite: string) => `https://github.com/otfabric/${suite}`;

export const formatMonth = (date?: string) =>
	date
		? new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
		: undefined;

export const formatDay = (date?: string) =>
	date
		? new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
		: undefined;

export const formatCount = (n: number | null | undefined) =>
	n == null ? '–' : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

export const stats = {
	implementations: implementations.length,
	protocols: ecosystemProtocols.length,
	languages: new Set(
		implementations.flatMap((i) => i.languages.flatMap((l) => l.split('/').map((s) => s.replace(/\(.*\)/, '').trim()))),
	).size,
	openSource: implementations.filter((i) => i.type !== 'commercial').length,
	commercial: implementations.filter((i) => i.type === 'commercial').length,
	interop: implementations.filter((i) => i.interop && !i.otfabric).length,
};
