import React from 'react'

import Header from './header'
import './layout.css'
import Container from './container'
import Footer from './footer'
import Search from './search'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <Container style={{ paddingTop: 0 }}>
      <Search />
      {children}
    </Container>
    <Footer />
  </>
)

export default Layout
