import React, { useState, useCallback } from 'react'
import useOnline from '@rehooks/online-status'

import OfflineSearch from './search/offline'
import OnlineSearch from './search/online'

export type SearchProps = {
  value: string
  onChange: (event: React.ChangeEvent<{ value: string }>) => void
}

const Search = () => {
  let [value, setValue] = useState('')
  let onChange = useCallback<SearchProps['onChange']>(
    event => setValue(event.currentTarget.value),
    []
  )

  const props = { value, onChange }

  if (process.env.NODE_ENV === 'development') {
    const [isOnline, setOnline] = useState(true)
    return (
      <>
        <p style={{ opacity: 0.6 }}>
          <label>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={e => setOnline(e.target.checked)}
            />{' '}
            Toggle Algolia/Lunr search
          </label>
        </p>
        {isOnline ? <OnlineSearch {...props} /> : <OfflineSearch {...props} />}
      </>
    )
  }

  return useOnline() ? (
    <OnlineSearch {...props} />
  ) : (
    <OfflineSearch {...props} />
  )
}
export default Search
