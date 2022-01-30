const { URL } = require('node:url')

module.exports = async () => {
  const { document, specURL, selectors } = await import(
    '../util/spec-loader.mjs'
  )

  const nodes = []
  const buildPage = (clause, parentPermalink = '/', nest = true) => {
    const children = Array.from(clause.children)
    const firstSubsection = children.findIndex((el) =>
      el.matches(selectors.clause)
    )
    const header = clause.querySelector('h1')
    if (!header)
      throw new TypeError(
        'could not find header for section ' + clause.innerHTML
      )

    const secnum = header.querySelector('.secnum')
    if (secnum?.textContent === '2') nest = false

    const content = children.slice(
      children.indexOf(header) + 1,
      !nest || firstSubsection === -1 ? undefined : firstSubsection
    )
    const id = clause.id
    const permalink = parentPermalink + id.replace('sec-', '') + '/'

    for (const para of content) {
      // force absolute URI
      para.querySelectorAll('object').forEach((object) => {
        object.data = new URL(object.data, specURL).toString()
      })
      para.querySelectorAll('img').forEach((img) => {
        img.src = new URL(img.src, specURL).toString()
      })
      para.querySelectorAll('[href]').forEach((link) => {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          // if (!ids[href.slice(1)]) {
          //   console.warn(`Warning! Unrecognized ID ${href.slice(1)}`)
          //   return
          // }
          // link.setAttribute('href', ids[href.slice(1)])
        }
      })
    }

    const html = content.map((el) => el.outerHTML).join('')
    nodes.push({
      id,
      permalink,
      secnum: secnum && secnum.textContent ? secnum.textContent : '',
      title: (secnum
        ? (header.textContent || '').replace(secnum.textContent || '', '')
        : header.textContent || ''
      ).trim(),
      hasContent: html !== '',
      content: html,
    })

    if (nest && firstSubsection !== -1) {
      for (const subclause of children.slice(firstSubsection)) {
        buildPage(subclause, permalink, false)
      }
    }
  }

  for (const clause of Array.from(
    document.querySelectorAll(
      '#spec-container > emu-intro, #spec-container > emu-clause, #spec-container > emu-annex'
    )
  )) {
    buildPage(clause)
  }

  const findNode = (i, di) => {
    i += di
    while (nodes[i]) {
      if (nodes[i].hasContent) return nodes[i]
      i += di
    }
  }

  nodes.forEach((node, i) => {
    node.prev = findNode(i, -1)
    node.next = findNode(i, +1)
  })
  return nodes
}
