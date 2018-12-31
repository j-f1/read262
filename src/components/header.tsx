import React from 'react'
import { Link, graphql, StaticQuery } from 'gatsby'
import { useMedia } from 'use-media'
import GithubCorner from 'react-github-corner'

import Container from './container'

const Header = () => {
  const iconFits = useMedia('(min-width: 825px)')
  return (
    <header
      style={{
        background: `#F0DB4F`,
        marginBottom: `1.45rem`,
      }}
    >
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
          <Container>
            <Link style={{ color: 'inherit', textDecoration: `none` }} to="/">
              <h1>{title}</h1>
              <h2>{version}</h2>
            </Link>
          </Container>
        )}
      />
      {iconFits && (
        <GithubCorner
          href="https://github.com/j-f1/read262"
          octoColor="#F0DB4F"
          bannerColor="#323330"
        />
      )}
    </header>
  )
}

export default Header
