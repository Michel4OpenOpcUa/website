// Radial layout for the ecosystem map: the protocol in the middle, one branch per
// implementation type, one leaf per implementation. Computed at build time so the
// map renders without JavaScript.
import { byProtocol, typeOrder, type Implementation, type ImplType } from './ecosystem';

export const W = 1120;
export const H = 800;
const CX = W / 2;
const CY = H / 2;
export const RX = 290; // leaf ellipse
export const RY = 300;
export const HUB = 0.52; // hub distance as a fraction of the leaf ellipse
export const ELBOW = 0.8; // where branches turn from the hub towards their leaves

export interface Leaf {
	impl: Implementation;
	x: number;
	y: number;
	angle: number;
	side: 'left' | 'right';
	path: string;
}
export interface Hub {
	type: ImplType;
	count: number;
	x: number;
	y: number;
}
export interface Link {
	from: string;
	to: string;
	path: string;
}

const polar = (angle: number, f = 1) => ({ x: CX + Math.cos(angle) * RX * f, y: CY + Math.sin(angle) * RY * f });
const r = (n: number) => Math.round(n * 10) / 10;

export function layout(protocol: string) {
	const impls = byProtocol(protocol);
	const groups = typeOrder
		.map((type) => ({ type, items: impls.filter((i) => i.type === type) }))
		.filter((g) => g.items.length > 0);
	// Each branch gets a share of the circle proportional to its size, plus a gap.
	const gap = 0.9;
	const total = groups.reduce((n, g) => n + g.items.length + gap, 0);
	const step = (Math.PI * 2) / total;
	// The first (largest) branch, independent stacks, faces right.
	let angle = (-(groups[0].items.length - 1) * step) / 2;

	const hubs: Hub[] = [];
	const leaves: Leaf[] = [];
	for (const group of groups) {
		const span = group.items.length * step;
		const mid = angle + span / 2 - step / 2;
		const hub = polar(mid, HUB);
		hubs.push({ type: group.type, count: group.items.length, x: r(hub.x), y: r(hub.y) });
		group.items.forEach((impl, i) => {
			const a = angle + i * step;
			const p = polar(a);
			const e1 = polar(mid, ELBOW);
			const e2 = polar(a, ELBOW);
			// Radial dendrogram: out from the hub, along the elbow ring, then out to the leaf.
			const sweep = a > mid ? 1 : 0;
			const large = Math.abs(a - mid) > Math.PI ? 1 : 0;
			const arc = Math.abs(a - mid) < 1e-6 ? '' : ` A${r(RX * ELBOW)} ${r(RY * ELBOW)} 0 ${large} ${sweep} ${r(e2.x)} ${r(e2.y)}`;
			leaves.push({
				impl,
				x: r(p.x),
				y: r(p.y),
				angle: a,
				side: Math.cos(a) < -0.02 ? 'left' : 'right',
				path: `M${r(hub.x)} ${r(hub.y)} L${r(e1.x)} ${r(e1.y)}${arc} L${r(p.x)} ${r(p.y)}`,
			});
		});
		angle += span + gap * step;
	}

	// Upstream relationships between implementations of the same protocol, bent towards the centre.
	const at = new Map(leaves.map((l) => [l.impl.id, l]));
	const links: Link[] = [];
	for (const leaf of leaves) {
		for (const up of leaf.impl.upstream ?? []) {
			const target = at.get(up);
			if (!target) continue;
			const mx = (leaf.x + target.x) / 2;
			const my = (leaf.y + target.y) / 2;
			const cx = CX + (mx - CX) * 0.35;
			const cy = CY + (my - CY) * 0.35;
			links.push({ from: leaf.impl.id, to: up, path: `M${leaf.x} ${leaf.y} Q${r(cx)} ${r(cy)} ${target.x} ${target.y}` });
		}
	}
	return { cx: CX, cy: CY, hubs, leaves, links };
}
