import React from 'react'
import SectionTitle from '../components/title'

const PageList = ({ pages }) => (
  <ul>
    {pages.map(({ id, route, secnum, title, hasContent, children }) => (
      <li key={id}>
        {hasContent ? (
          <a href={route}>
            <SectionTitle secnum={secnum} title={title} />
          </a>
        ) : (
          <SectionTitle secnum={secnum} title={title} />
        )}
        {children && children.length ? <PageList pages={children} /> : null}
      </li>
    ))}
  </ul>
)

export default PageList
