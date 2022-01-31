const lunr = require('lunr')

module.exports = {
  data: {
    layout: null,
    permalink: 'search-data.json',
  },
  async render({ pages }) {
    const { toString } = await import('hast-util-to-string')
    const { remove } = await import('unist-util-remove')
    const docs = pages.flatMap(({ permalink, content }) =>
      handleClause(content, permalink, null)
    )

    return JSON.stringify(
      lunr(function () {
        this.field('title', { boost: 2 })
        this.field('content')
        this.ref('permalink')

        for (const doc of docs) {
          this.add(doc)
        }
      }).toJSON(),
      null,
      0
    )

    function handleClause(children, permalink, id) {
      const title = children.find((ch) => ch.tagName === 'h1')
      if (title < 0) console.log(children)

      return children.slice(children.indexOf(title) + 1).reduce(
        (acc, child) => {
          if (child.tagName === 'emu-clause') {
            acc.push(
              ...handleClause(child.children, permalink, child.properties.id)
            )
          } else if (
            child.tagName !== 'emu-grammar' &&
            child.tagName !== 'emu-production'
          ) {
            const text = toString(child)
              .replace(/\s{2,}/g, ' ')
              .trim()
            if (text) acc[0].content.push(text)
          }
          return acc
        },
        [
          {
            title: title.children[1]
              ? toString(title.children[1]).trim()
              : toString(title.children[0]),
            secnum: title.children[1] ? toString(title.children[0]) : '',
            permalink: permalink + (id ? '#' + id : ''),
            content: [],
          },
        ]
      )
    }
  },
}
