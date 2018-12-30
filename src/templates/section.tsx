import React from 'react'
import { graphql, navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import SectionTitle from '../components/section-title'
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
      if (!target) return
      if (target.matches('article a') && target.getAttribute('href')) {
        event.preventDefault()
        navigate(target.getAttribute('href')!)
      } else if (target.matches('article var')) {
        const name = target.textContent!
        const shouldSelect = !target.classList.contains('referenced')
        let clause = target
        while (!clause.matches('emu-clause')) {
          if (!clause.parentElement) return
          clause = clause.parentElement
        }
        Array.from(clause.querySelectorAll('var'))
          .filter(el => el.textContent === name)
          .forEach(decl => decl.classList.toggle('referenced', shouldSelect))
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])
  return (
    <Layout>
      <SEO title={title} />
      <article>
        <h1>
          <SectionTitle title={title} secnum={secnum} />
        </h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
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
