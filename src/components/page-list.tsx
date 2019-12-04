import React from 'react'
import SectionTitle from '../components/section-title'
import { Link } from 'gatsby'
import { SpecPage, NestedSpecPage } from '../types'

const PageList = ({ pages }: { pages: Array<SpecPage | NestedSpecPage> }) => (
  <ol>
    {pages.map(({ id, route, secnum, title, hasContent, children }) => (
      <li key={id}>{hasContent ? <Link to={route}>{title}</Link> : title}</li>
    ))}
  </ol>
)

export default PageList
