import React, { useRef } from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import lunr from 'lunr'
import useInputValue from '@rehooks/input-value'

import { Edge, SpecPage } from '../types'
import SectionTitle from './section-title'

type FlatSpecPage = SpecPage & SpecPage['internal']

interface Props {}

const SearchImpl = ({ pages }: Props & { pages: FlatSpecPage[] }) => {
  const { value, onChange } = useInputValue('')
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
          {results.map(({ ref, score, matchData }) => {
            const page = pages.find(({ route }) => route === ref)
            if (!page) return null
            return (
              <li key={ref}>
                <Link to={page.route}>
                  <SectionTitle {...page} />
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

const Search = (props: Props) => (
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
        pages={data.allSpecPage.edges.map(edge =>
          Object.assign(edge.node, edge.node.internal)
        )}
        {...props}
      />
    )}
  />
)
export default Search