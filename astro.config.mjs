// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://otfabric.io',

  integrations: [
    starlight({
      title: 'OT Fabric',

      description:
        'Open-source libraries, tools, and applications for industrial connectivity and interoperability.',

      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/otfabric',
        },
      ],

      sidebar: [
        {
          label: 'Getting Started',
          items: [{ autogenerate: { directory: 'getting-started' } }],
        },
        {
          label: 'Protocols',
          items: [{ autogenerate: { directory: 'protocols' } }],
        },
        {
          label: 'Tools',
          items: [{ autogenerate: { directory: 'tools' } }],
        },
        {
          label: 'Reference',
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],

      customCss: ['./src/styles/global.css'],
    }),

    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});