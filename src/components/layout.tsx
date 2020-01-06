import React from 'react'

import 'firacode'
import 'typeface-merriweather'

import Header from './header'
import './layout.css'
import Footer from './footer'
import { OnlineProvider } from './is-online'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <OnlineProvider>
    <Header />
    <main style={{ paddingTop: 0 }}>{children}</main>
    <Footer />
  </OnlineProvider>
)

export default Layout
