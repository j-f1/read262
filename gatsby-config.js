require('ts-node/register')

// Neither of these keys are secret.
Object.assign(process.env, {
  GATSBY_ALGOLIA_SEARCH_KEY: '530c361aee12e9f0e27938227e011277',
})

module.exports = {
  siteMetadata: {
    title: 'read262',
    description: 'Read the ECMAScript spec in your browser',
    author: '@j-f1',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-typescript-checker',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'read262',
        short_name: 'read262',
        start_url: '/',
        background_color: '#f3df49',
        theme_color: '#f3df49',
        display: 'minimal-ui',
      },
    },
    {
      resolve: 'gatsby-source-ecma262',
      options: { component: require.resolve('./src/templates/section.tsx') },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Merriweather:400,400i,700,700i'],
        },
        custom: {
          families: ['Fira Code:n3,n4,n5,n7'],
          urls: [
            'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.206/distr/fira_code.css',
          ],
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    'gatsby-plugin-offline',
  ],
}
