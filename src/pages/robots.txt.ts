import { site } from '../data/site';

// Everything is public. AI crawlers are named explicitly so it is clear they are welcome:
// being read and cited by AI search is part of how people find OT Fabric.
const aiCrawlers = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-SearchBot',
	'Claude-User',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot-Extended',
	'Bingbot',
	'CCBot',
];

export function GET() {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		...aiCrawlers.map((bot) => `User-agent: ${bot}`),
		'Allow: /',
		'',
		`Sitemap: ${site.url}/sitemap-index.xml`,
		'',
	].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
