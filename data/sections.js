module.exports = async () => {
  const { document, selectors } = await import('../util/spec-loader.mjs')

  /** @type {{[key: string]: string;}} */
  const ids = Object.create(null)
  for (const child of Array.from(
    document.querySelectorAll('#spec-container [id]')
  )) {
    const segments = []
    let parent = child
    do {
      if (parent.matches(selectors.clause))
        segments.unshift(parent.id.replace('sec-', ''))
      if (!parent.parentElement) break
      parent = parent.parentElement
    } while (parent.id !== 'spec-container')

    const permalink =
      '/' +
      (child.matches(selectors.clause) && segments.length < 2
        ? segments.slice(0, 2).join('/') + '/'
        : segments.slice(0, 2).join('/') + '/#' + child.id)

    if (permalink.startsWith('/grammar-summary')) {
      if (
        !ids[child.id] &&
        !child.id.startsWith('_ref') &&
        !child.id.startsWith('sec-')
      ) {
        console.warn(
          `Found ID #${child.id} (at ${permalink} in the grammar summary), but it’s not assigned anywhere else`
        )
        ids[child.id] = permalink
      }
    } else {
      if (ids[child.id]) {
        console.warn(
          `Attempted to assign #${
            child.id
          } to ${permalink}, but it’s already assigned to ${ids[child.id]}`
        )
      }
      ids[child.id] = permalink
    }
  }

  return Object.entries(ids).filter(([id]) => !id.startsWith('_'))
}
