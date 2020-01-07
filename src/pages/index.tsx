import React from 'react'
import { graphql, Link } from 'gatsby'
import cx from 'classnames'

import { SpecPage, Edge, NestedSpecPage } from '../types'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageList from '../components/page-list'

import * as styles from './toc.module.css'

function nestPages(pages: SpecPage[]) {
  const nestedPages = new Array<NestedSpecPage>()
  for (const page of pages) {
    const lastPage = nestedPages[nestedPages.length - 1]
    if (lastPage && page.secnum.split('.')[0] === lastPage.secnum) {
      lastPage.children!.push(page)
    } else {
      nestedPages.push(Object.assign({ children: [] }, page))
    }
  }
  return nestedPages
}

export default function IndexPage({
  data: {
    allSpecPage: { edges },
  },
}: {
  data: { allSpecPage: { edges: Array<Edge<SpecPage>> } }
}) {
  const pages = nestPages(edges.map(edge => edge.node))
  const appendixIdx = pages.findIndex(p => p.secnum[0] === 'A')
  const mainContent = pages.slice(1, appendixIdx)
  const appendix = pages.slice(appendixIdx)
  return (
    <Layout>
      <SEO title="Home" />
      <h3>
        <Link to={pages[0].route}>{pages[0].title}</Link>
      </h3>
      <h3>Main Content</h3>
      <ol className={styles.tocList}>
        {mainContent.map(({ id, route, title, hasContent, children }) => (
          <li key={id}>
            {hasContent ? <Link to={route}>{title}</Link> : title}
            {children && children.length ? <PageList pages={children} /> : null}
          </li>
        ))}
      </ol>
      <h3>Appendix</h3>
      <ol className={cx(styles.tocList, styles.appendix)}>
        {appendix.map(({ id, route, title, hasContent, children }) => (
          <li key={id}>
            {hasContent ? <Link to={route}>{title}</Link> : title}
            {children && children.length ? <PageList pages={children} /> : null}
          </li>
        ))}
      </ol>
    </Layout>
  )
}

export const query = graphql`
  query ListPagesQuery {
    allSpecPage {
      edges {
        node {
          id
          route
          secnum
          title
          hasContent
        }
      }
    }
  }
`
