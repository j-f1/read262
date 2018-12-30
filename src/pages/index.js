import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import PageList from '../components/page-list'
import '../components/ecmarkup.css'

function nestPages(pages) {
  const nestedPages = []
  for (const page of pages) {
    const lastPage = nestedPages[nestedPages.length - 1]
    if (lastPage && page.secnum.split('.')[0] === lastPage.secnum) {
      lastPage.children.push(page)
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
