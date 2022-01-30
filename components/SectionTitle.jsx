const { createElement } = require('eleventy-hast-jsx')

module.exports = ({ title, secnum }) => (
  <>
    <span className="secnum">{secnum}</span>
    {secnum ? ' ' : ''}
    {title}
  </>
)
