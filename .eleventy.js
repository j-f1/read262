// @ts-check

process.on('unhandledRejection', (err) => {
  console.log(err)
})

/**
 * @type {(eleventyConfig: import("@11ty/eleventy/src/UserConfig")) => Partial<ReturnType<import("@11ty/eleventy/src/defaultConfig")>>}
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addGlobalData('layout', 'default.jsx')
  eleventyConfig.addPlugin(require('eleventy-hast-jsx').plugin)

  eleventyConfig.addPassthroughCopy('assets/css')
  eleventyConfig.addPassthroughCopy('assets/images')
  eleventyConfig.addPassthroughCopy('assets/js')
  eleventyConfig.addPassthroughCopy({
    'node_modules/algoliasearch/dist/algoliasearch-lite.esm.browser.js':
      'assets/vendor/algoliasearch.js',
    'node_modules/instantsearch.js/dist/': 'assets/vendor/instantsearch',
    'assets/root': '/',
  })

  eleventyConfig.addWatchTarget('assets')
  eleventyConfig.addWatchTarget('components')

  eleventyConfig.setQuietMode(true)

  return {
    markdownTemplateEngine: 'md',
    htmlTemplateEngine: 'html',
    dir: {
      input: 'pages',
      includes: '../includes',
      layouts: '../layouts',
      data: '../data',
      output: 'public',
    },
  }
}
