import React from 'react'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch-dom'
import { Hit as HitObj } from 'react-instantsearch-core'
import { SearchRecord } from '../../types'
import { Link } from 'gatsby'

const Hit = ({ hit }: { hit: HitObj<SearchRecord> }) => (
  <Link to={hit.route} className="search-hit">
    <strong className="hit-title">
      <span className="secnum">
        <OptionalHighlight attribute="secnum" hit={hit} />
      </span>
      <OptionalHighlight attribute="heading" hit={hit} />
    </strong>
    <p className="hit-content">
      <OptionalHighlight attribute="content" hit={hit} />
    </p>
  </Link>
)

const OptionalHighlight = ({
  attribute,
  hit,
  ...props
}: {
  attribute: keyof SearchRecord
  hit: HitObj<SearchRecord>
  [key: string]: any
}) =>
  hit._highlightResult[attribute] ? (
    <Highlight attribute={attribute} hit={hit} tagName="mark" {...props} />
  ) : (
    <>{hit[attribute]}</>
  )

const Search = () => (
  <InstantSearch
    appId={process.env.GATSBY_ALGOLIA_APP_ID!}
    apiKey={process.env.GATSBY_ALGOLIA_SEARCH_KEY!}
    indexName="main"
  >
    <SearchBox />
    <Hits<SearchRecord> hitComponent={Hit} />
  </InstantSearch>
)
export default Search
