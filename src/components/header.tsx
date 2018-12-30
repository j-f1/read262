import { Link } from 'gatsby'
import React from 'react'
import Container from './container'

const Header = ({ siteTitle = '' }) => (
  <header
    style={{
      background: `#F0DB4F`,
      marginBottom: `1.45rem`,
    }}
  >
    <Container>
      <Link to="/">
        <h1>{siteTitle}</h1>
      </Link>
    </Container>
  </header>
)

export default Header
