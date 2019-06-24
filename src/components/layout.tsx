import React from 'react'

import Header from './header'
import './layout.css'
import Footer from './footer'
import Search from './search'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main style={{ paddingTop: 0 }}>
      <Search />
      {children}
    </main>
    <Footer />
  </>
)

export default Layout
