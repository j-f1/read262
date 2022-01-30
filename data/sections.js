module.exports = async () => {
  const { spec, selectors } = await import('../util/spec-loader.mjs')
  const { selectAll, matches } = await import('hast-util-select')

  /** @type {{[key: string]: string;}} */
  const ids = Object.create(null)
  for (const child of selectAll('#spec-container [id]', spec)) {
    const segments = []
    let parent = child
    do {
      if (matches(selectors.clause, parent))
        segments.unshift(parent.properties.id.replace('sec-', ''))
      if (!parent.parent) break
      parent = parent.parent
    } while (parent.properties.id !== 'spec-container')

    const { id } = child.properties

    const permalink =
      '/' +
      (matches(selectors.clause, child) && segments.length < 2
        ? segments.slice(0, 2).join('/') + '/'
        : segments.slice(0, 2).join('/') + '/#' + id)

    if (permalink.startsWith('/grammar-summary')) {
      if (
        !ids[id] &&
        !id.startsWith('_ref') &&
        !id.startsWith('sec-') &&
        child.tagName !== 'emu-rhs'
      ) {
        console.warn(
          `Found ID #${id} (at ${permalink} in the grammar summary), but it’s not assigned anywhere else`
        )
        ids[child.properties.id] = permalink
      }
    } else if (!(id.startsWith('prod-') && child.tagName === 'emu-rhs')) {
      if (ids[id]) {
        console.warn(
          `Attempted to assign #${id} to ${permalink}, but it’s already assigned to ${ids[id]}`
        )
      }
      ids[id] = permalink
    }
  }

  return Object.fromEntries(
    Object.entries(ids).filter(([id]) => !id.startsWith('_'))
  )
}
