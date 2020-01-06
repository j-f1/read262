import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import useMedia from 'use-media'
import GithubCorner from 'react-github-corner'
import Tools from './tools'

const Header = () => {
  const iconFits = useMedia('(min-width: 825px)')
  const {
    specMeta: { title, version },
  }: {
    specMeta: { title: string; version: string }
  } = useStaticQuery(graphql`
    query GetSpecMeta {
      specMeta {
        title
        version
      }
    }
  `)
  return (
    <header>
      <div className="container">
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <h1>{title}</h1>
          <h2>{version}</h2>
        </Link>
        <Tools />
      </div>
      {iconFits && (
        <GithubCorner
          href="https://github.com/j-f1/read262"
          octoColor="var(--yellow)"
          bannerColor="var(--black)"
        />
      )}
    </header>
  )
}

export default Header
