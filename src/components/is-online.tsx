import useIsOnline from '@rehooks/online-status'
import React, { useState, useDebugValue, useContext } from 'react'
import { WrapperProps } from '../types'

const Context = React.createContext(true)

const devCornerStyle: React.CSSProperties = {
  opacity: 0.6,
  position: 'fixed',
  left: 0,
  bottom: 0,
  fontFamily: 'var(--sans)',
  background: '#ccc',
  padding: 8,
  borderTopRightRadius: 5,
  userSelect: 'none',
  WebkitUserSelect: 'none',
}

export function OnlineProvider({ children }: WrapperProps) {
  if (process.env.NODE_ENV === 'development') {
    const [isOnline, setOnline] = useState(useIsOnline())
    return (
      <Context.Provider value={isOnline}>
        <div style={devCornerStyle}>
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
