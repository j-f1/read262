// TODO: use https://github.com/spencermountain/efrt to compress?
module.exports = {
  data: {
    layout: null,
    permalink: 'all-sections.js',
  },
  render: ({ sections }) => `window.__sections = ${JSON.stringify(sections)}`,
}
