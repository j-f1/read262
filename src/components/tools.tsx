import React from 'react'

import Search from './tools/search'
import SecIDLookup from './tools/sec-id-lookup'

import styles from './tools.module.css'

export default function Tools() {
  return (
    <div className={styles.wrapper}>
      <label>
        Search
        <Search />
      </label>
      <label>
        Open section
        <SecIDLookup />
      </label>
    </div>
  )
}
