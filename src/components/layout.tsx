import React from 'react'

import 'firacode'
import 'typeface-merriweather'

import Header from './header'
import './layout.css'
import Footer from './footer'
import { OnlineProvider } from './is-online'
import { WrapperProps } from '../types'

export default function Layout({ children }: WrapperProps) {
  return (
    <OnlineProvider>
      <Header />
      <main style={{ paddingTop: 0 }}>{children}</main>
      <Footer />
    </OnlineProvider>
  )
}
