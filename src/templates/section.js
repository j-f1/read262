import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({
  data: {
    allSection: {
      edges: [
        {
          node: { name, path },
        },
      ],
    },
  },
}) => (
  <Layout>
    <SEO title="Home" />
    <h1>
      {path.length ? path.join('.') + '. ' : ''}
      {name}
    </h1>
  </Layout>
)

export const query = graphql`
  query GetPageQuery($route: String) {
    allSection(filter: { route: { eq: $route } }) {
      edges {
        node {
          path
          name
        }
      }
    }
  }
`

export default IndexPage
