require('ts-node/register')
require('dotenv').config({ path: require.resolve('./.env.public') })

const { readFileSync } = require('fs')

module.exports = {
  siteMetadata: {
    title: 'read262',
    description: 'Read the ECMAScript spec in your browser',
    author: '@j-f1',
    copyright: readFileSync(require.resolve('./LICENSE'), 'utf8')
      .split('\n')[2]
      .split(' ')
      .slice(1, -2)
      .join(' '),
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
        background_color: '#f0db4f',
        theme_color: '#f0db4f',
        display: 'minimal-ui',
        icon: 'src/logo.png',
      },
    },
    {
      resolve: 'gatsby-source-ecma262',
      options: { component: require.resolve('./src/templates/section.tsx') },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        analyzerMode: 'static',
        reportFilename: require('path').join(__dirname, 'public/analysis.html'),
      },
    },
  ],
}
