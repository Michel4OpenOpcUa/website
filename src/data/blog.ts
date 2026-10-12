import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts show only in `astro dev`. */
export async function getPosts() {
	const posts = await getCollection('blog', (post) => import.meta.env.DEV || !post.data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTags() {
	const counts = new Map<string, number>();
	for (const post of await getPosts()) {
		for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export const formatDate = (date: Date) =>
	date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Rough reading time in minutes from the raw Markdown body. */
export const readingTime = (post: Post) => Math.max(1, Math.round((post.body ?? '').split(/\s+/).length / 220));
