import React from 'react'
import useOnline from '@rehooks/online-status'
import useInputValue, { InputValue } from '@rehooks/input-value'

import OfflineSearch from './search/offline'
import OnlineSearch from './search/online'

const Search = () => {
  const props = useInputValue('test')

  return useOnline() ? (
    <OnlineSearch {...props} />
  ) : (
    <OfflineSearch {...props} />
  )
}
export default Search

export type SearchProps = InputValue<string>
