import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import useMedia from 'use-media'
import GithubCorner from 'react-github-corner'
import Tools from './tools'
import * as styles from './layout.module.css'

export default function Header() {
  const iconFits = useMedia('(min-width: 825px)')
  const {
    specMeta: { title, version },
  }: {
    specMeta: { title: string; version: string }
  } = useStaticQuery(graphql`
    query GetSpecMeta {
      specMeta {
        title
        version
      }
    }
  `)
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.homeLink} to="/">
          <h1 className={styles.mainTitle}>{title}</h1>
          <h2 className={styles.subtitle}>{version}</h2>
        </Link>
        <Tools />
      </div>
      {iconFits && (
        <GithubCorner
          href="https://github.com/j-f1/read262"
          octoColor="var(--yellow)"
          bannerColor="var(--black)"
        />
      )}
    </header>
  )
}
