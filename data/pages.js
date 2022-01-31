const { URL } = require('node:url')

module.exports = async () => {
  const { spec, specURL, selectors } = await import('../util/spec-loader.mjs')
  const { select, selectAll, matches } = await import('hast-util-select')
  const { toString } = await import('hast-util-to-string')

  const nodes = []
  /** @param {import('hast').Element} clause */
  const buildPage = (clause, parentPermalink = '/', nest = true) => {
    const children = Array.from(
      clause.children.filter((c) => c.type === 'element')
    )
    const firstSubsection = children.findIndex((el) =>
      matches(selectors.clause, el)
    )
    const header = select('h1', clause)
    if (!header)
      throw new TypeError(
        'could not find header for section ' + toString(clause)
      )

    let secnum = select('.secnum', header)
    if (secnum) secnum = toString(secnum)
    else secnum = ''

    if (secnum === '2' || secnum == '17' || secnum === 'D') nest = false

    const content = children.slice(
      children.indexOf(header),
      !nest || firstSubsection === -1 ? undefined : firstSubsection
    )
    const id = clause.properties.id
    const permalink = parentPermalink + id.replace('sec-', '') + '/'

    for (const para of content) {
      // force absolute URI
      selectAll('object', para).forEach((object) => {
        object.properties.data = new URL(
          object.properties.data,
          specURL
        ).toString()
      })
      selectAll('img', para).forEach((img) => {
        img.properties.src = new URL(img.properties.src, specURL).toString()
      })
    }

    nodes.push({
      id,
      permalink,
      secnum,
      title: (secnum
        ? toString(header).replace(secnum, '')
        : toString(header) || ''
      ).trim(),
      content,
    })

    if (nest && firstSubsection !== -1) {
      for (const subclause of children.slice(firstSubsection)) {
        buildPage(subclause, permalink, false)
      }
    }
  }

  for (const clause of selectAll(
    '#spec-container > emu-intro, #spec-container > emu-clause, #spec-container > emu-annex',
    spec
  )) {
    buildPage(clause)
  }

  const findNode = (i, di) => {
    i += di
    while (nodes[i]) {
      if (nodes[i].content.length > 0) return nodes[i]
      i += di
    }
  }

  nodes.forEach((node, i) => {
    node.prev = findNode(i, -1)
    node.next = findNode(i, +1)
  })
  return nodes
}
