import React, { useState, useEffect } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

const workerize: <T extends { [key: string]: (...args: any[]) => any }>(
  code: string,
  options?: {
    type?: 'classic' | 'module'
    credentials?: 'omit' | 'same-origin' | 'include'
    name?: string
  }
) => {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<R>
    : never
} = require('workerize').default

import { Edge, SpecPage } from '../../types'
import SectionTitle from '../section-title'
import { SearchProps } from '../search'

const Highlight = ({ text, query }: { text: string; query: string }) => (
  <>
    {parse(text, match(text, query)).map(({ text, highlight }, i) =>
      highlight ? <mark key={i}>{text}</mark> : text
    )}
  </>
)

type ResultPage = Pick<SpecPage, 'route' | 'title' | 'secnum'>

const worker =
  typeof location === 'undefined'
    ? null
    : workerize<{ search: (query: string) => lunr.Index.Result[] }>(`
  importScripts('https://unpkg.com/lunr@2.3.6')

  const indexFile = ${JSON.stringify(
    new URL('/lunr-index.json', location.href)
  )}
  console.log('[WORKER] loading index from', indexFile)

  let index = null
  fetch(indexFile)
    .then(res => res.json())
    .then(data => (index = lunr.Index.load(data)))
    .then(() => console.log('[WORKER] index loaded'))
    .catch(err => console.error('Loading index failed:', err))

  export function search(query) {
    return index ? index.search(query) : []
  }
`)

const Search = ({ value, onChange }: SearchProps) => {
  const data = useStaticQuery(graphql`
    query GetPageResults {
      allSpecPage {
        edges {
          node {
            route
            title
            secnum
          }
        }
      }
    }
  `)
  const pages: ResultPage[] = data.allSpecPage.edges.map(
    (e: Edge<unknown>) => e.node
  )

  const [results, setResults] = useState(new Array<lunr.Index.Result>())
  useEffect(() => {
    if (value === '') {
      setResults([])
      return
    }
    let active = true
    worker!.search(value).then(results => {
      if (active) setResults(results)
    })
    return () => {
      active = false
    }
  }, [value])

  return (
    <div>
      <input type="search" value={value} onChange={onChange} />
      {!!results.length && (
        <ul>
          {results.map(({ ref, score }) => {
            const page = pages.find(({ route }) => route === ref)
            if (!page) return null
            return (
              <li key={ref}>
                <Link to={page.route} className="search-hit">
                  <strong className="hit-title">
                    <SectionTitle
                      secnum={page.secnum}
                      title={<Highlight text={page.title} query={value} />}
                    />
                  </strong>
                </Link>{' '}
                {process.env.NODE_ENV === 'development' && (
                  <small style={{ fontFamily: 'var(--sans)', opacity: 0.5 }}>
                    Score: {Math.round(score * 10) / 10}
                  </small>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Search
