import type { APIRoute, GetStaticPaths } from 'astro';
import { protocolBundle } from '../../data/llms';
import { getProtocols, type Protocol } from '../../data/projects';

// /llms/<protocol>.txt: one protocol's pages in one file, small enough for an LLM's context.
export const getStaticPaths = (async () =>
	(await getProtocols()).map((protocol) => ({ params: { protocol: protocol.id }, props: { protocol } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
	new Response(await protocolBundle((props as { protocol: Protocol }).protocol), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
