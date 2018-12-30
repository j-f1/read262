import React from 'react'
import { Link } from 'gatsby'

import Header from './header'
import './layout.css'
import Container from './container'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <Container
      style={{
        paddingTop: 0,
      }}
    >
      {children}
      <footer>
        <a href="https://tc39.github.io/ecma262">Spec content</a> © 2018 Ecma
        International (<Link to="/copyright-and-software-license">License</Link>
        ) • Site © 2018 <a href="https://github.com/j-f1">Jed Fox</a> (
        <a href="https://github.com/j-f1/read262/blob/master/LICENSE">
          License
        </a>
        ) • Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
        {process.env.NODE_ENV === 'development' && (
          <>
            {' '}
            • <a href="/___graphql">GraphQL Explorer</a>
          </>
        )}
      </footer>
    </Container>
  </>
)

export default Layout
