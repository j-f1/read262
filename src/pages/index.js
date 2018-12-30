import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({
  data: {
    allSpecPage: { edges },
  },
}) => (
  <Layout>
    <SEO title="Home" />
    <ul>
      {edges.map(({ node: { id, route, secnum, title } }) => (
        <li key={id}>
          <a href={route}>
            <span className="secnum">{secnum}</span>
            {title}
          </a>
        </li>
      ))}
    </ul>
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
        }
      }
    }
  }
`

export default IndexPage
