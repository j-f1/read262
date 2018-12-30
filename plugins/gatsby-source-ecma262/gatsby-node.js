/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// const fetch = require('node-fetch')
const fs = require('fs')
const { JSDOM } = require('jsdom')

const CONTENT = Symbol('jsdom content nodes')

exports.sourceNodes = ({ actions: { createNode }, createContentDigest }) => {
  const {
    window: { document },
  } = new JSDOM(
    fs.readFileSync(require.resolve('./cache.html'), 'utf8')
    // await fetch('https://tc39.github.io/ecma262/').then(res => res.text())
  )

  const ids = Object.create(null)
  for (const child of document.querySelectorAll('#spec-container [id]')) {
    let segments = []
    let parent = child
    do {
      if (parent.matches('emu-clause'))
        segments.unshift(parent.id.replace('sec-', ''))
      parent = parent.parentElement
    } while (parent && parent.id !== 'spec-container')

    const route =
      '/' +
      (child.matches('emu-clause') && segments.length < 2
        ? segments.slice(0, 2).join('/')
        : segments.slice(0, 2).join('/') + '#' + child.id)

    if (ids[child.id]) {
      console.warn(
        `warning! Attempted to assign #${
          child.id
        } to ${route}, but it’s already assigned to ${ids[child.id]}`
      )
    }
    ids[child.id] = route
  }

  const buildPage = (clause, parentRoute = '', nest = true) => {
    const children = Array.from(clause.children)
    const firstSubsection = children.findIndex(
      el => el.tagName.toLowerCase() === 'emu-clause'
    )

    const content = children.slice(
      1,
      !nest || firstSubsection === -1 ? undefined : firstSubsection
    )
    const id = clause.id
    const route = parentRoute + '/' + id.replace('sec-', '')
    const secnum = children[0].querySelector('.secnum')

    for (const para of content) {
      for (const link of para.querySelectorAll('[href]')) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          if (!ids[href.slice(1)]) {
            console.warn(`Warning! Unrecognized ID ${li.href.slice(1)}`)
            continue
          }
          link.setAttribute('href', ids[href.slice(1)])
        }
      }
    }

    const html = content.map(el => el.outerHTML).join('')
    createNode({
      id: 'page-' + id,
      route,
      secnum: secnum ? secnum.textContent : undefined,
      title: secnum
        ? children[0].textContent.replace(secnum.textContent, '')
        : children[0].textContent,
      internal: {
        type: 'SpecPage',
        mediaType: 'text/html',
        content: html,
        contentDigest: createContentDigest(html),
      },
    })

    if (nest && firstSubsection !== -1) {
      for (const subclause of children.slice(firstSubsection)) {
        buildPage(subclause, route, false)
      }
    }
  }

  buildPage(document.querySelector('emu-intro'))
  for (const clause of document.querySelectorAll(
    '#spec-container > emu-clause'
  )) {
    buildPage(clause)
  }

  createNode()
}

exports.createPages = async ({ graphql, actions: { createPage } }, options) => {
  const result = await graphql(/* GraphQL */ `
    query ListRoutesQuery {
      allSpecPage {
        edges {
          node {
            route
          }
        }
      }
    }
  `)
  if (result.errors) {
    throw result.errors
  }
  for (const {
    node: { route },
  } of result.data.allSpecPage.edges) {
    createPage({
      path: route,
      component: options.component,
      context: { route },
    })
  }
}
