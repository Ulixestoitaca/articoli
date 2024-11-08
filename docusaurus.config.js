import { themes as prismThemes } from 'prism-react-renderer';
//import terserWebpackPlugin from './src/plugins/terser-webpack-plugin';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '?Come far per?',
  tagline: 'Ogni problema ha una soluzione',
  favicon: 'img/favicon.ico',
  url: 'https://www.impresaitalia.info',
  baseUrl: '/articoli/',
  organizationName: 'impresaitalia',
  projectName: 'articoli',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },
  
  /*future: {
    experimental_faster: true,
  },  */

  scripts: [
    {
      src: "//geo.cookie-script.com/s/73755c1e2c1e19d8a64cd552e26fdde6.js?region=eu",
      async: true,
      preload: true,
      charset: "UTF-8",
      type: "text/javascript"
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: undefined,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'How To Do This?',
      logo: {
        alt: 'ImpresaItalia - Come fare per?',
        src: 'https://www.impresaitalia.info/public_resources/logo.jpg',
        href: "pathname://",
		className: 'custom-logo',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'imprese',
          position: 'left',
          label: 'Imprese',
        },
        {
          type: 'docSidebar',
          sidebarId: 'informatica',
          position: 'left',
          label: 'Informatica',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Chi siamo',
          items: [
            {
              label: 'Contattaci',
              to: 'https://www.impresaitalia.info/contacts.asp',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/ItaliaImpresa',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/Impresaitalia-878056638937425',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/impresa-italia',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Login',
              to: 'https://www.impresaitalia.info/users/login.php',
            },
            {
              label: 'Registrati',
              href: 'https://www.impresaitalia.info/users/register_company.php',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ImpresaItalia.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
/*
  plugins: [
    terserWebpackPlugin,
  ],*/
};

export default config;
