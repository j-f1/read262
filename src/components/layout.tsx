import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          {children}
          <footer>
            Spec content © 2018 Ecma International (
            <Link to="/copyright-and-software-license">License</Link>) • Site ©
            2018 <a href="https://github.com/j-f1">Jed Fox</a> (
            <a href="https://github.com/j-f1/read262/blob/master/LICENSE">
              License
            </a>
            ) • Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </>
    )}
  />
)

export default Layout
