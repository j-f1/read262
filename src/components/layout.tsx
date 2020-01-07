import React from 'react'

import 'firacode'
import 'typeface-merriweather'

import Header from './header'
import Footer from './footer'
import { OnlineProvider } from './is-online'
import { WrapperProps } from '../types'

import './globals.css'
import * as styles from './layout.module.css'
import cx from 'classnames'

export default function Layout({ children }: WrapperProps) {
  return (
    <OnlineProvider>
      <Header />
      <main className={cx(styles.main, styles.container)}>{children}</main>
      <Footer />
    </OnlineProvider>
  )
}
