import React from 'react'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch-dom'
import algolia from 'algoliasearch'
import { Hit as HitObj } from 'react-instantsearch-core'
import { SearchRecord } from '../../types'
import { Link } from 'gatsby'
import { SearchProps } from './search'

import * as styles from './search.module.css'

function Hit({ hit }: { hit: HitObj<SearchRecord> }) {
  return (
    <Link to={'/' + hit.route} className={styles.searchHit}>
      <strong className={styles.hitTitle}>
        <span className="secnum">
          <OptionalHighlight attribute="secnum" hit={hit} />
        </span>
        <OptionalHighlight attribute="heading" hit={hit} />
      </strong>
      <p className={styles.hitContent}>
        <OptionalHighlight attribute="content" hit={hit} />
      </p>
    </Link>
  )
}

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

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div>
      <InstantSearch
        searchClient={algolia(
          process.env.GATSBY_ALGOLIA_APP_ID!,
          process.env.GATSBY_ALGOLIA_SEARCH_KEY!
        )}
        searchState={{ query: value }}
        indexName="main"
      >
        <SearchBox showLoadingIndicator onChange={onChange} />
        {value && <Hits<SearchRecord> hitComponent={Hit} />}
      </InstantSearch>
    </div>
  )
}
