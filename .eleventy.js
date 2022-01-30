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
  eleventyConfig.addPassthroughCopy('assets')

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
