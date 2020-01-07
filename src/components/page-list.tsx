import React from 'react'
import { Link } from 'gatsby'
import { SpecPage, NestedSpecPage } from '../types'

export default function PageList({
  pages,
}: {
  pages: Array<SpecPage | NestedSpecPage>
}) {
  return (
    <ol>
      {pages.map(({ id, route, title, hasContent }) => (
        <li key={id}>{hasContent ? <Link to={route}>{title}</Link> : title}</li>
      ))}
    </ol>
  )
}
