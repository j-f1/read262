import React, { useRef } from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import lunr from 'lunr'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

import { Edge, SpecPage } from '../../types'
import SectionTitle from '../section-title'
import { SearchProps } from '../search'

type FlatSpecPage = SpecPage & SpecPage['internal']

const Highlight = ({ text, query }: { text: string; query: string }) => (
  <>
    {parse(text, match(text, query)).map(({ text, highlight }, i) =>
      highlight ? <mark key={i}>{text}</mark> : text
    )}
  </>
)
const SearchImpl = ({
  pages,
  value,
  onChange,
}: { pages: FlatSpecPage[] } & SearchProps) => {
  const indexRef = useRef<lunr.Index | null>(null)
  if (indexRef.current === null) {
    indexRef.current = lunr(function() {
      this.ref('route')
      this.field('title')
      this.field('secnum')
      this.field('content')
      pages.forEach(doc => this.add(doc))
    })
  }
  const results = indexRef.current
    .search(value)
    .filter(({ score }) => score > 0.01)
  return (
    <div>
      <input type="search" value={value} onChange={onChange} />
      {!!results.length && (
        <ul>
          {results.map(({ ref, score }) => {
            const page = pages.find(({ route }) => route === ref)
            if (!page) return null
            debugger
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

const Search = (props: SearchProps) => (
  <StaticQuery
    query={graphql`
      query GetSearchData {
        allSpecPage {
          edges {
            node {
              route
              title
              secnum
              internal {
                content
              }
            }
          }
        }
      }
    `}
    render={(data: { allSpecPage: { edges: Array<Edge<SpecPage>> } }) => (
      <SearchImpl
        {...props}
        pages={data.allSpecPage.edges.map(edge =>
          Object.assign(edge.node, edge.node.internal)
        )}
      />
    )}
  />
)
export default Search
