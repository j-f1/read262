const { Raw } = require('eleventy-hast-jsx')
const Header = require('../components/Header')
const Footer = require('../components/Footer')

const description = 'Read the ECMAScript spec in your browser'

exports.default = async ({ title, layoutContent, meta, pages, eleventy }) => {
  const pageTitle = title ? `${title} | read262` : 'read262'

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{pageTitle}</title>
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
        <link rel="icon" href="/assets/images/logo-32.png" type="image/png" />
        <meta name="description" content={description} />
        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={description} />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:cardtwitter:creator" content="Jed Fox" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="generator" content={eleventy.generator} />
        <link
          rel="manifest"
          href="/manifest.webmanifest"
          crossorigin="anonymous"
        />
        <link href="/assets/css/globals.css" rel="stylesheet" />
        <link href="/assets/css/layout.css" rel="stylesheet" />
        <link href="/assets/css/search.css" rel="stylesheet" />
        <link href="/assets/css/tools.css" rel="stylesheet" />
        <link href="/assets/css/ecmarkup.css" rel="stylesheet" />
        <link href="/assets/css/content.css" rel="stylesheet" />
        <link href="/assets/fonts/merriweather/index.css" rel="stylesheet" />
        <link href="/assets/fonts/fira-code/fira_code.css" rel="stylesheet" />
        <script type="module" src="/assets/js/click-var.mjs" />
      </head>
      <body>
        <Header meta={meta} />
        <main class="container">
          <Raw html={layoutContent} />
        </main>
        {await (<Footer pages={pages} />)}
      </body>
    </html>
  )
}
