const exists = require('util').promisify(require('fs').exists)
const writeFile = require('util').promisify(require('fs').writeFile)
const link = require('util').promisify(require('fs').link)
const path = require('path')

exports.createPages = async ({ graphql }) => {
  const { data } = await graphql(/* GraphQL */ `
    query GetSearchData {
      allSpecPage {
        edges {
          node {
            route
            title
            secnum
            internal {
              content
            }
          }
        }
      }
    }
  `)

  const target = path.resolve(__dirname, './public/js-search.min.js')
  await Promise.all([
    writeFile(
      path.resolve(__dirname, './public/search-data.json'),
      JSON.stringify(data.allSpecPage.edges.map(e => e.node)),
      'utf8'
    ),
    exists(target).then(
      exists =>
        exists ||
        link(
          path.resolve(
            __dirname,
            './node_modules/js-search/dist/umd/js-search.min.js'
          ),
          target
        )
    ),
  ]).catch(err => {
    console.error('failed to write file', err)
  })
}
