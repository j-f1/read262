import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({
  data: {
    sections: { sections },
  },
}) => (
  <Layout>
      <SEO title="Home" />
      <ul>
          {sections.map(({ name, id, route }) => (
              <li key={id}>
          <a href={'/' + route}>{name}</a>
        </li>
      ))}
    </ul>
  </Layout>
)

export const query = graphql`
  query ListPagesQuery {
    sections {
      sections {
        id
        route
        name
      }
    }
  }
`

export default IndexPage
