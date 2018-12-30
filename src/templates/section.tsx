import React from 'react'
import { graphql, navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { Edge, SitePage } from '../types'

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
}: {
  data: { allSpecPage: { edges: [Edge<SitePage>] } }
}) => {
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      const { target } = (event as unknown) as { target: HTMLElement }
      if (
        target &&
        target.matches('article a') &&
        target.getAttribute('href')
      ) {
        event.preventDefault()
        navigate(target.getAttribute('href')!)
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
