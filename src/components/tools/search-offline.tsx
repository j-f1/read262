import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import workerize from './workerize'

import { SpecPage } from '../../types'
import SectionTitle from '../section-title'
import { SearchProps } from './search'

import * as styles from './search.module.css'

type HighlightProps = { text: string; query: string }
const Highlight = ({ text, query }: HighlightProps) => (
  <>
    {parse(text, match(text, query)).map(({ text, highlight }, i) =>
      highlight ? <mark key={i}>{text}</mark> : text
    )}
  </>
)

type ResultPage = Pick<SpecPage, 'route' | 'title' | 'secnum' | 'internal'>
type Result = { doc: ResultPage; score: number }

const worker =
  typeof location === 'undefined'
    ? null
    : workerize<{ search: (query: string) => Array<Result> }>(/* JS */ `
  importScripts(${JSON.stringify(new URL('/js-search.min.js', location.href))})

  const indexFile = ${JSON.stringify(
    new URL('/search-data.json', location.href)
  )}
  console.log('[WORKER] loading index from', indexFile)

  const index = new JsSearch.Search('route')
  index.tokenizer = new JsSearch.StopWordsTokenizer(
    new JsSearch.SimpleTokenizer()
  )
  index.addIndex('title')
  index.addIndex('secnum')
  index.addIndex(['internal', 'content'])
  const ready = fetch(indexFile)
    .then(res => res.json())
    .then(data => index.addDocuments(data))
    .then(() => console.log('[WORKER] index loaded'))
    .catch(err => console.error('Loading index failed:', err))

  export async function search(query) {
    await ready
    const tokens = index.tokenizer.tokenize(index.sanitizer.sanitize(query))
    const score = index.searchIndex._createCalculateTfIdf()
    return index.searchIndex.search(tokens, index._documents)
      .map(doc => ({ doc, score: score(tokens, doc, index._documents) }))
  }
`)

export default function Search({ value, onChange }: SearchProps) {
  const [results, setResults] = useState(new Array<Result>())
  useEffect(() => {
    if (value === '') {
      setResults([])
      return
    }
    let active = true
    worker!.search(value).then((results) => {
      if (active) setResults(results)
    })
    return () => {
      active = false
    }
  }, [value])

  return (
    <div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search here…"
      />
      {!!results.length && (
        <div className="ais-Hits">
          <ul className="ais-Hits-list">
            {results.map(({ doc, score }) => {
              if (!doc) return null
              return (
                <li key={doc.route}>
                  <Link to={doc.route} className={styles.searchHit}>
                    <strong className={styles.hitTitle}>
                      <SectionTitle
                        secnum={doc.secnum}
                        title={<Highlight text={doc.title} query={value} />}
                      />
                    </strong>
                  </Link>{' '}
                  {process.env.NODE_ENV === 'development' && (
                    <small
                      style={{ fontFamily: 'var(--sans)', opacity: 0.5 }}
                      title="hidden in production"
                    >
                      Score: {Math.round(score * 10) / 10}
                    </small>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
