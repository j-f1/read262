import React from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'
import useMedia from 'use-media'
import GithubCorner from 'react-github-corner'

const Header = () => {
  const iconFits = useMedia('(min-width: 825px)')
  return (
    <header>
      <StaticQuery
        query={graphql`
          query GetSpecMeta {
            specMeta {
              title
              version
            }
          }
        `}
        render={({
          specMeta: { title, version },
        }: {
          specMeta: {
            title: string
            version: string
          }
        }) => (
          <div className="container">
            <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">
              <h1>{title}</h1>
              <h2>{version}</h2>
            </Link>
          </div>
        )}
      />
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
