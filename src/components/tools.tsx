import React from 'react'

import Search from './tools/search'
import SecIDLookup from './tools/sec-id-lookup'
import useMedia from 'use-media'

const Tools = () => {
  return (
    <div
      style={{
        fontFamily: 'var(--sans)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        display: 'flex',
        marginTop: '0.5em',
        marginBottom: '-0.5em',
      }}
    >
      <label>
        Search
        <br />
        <Search />
      </label>
      <label style={{ marginLeft: '1em', display: 'block' }}>
        Open section
        <br />
        <SecIDLookup />
      </label>
    </div>
  )
}
export default Tools
