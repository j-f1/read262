import React from 'react'
import { graphql } from 'gatsby'

import { SpecPage, Edge, NestedSpecPage } from '../types'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageList from '../components/page-list'

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

const IndexPage = ({
  data: {
    allSpecPage: { edges },
  },
}: {
  data: { allSpecPage: { edges: Array<Edge<SpecPage>> } }
}) => (
  <Layout>
    <SEO title="Home" />
    <PageList pages={nestPages(edges.map(edge => edge.node))} />
  </Layout>
)

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

export default IndexPage
