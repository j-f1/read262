const writeFile = require('util').promisify(require('fs').writeFile)
const link = require('util').promisify(require('fs').link)
const path = require('path')

const lunr = require('lunr')

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

  const pages = data.allSpecPage.edges.map(edge =>
    Object.assign(edge.node, edge.node.internal)
  )

  const index = lunr($ => {
    $.ref('route')
    $.field('title')
    $.field('secnum')
    $.field('content')
    pages.forEach(doc => $.add(doc))
  })

  await writeFile(
    path.resolve(__dirname, './public/lunr-index.json'),
    JSON.stringify(index),
    'utf8'
  ).catch(err => {
    console.error('failed to write file', err)
  })
}
