import React from 'react'
import useOnline from '@rehooks/online-status'

import OfflineSearch from './search/offline'
import OnlineSearch from './search/online'

const Search = () => (useOnline() ? <OnlineSearch /> : <OfflineSearch />)
export default Search
