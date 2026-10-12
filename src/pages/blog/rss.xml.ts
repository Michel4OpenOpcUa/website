import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../data/blog';
import { site } from '../../data/site';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	return rss({
		title: 'OT Fabric blog',
		description: site.description,
		site: context.site ?? site.url,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
	});
}
