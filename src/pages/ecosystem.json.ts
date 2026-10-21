import { ecosystem } from '../data/ecosystem';

// The registry behind /ecosystem/, served as-is so tools, crawlers and AI agents
// can read the data without scraping the map.
export function GET() {
	return new Response(JSON.stringify(ecosystem, null, '\t'), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
