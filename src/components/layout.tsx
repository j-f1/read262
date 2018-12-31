import React from 'react'

import Header from './header'
import './layout.css'
import Container from './container'
import Footer from './footer'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <Container style={{ paddingTop: 0 }}>{children}</Container>
    <Footer />
  </>
)

export default Layout
