/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { promisify } from 'util'
import { SpecPage } from '../../src/types'

export async function sourceNodes({
  actions: { createNode },
  createContentDigest,
}: {
  actions: { createNode: Function }
  createContentDigest: (x: any) => string
}) {
  const cache = path.join(__dirname, 'cache.html')
  const {
    window: { document },
  } = new JSDOM(
    fs.existsSync(cache)
      ? await promisify(fs.readFile)(cache, 'utf8')
      : await fetch('https://tc39.github.io/ecma262/').then(res => res.text())
  )
  const meta = {
    title: document.querySelector('h1.title')!.textContent,
    version: document.querySelector('h1.version')!.textContent,
  }

  createNode({
    id: 'spec-meta',
    ...meta,
    internal: {
      type: 'SpecMeta',
      mediaType: 'application/json',
      content: JSON.stringify(meta),
      contentDigest: createContentDigest(JSON.stringify(meta)),
    },
  })

  const selectors = {
    clause: 'emu-clause, emu-annex',
  }

  const ids: { [key: string]: string } = Object.create(null)
  for (const child of Array.from(
    document.querySelectorAll('#spec-container [id]')
  )) {
    let segments = new Array<string>()
    let parent = child
    do {
      if (parent.matches(selectors.clause))
        segments.unshift(parent.id.replace('sec-', ''))
      if (!parent.parentElement) break
      parent = parent.parentElement
    } while (parent.id !== 'spec-container')

    const route =
      '/' +
      (child.matches(selectors.clause) && segments.length < 2
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

  const nodes = new Array<SpecPage>()
  const buildPage = (clause: Element, parentRoute = '', nest = true) => {
    const children = Array.from(clause.children)
    const firstSubsection = children.findIndex(el =>
      el.matches(selectors.clause)
    )
    const header = clause.querySelector('h1')
    if (!header)
      throw new TypeError('could not find header for section ' + clause.id)

    const content = children.slice(
      children.indexOf(header) + 1,
      !nest || firstSubsection === -1 ? undefined : firstSubsection
    )
    const id = clause.id
    const route = parentRoute + '/' + id.replace('sec-', '')
    const secnum = header.querySelector('.secnum')

    for (const para of content) {
      for (const link of Array.from(para.querySelectorAll('[href]'))) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          if (!ids[href.slice(1)]) {
            console.warn(`Warning! Unrecognized ID ${href.slice(1)}`)
            continue
          }
          link.setAttribute('href', ids[href.slice(1)])
        }
      }
    }

    const html = content.map(el => el.outerHTML).join('')
    nodes.push({
      id: 'page-' + id,
      route,
      secnum: secnum && secnum.textContent ? secnum.textContent : '',
      title: secnum
        ? (header.textContent || '').replace(secnum.textContent || '', '')
        : header.textContent || '',
      hasContent: html !== '',
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

  for (const clause of Array.from(
    document.querySelectorAll(
      '#spec-container > emu-intro, #spec-container > emu-clause, #spec-container > emu-annex'
    )
  )) {
    buildPage(clause)
  }

  const findNode = (i: number, di: number): SpecPage | undefined => {
    i += di
    while (nodes[i]) {
      if (nodes[i].hasContent) return nodes[i]
      i += di
    }
  }

  nodes.forEach((node, i) => {
    node.prev = pick(findNode(i, -1), 'route', 'secnum', 'title')
    node.next = pick(findNode(i, +1), 'route', 'secnum', 'title')
  })
  nodes.forEach(node => createNode(node))
}

export async function createPages(
  {
    graphql,
    actions: { createPage },
  }: { graphql: Function; actions: { createPage: Function } },
  options: { component: string }
) {
  const result = await graphql(/* GraphQL */ `
    query ListRoutesQuery {
      allSpecPage {
        edges {
          node {
            route
            hasContent
          }
        }
      }
    }
  `)
  if (result.errors) {
    throw result.errors
  }
  for (const {
    node: { route, hasContent },
  } of result.data.allSpecPage.edges) {
    if (!hasContent) continue
    createPage({
      path: route,
      component: options.component,
      context: { route },
    })
  }
}

type Def<T> = T extends undefined ? never : T
const pick = <T, K extends keyof Def<T>>(
  obj: T,
  ...keys: K[]
): Pick<Def<T>, K> | undefined =>
  obj
    ? keys.reduce(
        (res, key) => {
          res[key] = (obj as Def<T>)[key]
          return res
        },
        {} as Pick<Def<T>, K>
      )
    : undefined
