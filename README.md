# otfabric.io

Source for [otfabric.io](https://otfabric.io), the website of [OT Fabric](https://github.com/otfabric): open-source protocol libraries and tools for industrial data, built by people and AI agents together.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), styled with Tailwind CSS, and deployed to Cloudflare as static assets.

## Develop

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in ./dist
npm run preview   # serve ./dist locally
```

## How the site is organised

The website pages are plain Astro; the documentation under `/docs/` is Starlight. Both share the same brand tokens and navigation.

| URL | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about/` | `src/pages/about.mdx` |
| `/protocols/`, `/protocols/<id>/` | `src/content/protocols/*.mdx` (content collection) |
| `/projects/`, `/projects/<id>/` | `src/data/projects.json` (content collection) |
| `/blog/`, `/blog/<id>/`, `/blog/tags/<tag>/`, `/blog/rss.xml` | `src/content/blog/*.{md,mdx}` (content collection) |
| `/docs/...` | `src/content/docs/docs/` (Starlight) |

Shared pieces:

| Path | What |
|---|---|
| `src/layouts/BaseLayout.astro` | Layout for every non-docs page |
| `src/components/site/` | Header, footer, logo, navigation, theme toggle |
| `src/components/overrides/` | Starlight header and mobile menu, using the same navigation |
| `src/data/site.ts` | Navigation links |
| `src/styles/tokens.css` | Brand colours and fonts, used by both sides |
| `src/styles/site.css`, `src/styles/global.css` | Website styles, Starlight theme |

## Adding a project

Add an entry to `src/data/projects.json`. Only public repositories in github.com/otfabric go in as `available`; roadmap items are `planned` and have no `repo`.

## License

MIT
