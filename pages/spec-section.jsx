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
              <a href="https://11ty.dev">Eleventy</a> in 2022. Some of read262’s
              CSS originated in the Gatsby blog starter I began the project
              with, while other CSS was copied over from the{' '}
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
              <a href="https://www.algolia.com">Algolia</a>, and the site is
              hosted on GitHub Pages. <a href="https://zapier.com">Zapier</a> is
              used to automate deploys whenever the spec repo is updated. The
              yellow color is copied from the JS logo.
            </p>
            <p>read262 supports Dark Mode automatically.</p>
          </>
        ) : null}
      </article>
      <PrevNext prev={section.prev} next={section.next} />
    </>
  )
}
