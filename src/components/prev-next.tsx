import React from 'react'
import { Link } from 'gatsby'

import SectionTitle from './section-title'
import { SpecPageMeta } from '../types'

const PrevNext = ({
  prev,
  next,
}: {
  prev?: SpecPageMeta
  next?: SpecPageMeta
}) => (
  // adapted from https://github.com/gaearon/overreacted.io/blob/e1520ea8/src/templates/blog-post.js#L75-L98
  <ul
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      listStyle: 'none',
      padding: 0,
      fontFamily: 'var(--sans)',
    }}
  >
    <li>
      {prev && (
        <Link to={prev.route} rel="prev">
          <span className="nav-arrow">&lt;-</span> <SectionTitle {...prev} />
        </Link>
      )}
    </li>
    <li>
      {next && (
        <Link to={next.route} rel="next">
          <SectionTitle {...next} /> <span className="nav-arrow">-></span>
        </Link>
      )}
    </li>
  </ul>
)

export default PrevNext
