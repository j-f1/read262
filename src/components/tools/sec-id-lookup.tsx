import React, { useRef } from 'react'
import { useStaticQuery, graphql, navigate } from 'gatsby'

interface IDMap {
  id: string
  route: string
}

export default function SecIDLookup() {
  const inputRef = useRef<HTMLInputElement>(null)
  const sections: Array<IDMap> = useStaticQuery(graphql`
    query SecIDLookup {
      allIdMap {
        nodes {
          id
          route
        }
      }
    }
  `).allIdMap.nodes
  return (
    <form
      onSubmit={event => {
        const value = inputRef.current!.value
        const id = value.startsWith('#')
          ? value.slice(1)
          : /https?:\/\/(tc39\.es|tc39\.github\.io)\/ecma262/.test(value)
          ? new URL(value).hash.slice(1)
          : value
        const result = sections.find(x => x.id === id)
        if (result) {
          navigate(result.route)
        }
        event.preventDefault()
      }}
    >
      <input ref={inputRef} type="text" placeholder="Paste tc39.es URL" />
      <button type="submit">Go</button>
    </form>
  )
}
