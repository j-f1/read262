const { createElement, Raw } = require('eleventy-hast-jsx')

const SectionTitle = require('../components/SectionTitle')
const PrevNext = require('../components/PrevNext')

exports.data = {
  pagination: {
    data: 'pages',
    size: 1,
    alias: 'section',
  },
  permalink: ({ section }) => section.permalink,
  eleventyComputed: {
    title: ({ section }) => section.title,
  },
}

exports.default = async ({ section, sections }) => {
  const { selectAll } = await import('hast-util-select')

  // force absolute URI
  section.content.forEach((p) =>
    selectAll('[href]', p).forEach((link) => {
      const href = link.properties.href
      if (href && href.startsWith('#')) {
        if (!sections[href.slice(1)]) {
          console.warn(`Warning! Unrecognized ID ${href.slice(1)}`)
          return
        }
        link.properties.href = sections[href.slice(1)]
      }
    })
  )

  return (
    <>
      <article>
        {section.content}
        {section.title === 'Colophon' ? (
          <>
            <h2>About read262</h2>
            <p>
              read262 was originally created using Gatsby, but was ported to{' '}
              <a href="https://11ty.dev">Eleventy</a> in early 2022. Some of
              read262’s CSS originated in the Gatsby blog starter I began the
              project with, while other CSS was copied over from the{' '}
              <code>ecmarkup</code> repository (see{' '}
              <code>src/templates/ecmarkup.css</code>), and the rest is my own.
            </p>
            <p>
              The fonts used on read262 are{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--sans)', fontWeight: 'bold' }}
              >
                Futura
              </a>
              ,{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--serif)', fontWeight: 800 }}
              >
                Merriweather
              </a>
              , and{' '}
              <a
                href="https://en.wikipedia.org/wiki/Futura_(typeface)"
                style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}
              >
                Fira<span style={{ fontFamily: 'var(--sans)' }}> </span>Code
              </a>
              . Search is provided by{' '}
              <a href="https://www.algolia.com">Algolia</a> when you’re online,
              and{' '}
              <a
                href="https://github.com/bvaughn/js-search"
                style={{ fontFamily: 'var(--mono)', fontWeight: 550 }}
              >
                js-search
              </a>{' '}
              when you’re offline. Everything is hosted on{' '}
              <a href="https://www.netlify.com">Netlify</a>, and{' '}
              <a href="https://zapier.com">Zapier</a> is used to automate
              deploys whenever the spec repo is updated (
              <a href="https://zapier.com/shared/7baef3f269fd297f91fbeae398a4dca8d370d1b7">
                here’s the Zap I use
              </a>
              ). The yellow color is copied from the JS logo.
            </p>
            <p>
              read262 supports Dark Mode automatically, and uses a service
              worker to enable offline support.
            </p>
          </>
        ) : null}
      </article>
      <PrevNext prev={section.prev} next={section.next} />
    </>
  )
}
