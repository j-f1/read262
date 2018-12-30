module.exports = {
  siteMetadata: {
    title: `read262`,
    description: `Read the ECMAScript spec in your browser`,
    author: `@j-f1`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
    {
      resolve: 'gatsby-source-ecma262',
      options: { component: require.resolve('./src/templates/section.js') },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Merriweather:400,400i,700,700i'],
        },
        custom: {
          families: ['Fira Code:n3,n4,n5,n7'],
          urls:
            'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.206/distr/fira_code.css',
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    'gatsby-plugin-offline',
  ],
}
