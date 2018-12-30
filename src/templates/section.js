import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({
  data: {
    allSpecPage: {
      edges: [
        {
          node: {
            secnum,
            title,
            internal: { content },
          },
        },
      ],
    },
  },
}) => (
  <Layout>
    <SEO title={title} />
    <h1>
      <span className="secnum">{secnum}</span>
      {title}
    </h1>
    <article dangerouslySetInnerHTML={{ __html: content }} />
  </Layout>
)

export const query = graphql`
  query GetPageQuery($route: String) {
    allSpecPage(filter: { route: { eq: $route } }) {
      edges {
        node {
          secnum
          title
          internal {
            content
          }
        }
      }
    }
  }
`

export default IndexPage
