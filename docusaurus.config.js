// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  url: 'https://www.impresaitalia.info',
  baseUrl: '/articoli/build/',
  organizationName: 'impresaitalia',
  projectName: 'articoli',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },
  
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'), // Sidebar unica
          routeBasePath: '/', // Puoi cambiarlo se necessario
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
        href: "pathname:///"
      },
      items: [
        {
          to: '/imprese', // Link alla sezione imprese
          label: 'Imprese',
          position: 'left',
        },
        {
          to: '/informatica', // Link alla sezione informatica
          label: 'Informatica',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        // Altri link
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ImpresaItalia.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
