import React, { useState, useCallback } from 'react'

import useOnline from '../is-online'

import OfflineSearch from './search-offline'
import OnlineSearch from './search-online'

export type SearchProps = {
  value: string
  onChange: (event: React.ChangeEvent<{ value: string }>) => void
}

export default function Search() {
  const [value, setValue] = useState('')
  const onChange = useCallback<SearchProps['onChange']>(
    (event) => setValue(event.currentTarget.value),
    []
  )

  const props = { value, onChange }

  return (
    <>
      {useOnline() ? <OnlineSearch {...props} /> : <OfflineSearch {...props} />}
    </>
  )
}
