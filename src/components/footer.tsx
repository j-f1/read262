import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'

import * as styles from './layout.module.css'
import { GitHubIcon, TwitterIcon } from './icon'

export default function Footer() {
  const data = useStaticQuery(graphql`
    query CopyrightPage {
      site {
        meta: siteMetadata {
          copyright
        }
      }
      specPage(id: { eq: "page-sec-copyright-and-software-license" }) {
        internal {
          content
        }
      }
    }
  `)
  const copyright = data.specPage.internal.content.match(
    /<h2>Copyright Notice<\/h2><p>(.+?)<\/p>/
  )[1]
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <ul className={styles.footerContent}>
          <li>
            <a href="https://tc39.es/ecma262/">Spec content</a> {copyright} (
            <Link to="/copyright-and-software-license">BSD License</Link>)
          </li>
          <li>
            Site {data.site.meta.copyright}{' '}
            <a href="https://github.com/j-f1">
              <GitHubIcon>GitHub Profile</GitHubIcon>
            </a>{' '}
            <a href="https://twitter.com/jed_fox1">
              <TwitterIcon>TwitterProfile</TwitterIcon>
            </a>{' '}
            (
            <a href="https://github.com/j-f1/read262/blob/master/LICENSE">
              MIT License
            </a>
            )
          </li>
          <li>
            Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
          </li>
          <li>
            <a href="https://github.com/j-f1/read262">Contribute on GitHub</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
