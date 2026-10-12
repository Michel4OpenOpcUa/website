// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const site = 'https://otfabric.io';
const description =
  'Open-source protocol libraries and tools that break down OT data silos, built by people and AI agents together.';

export default defineConfig({
  site,

  integrations: [
    starlight({
      title: 'OT Fabric',
      description,
      // Same mark as the website header (src/components/site/Logo.astro).
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      favicon: '/favicon.svg',
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#17212B' } },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/otfabric',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/otfabric/website/edit/main/',
      },
      components: {
        Header: './src/components/overrides/Header.astro',
        MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Documentation', slug: 'docs' },
            { label: 'Getting started', slug: 'docs/getting-started' },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'How to contribute', slug: 'docs/contributing' },
            { label: 'Writing blog posts', slug: 'docs/contributing/blog-posts' },
          ],
        },
      ],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: {
          codeFontFamily: "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace",
          borderRadius: '0.25rem',
        },
      },
      customCss: ['./src/styles/global.css'],
    }),

    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
