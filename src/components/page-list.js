import React from 'react'
import SectionTitle from '../components/title'
import { Link } from 'gatsby'

const PageList = ({ pages }) => (
  <ul>
    {pages.map(({ id, route, secnum, title, hasContent, children }) => (
      <li key={id}>
        {hasContent ? (
          <Link to={route}>
            <SectionTitle secnum={secnum} title={title} />
          </Link>
        ) : (
          <SectionTitle secnum={secnum} title={title} />
        )}
        {children && children.length ? <PageList pages={children} /> : null}
      </li>
    ))}
  </ul>
)

export default PageList
