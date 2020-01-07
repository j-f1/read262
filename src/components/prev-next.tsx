import React from 'react'
import { Link } from 'gatsby'

import SectionTitle from './section-title'
import { SpecPageMeta } from '../types'

import styles from './prev-next.module.css'

type Props = { prev?: SpecPageMeta; next?: SpecPageMeta }

const PrevNext = ({ prev, next }: Props) => (
  // adapted from https://github.com/gaearon/overreacted.io/blob/e1520ea8/src/templates/blog-post.js#L75-L98
  <ul className={styles.wrapper}>
    <li>
      {prev && (
        <Link
          to={prev.route}
          rel="prev"
          aria-label={`Previous section (${prev.title})`}
        >
          <span className={styles.arrow} aria-hidden="true">
            &lt;-
          </span>
          <SectionTitle {...prev} />
        </Link>
      )}
    </li>
    <li>
      {next && (
        <Link
          to={next.route}
          rel="next"
          aria-label={`Next section (${next.title})`}
        >
          <SectionTitle {...next} />
          <span className={styles.arrow} aria-hidden="true">
            ->
          </span>
        </Link>
      )}
    </li>
  </ul>
)

export default PrevNext
