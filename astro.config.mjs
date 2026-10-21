// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

const site = 'https://otfabric.io';

// Last-modified dates for the sitemap, where the content records one: blog posts
// (updated, else date) and the ecosystem map (the registry's verification date).
const lastmod = new Map();
for (const file of readdirSync('./src/content/blog')) {
  const frontmatter = readFileSync(`./src/content/blog/${file}`, 'utf8').split('\n---')[0];
  const date = (frontmatter.match(/^updated:\s*(\S+)/m) ?? frontmatter.match(/^date:\s*(\S+)/m))?.[1];
  if (date) lastmod.set(`${site}/blog/${file.replace(/\.mdx?$/, '')}/`, date);
}
lastmod.set(`${site}/ecosystem/`, JSON.parse(readFileSync('./src/data/ecosystem.json', 'utf8')).verified);
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
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/company/otfabric',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/otfabric/website/edit/main/',
      },
      components: {
        Head: './src/components/overrides/Head.astro',
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
          label: 'Protocols',
          items: [
            { label: 'Overview', slug: 'docs/protocols' },
            { label: 'Modbus', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/modbus' } }] },
            { label: 'SunSpec', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/sunspec' } }] },
            { label: 'OPC UA', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/opc-ua' } }] },
            { label: 'BACnet/IP', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/bacnet' } }] },
            { label: 'IEC 60870-5-104', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/iec-104' } }] },
            { label: 'IEC 61850 / MMS', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/iec-61850' } }] },
            { label: 'Siemens S7', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/s7' } }] },
            { label: 'OpenADR', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/openadr' } }] },
            { label: 'OCPP', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/ocpp' } }] },
            { label: 'DNP3', collapsed: true, items: [{ autogenerate: { directory: 'docs/protocols/dnp3' } }] },
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

    sitemap({
      serialize(item) {
        const date = lastmod.get(item.url);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
