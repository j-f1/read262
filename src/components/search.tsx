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

  return useOnline() ? (
    <OnlineSearch {...props} />
  ) : (
    <OfflineSearch {...props} />
  )
}
export default Search
