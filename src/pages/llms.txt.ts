import { llmsIndex } from '../data/llms';

export async function GET() {
	return new Response(await llmsIndex(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
