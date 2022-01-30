module.exports = async () => {
  const { document } = await import('../util/spec-loader.mjs')

  return {
    title: document.querySelector('h1.title').textContent,
    version: document.querySelector('h1.version').textContent,
  }
}
