import React from 'react'
import { graphql, navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const SpecPage = ({
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
}) => {
  React.useEffect(() => {
    const handler = event => {
      if (event.target.matches('article a')) {
        event.preventDefault()
        navigate(event.target.getAttribute('href'))
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])
  return (
    <Layout>
      <SEO title={title} />
      <h1>
        <span className="secnum">{secnum}</span>
        {title}
      </h1>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  )
}
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

export default SpecPage
