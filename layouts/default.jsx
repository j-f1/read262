const { createElement, Raw } = require('eleventy-hast-jsx')
const Header = require('../components/Header')
const Footer = require('../components/Footer')

const description = 'Read the ECMAScript spec in your browser'

exports.default = ({ title, layoutContent, meta, pages }) => {
  const pageTitle = title ? `${title} | read262` : 'read262'

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="theme-color"
          content="#f0db4f"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#907f0c"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="description" content={description} />
        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={description} />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:cardtwitter:creator" content="Jed Fox" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <title>{pageTitle}</title>
        <meta name="theme-color" content="#f0db4f" />
        <meta name="generator" content="Eleventy 1.0.0" />
        <link href="/assets/css/globals.css" rel="stylesheet" />
        <link href="/assets/css/layout.css" rel="stylesheet" />
        <link href="/assets/css/search.css" rel="stylesheet" />
        <link href="/assets/css/tools.css" rel="stylesheet" />
      </head>
      <body>
        <Header meta={meta} />
        <main class="container">
          <Raw html={layoutContent} />
        </main>
        <Footer pages={pages} />
      </body>
    </html>
  )
}
