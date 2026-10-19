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
const STAGGER = 1.13; // outer ring for alternating leaves near the poles of crowded maps

export interface Leaf {
	impl: Implementation;
	x: number;
	y: number;
	angle: number;
	side: 'left' | 'right';
	path: string;
	/** Label anchor: at the leaf, or moved along the ellipse to keep labels apart. */
	lx: number;
	ly: number;
	/** Leader line from the leaf to a moved label, or undefined. */
	leader?: string;
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

const LABEL_GAP = 36; // two text lines
const LABEL_MARGIN = 24;

// Labels sit beside their leaf. Where leaves crowd (near the top and bottom of the
// ellipse, or in a large branch), labels are pushed apart vertically, away from the
// horizontal axis, and slid along the ellipse, with a leader line back to the leaf.
// Working outwards from the axis, the leaf nearer a pole always gets the label
// further out, so no label runs over the next leaf.
function placeLabels(leaves: Leaf[]) {
	const fromAxis = (l: Leaf) => Math.abs(Math.asin(Math.max(-1, Math.min(1, Math.sin(l.angle)))));
	for (const side of ['left', 'right'] as const) {
		for (const up of [true, false]) {
			const dir = up ? -1 : 1;
			const group = leaves
				.filter((l) => l.side === side && Math.sin(l.angle) < 0 === up)
				.sort((a, b) => fromAxis(a) - fromAxis(b));
			// Distance of each label from the horizontal axis, kept LABEL_GAP apart.
			const ds = group.map((l) => (l.y - CY) * dir);
			for (let i = 1; i < ds.length; i++) ds[i] = Math.max(ds[i], ds[i - 1] + LABEL_GAP);
			const limit = CY - LABEL_MARGIN;
			const over = ds.length ? ds[ds.length - 1] - limit : 0;
			if (over > 0) {
				ds[ds.length - 1] = limit;
				for (let i = ds.length - 2; i >= 0; i--) ds[i] = Math.min(ds[i], ds[i + 1] - LABEL_GAP);
			}
			group.forEach((l, i) => {
				const ly = CY + ds[i] * dir;
				if (Math.abs(ly - l.y) < 1) {
					l.lx = side === 'right' ? l.x + 18 : l.x - 18;
					l.ly = l.y;
					return;
				}
				const t = Math.min(1, Math.abs(ly - CY) / RY);
				const edge = RX * Math.sqrt(1 - t * t);
				const ex = side === 'right' ? Math.max(l.x, CX + edge) : Math.min(l.x, CX - edge);
				l.lx = r(side === 'right' ? ex + 18 : ex - 18);
				l.ly = r(ly);
				l.leader = `M${l.x} ${l.y} L${r(side === 'right' ? ex + 12 : ex - 12)} ${r(ly)}`;
			});
		}
	}
}

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
			// In a crowded map, leaves near the top and bottom of the ellipse alternate
			// between two rings, so their labels do not run into each other near the poles.
			const p = polar(a, step < 0.3 && Math.abs(Math.cos(a)) < 0.6 && i % 2 === 1 ? STAGGER : 1);
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
				lx: 0,
				ly: 0,
				path: `M${r(hub.x)} ${r(hub.y)} L${r(e1.x)} ${r(e1.y)}${arc} L${r(p.x)} ${r(p.y)}`,
			});
		});
		angle += span + gap * step;
	}

	placeLabels(leaves);

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
