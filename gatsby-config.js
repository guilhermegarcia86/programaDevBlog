require("dotenv").config()
const queries = require("./src/utils/algolia")


const plugins = [
  `gatsby-plugin-sharp`,
  `gatsby-transformer-sharp`,
  {
    // keep as first gatsby-source-filesystem plugin for gatsby image support
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${__dirname}/static/assets`,
      name: 'uploads'
    }
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/assets`,
      name: `assets`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/posts`,
      name: `blog`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/about`,
      name: `about`,
    },
  },
  `gatsby-transformer-json`,
  'gatsby-plugin-resolve-src',
  `gatsby-plugin-styled-components`,
  `gatsby-plugin-svgr`,
  `gatsby-plugin-transition-link`,
  `gatsby-plugin-offline`,
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-sitemap`,
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-relative-images',
        },
        {
          resolve: `gatsby-remark-images`,
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 650,
            linkImagesToOriginal: false
          },
        },
        {
          resolve: 'gatsby-remark-copy-linked-files',
          options: {
            destinationDir: 'static/assets/'
          }
        },
        {
          resolve: `gatsby-remark-responsive-iframe`,
          options: {
            wrapperStyle: `margin-bottom: 1.0725rem`,
          },
        },
        `gatsby-plugin-catch-links`,
        `gatsby-remark-lazy-load`,
        `gatsby-remark-prismjs`,
        `gatsby-remark-external-links`,
        `gatsby-remark-smartypants`,
        {
          resolve: `gatsby-plugin-google-fonts`,
          options: {
            fonts: [
              `fira code`,
              `source sans pro`
            ],
            display: 'swap'
          }
        },
      ],
    },
  },
  {
    resolve: 'gatsby-plugin-i18n',
    options: {
      langKeyDefault: 'pt-br',
      useLangKeyLayout: false
    }
  },
  {
    resolve: `gatsby-plugin-algolia-search`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_ADMIN_KEY,
      indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
      queries,
      chunkSize: 10000, // default: 1000
      enablePartialUpdates: true
    }
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `programaDev`,
      short_name: `programadev.com.br`,
      start_url: `/`,
      background_color: `#16202c`,
      theme_color: `#16202c`,
      display: `minimal-ui`,
      icon: `content/assets/programaDev.png`,
    },
  },
  `gatsby-plugin-netlify-cms`,
  `gatsby-plugin-netlify`,
  {
    resolve: 'gatsby-plugin-netlify-cache',
    options: {
      cachePublic: true
    }
  },
]

module.exports = {
  siteMetadata: {
    title: `programaDev`,
    author: `@programaDev`,
    description: `Conteúdo colaborativo de tecnologia`,
    siteUrl: `https://proagramadev.com.br`,
  },
  plugins
}
