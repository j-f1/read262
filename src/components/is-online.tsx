import useIsOnline from '@rehooks/online-status'
import React, { useState, useDebugValue, useContext } from 'react'
import { WrapperProps } from '../types'

import styles from './dev-corner.module.css'

const Context = React.createContext(true)

export function OnlineProvider({ children }: WrapperProps) {
  if (process.env.NODE_ENV === 'development') {
    const [isOnline, setOnline] = useState(useIsOnline())
    return (
      <Context.Provider value={isOnline}>
        <div className={styles.corner}>
          <a href="/___graphql">GraphQL Explorer</a>
          <br />
          <label>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={e => setOnline(e.target.checked)}
            />{' '}
            <code>useOnline()</code>
          </label>
        </div>
        {children}
      </Context.Provider>
    )
  }
  return <Context.Provider value={useIsOnline()}>{children}</Context.Provider>
}

export default function useOnline() {
  const isOnline = useContext(Context)
  useDebugValue(isOnline ? 'Online' : 'Offline')
  return isOnline
}
