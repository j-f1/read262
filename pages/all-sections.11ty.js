// TODO: use https://github.com/spencermountain/efrt to compress?
module.exports = {
  data: {
    layout: null,
    permalink: 'all-sections.js',
  },
  render: ({ sections }) => `
    window.__sections = ${JSON.stringify(Object.entries(sections))};
    sectionIDLookup.onsubmit = ${onSubmit};
    sectionIDLookup.querySelector('input').disabled = false;
    sectionIDLookup.querySelector('button').disabled = false;
  `,
}

function onSubmit(event) {
  const { value } = event.currentTarget.firstElementChild
  const id = value.startsWith('#')
    ? value.slice(1)
    : /https?:\/\/(tc39\.es|tc39\.github\.io)\/ecma262/.test(value)
    ? new URL(value).hash.slice(1)
    : value
  const result = __sections.find((x) => x[0] === id)
  if (result) location.href = result[1]
  event.preventDefault()
}
