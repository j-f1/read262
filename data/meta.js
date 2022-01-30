module.exports = async () => {
  const { spec } = await import('../util/spec-loader.mjs')
  const { select } = await import('hast-util-select')
  const { toString } = await import('hast-util-to-string')

  return {
    title: toString(select('h1.title', spec)),
    version: toString(select('h1.version', spec)),
  }
}
