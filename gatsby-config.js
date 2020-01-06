require('ts-node/register')
require('dotenv').config({ path: require.resolve('./.env.public') })

module.exports = {
  siteMetadata: {
    title: 'read262',
    description: 'Read the ECMAScript spec in your browser',
    author: '@j-f1',
  },
  plugins: [
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    'gatsby-plugin-offline',
  ],
}
