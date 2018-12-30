import { Link, graphql, StaticQuery } from 'gatsby'
import React from 'react'
import Container from './container'

const Header = () => (
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
        specMeta: { title: string; version: string }
      }) => (
        <Container>
          <Link style={{ color: 'inherit', textDecoration: `none` }} to="/">
            <h1>{title}</h1>
            <h2>{version}</h2>
          </Link>
        </Container>
      )}
    />
  </header>
)

export default Header
