const { createElement } = require('eleventy-hast-jsx')

module.exports = () => (
  <form onSubmit={`(${onSubmit})(event)`}>
    <input type="text" placeholder="Paste tc39.es URL" />
    <button type="submit">Go</button>
    <script src="/all-sections.js" />
  </form>
)

function onSubmit(event) {
  const { value } = event.target.firstElementChild
  const id = value.startsWith('#')
    ? value.slice(1)
    : /https?:\/\/(tc39\.es|tc39\.github\.io)\/ecma262/.test(value)
    ? new URL(value).hash.slice(1)
    : value
  const result = __sections.find((x) => x[0] === id)
  if (result) {
    location.href = result[1]
  }
  event.preventDefault()
}
