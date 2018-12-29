/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// const fetch = require('node-fetch')
const fs = require('fs')
const cheerio = require('cheerio')
const crypto = require('crypto')

exports.sourceNodes = async ({
  actions: { createNode, createParentChildLink },
}) => {
  const $ = cheerio.load(
    fs.readFileSync('./cache.html', 'utf8')
    // await fetch('https://tc39.github.io/ecma262/').then(res => res.text())
  )

  function parseList(list, parent, nums = []) {
    if (!list) return undefined
    return list
      .toArray()
      .map($)
      .map(el => {
        const link = el.find('a')[0]
        const id = link.attribs.href.replace('#', '')
        const path = nums.concat(
          $(link)
            .find('.secnum')
            .text() || []
        )
        const section = {
          id,
          route: parent.route + '/' + link.attribs.href.replace(/^#sec-/, ''),
          name: link.children.find(c => c.type === 'text').data.trim(),
          path,
        }
        const node = {
          ...section,
          parent: parent.id,
          children: [],
          internal: {
            mediaType: 'tc39/section',
            type: 'Section',
            content: JSON.stringify(section),
            contentDigest: crypto
              .createHash(`md5`)
              .update(JSON.stringify(section))
              .digest(`hex`),
          },
        }
        createNode(node)
        parseList(el.find('ol > li'), node, path).map(child =>
          createParentChildLink({ parent: node, child })
        )
        return node
      })
  }
  const sections = parseList($('#menu-toc > ol > li'), {
    id: 'spec-sections',
    route: '/',
  })
  createNode({
    id: 'spec-sections',
    sections,
    children: [],
    internal: {
      mediaType: 'tc39/sections',
      type: 'Sections',
      content: JSON.stringify(sections),
      contentDigest: crypto
        .createHash(`md5`)
        .update(JSON.stringify(sections))
        .digest(`hex`),
    },
  })
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query ListRoutesQuery {
      sections {
        sections {
          route
        }
      }
    }
  `)
  if (result.errors) {
    throw result.errors
  }
  for (const { route } of result.data.sections.sections) {
    createPage({
      path: '/' + route,
      component: require.resolve('./src/templates/section.js'),
      context: { route },
    })
  }
}
