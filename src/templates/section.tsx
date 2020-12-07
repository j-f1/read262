import React from 'react'
import { graphql, navigate } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import SectionTitle from '../components/section-title'
import PrevNext from '../components/prev-next'
import { Edge, SpecPage } from '../types'

import './content.css'

export default function SpecSection({
  data: {
    allSpecPage: {
      edges: [
        {
          node: {
            secnum,
            title,
            prev,
            next,
            internal: { content },
          },
        },
      ],
    },
  },
}: {
  data: { allSpecPage: { edges: [Edge<SpecPage>] } }
}) {
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
        while (!clause.matches('emu-clause, article')) {
          if (!clause.parentElement) return
          clause = clause.parentElement
        }
        Array.from(clause.querySelectorAll('var'))
          .filter((el) => el.textContent === name)
          .forEach((decl) => decl.classList.toggle('referenced', shouldSelect))
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
        {title === 'Colophon' ? (
          <>
            <h2>About read262</h2>
            <p>
              read262 was created using Gatsby, and a custom{' '}
              <code>gatsby-source</code> plugin is used to break the single HTML
              file containing the original spec in into a series of separate
              pages. Some of read262’s CSS originated in the Gatsby blog starter
              I began the project with, while others were copied over from the{' '}
              <code>ecmarkup</code> repository (see{' '}
              <code>src/templates/ecmarkup.css</code>), and the rest are my own.
            </p>
            <p>
              The fonts used on read262 are{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--sans)', fontWeight: 'bold' }}
              >
                Futura
              </a>
              ,{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--serif)', fontWeight: 800 }}
              >
                Merriweather
              </a>
              , and{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}
              >
                Fira<span style={{ fontFamily: 'var(--sans)' }}> </span>Code
              </a>
              . Search is provided by{' '}
              <a href="https://www.algolia.com">Algolia</a> when you’re online,
              and{' '}
              <a
                href="https://github.com/bvaughn/js-search"
                style={{ fontFamily: 'var(--mono)', fontWeight: 550 }}
              >
                js-search
              </a>{' '}
              when you’re offline. Everything is hosted on{' '}
              <a href="https://www.netlify.com">Netlify</a>, and{' '}
              <a href="https://zapier.com">Zapier</a> is used to automate
              deploys whenever the spec repo is updated (
              <a href="https://zapier.com/shared/7baef3f269fd297f91fbeae398a4dca8d370d1b7">
                here’s the Zap I use
              </a>
              ). The yellow color is copied from the JS logo.
            </p>
            <p>
              read262 supports Dark Mode automatically, and uses a service
              worker to enable offline support.
            </p>
          </>
        ) : null}
      </article>
      <PrevNext prev={prev} next={next} />
    </Layout>
  )
}
export const query = graphql`
  query GetSectionQuery($route: String) {
    allSpecPage(filter: { route: { eq: $route } }) {
      edges {
        node {
          secnum
          title
          prev {
            route
            secnum
            title
          }
          next {
            route
            secnum
            title
          }
          internal {
            content
          }
        }
      }
    }
  }
`
