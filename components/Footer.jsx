const { readFileSync } = require('node:fs')
const { createElement } = require('eleventy-hast-jsx')

const { GitHubIcon, TwitterIcon } = require('./Icon')

module.exports = ({ pages }) => {
  const copyright = pages
    .find((p) => p.id === 'sec-copyright-and-software-license')
    .content.match(/<h2>Copyright Notice<\/h2><p>(.+?)<\/p>/)[1]
  return (
    <footer>
      <div class="container">
        <ul class="footer-content">
          <li>
            <a href="https://tc39.es/ecma262/">Spec content</a> {copyright} (
            <a href="/copyright-and-software-license">BSD License</a>)
          </li>
          <li>
            Site{' '}
            {readFileSync(require.resolve('../LICENSE'), 'utf8')
              .split('\n')[2]
              .split(' ')
              .slice(1, -2)
              .join(' ')}{' '}
            <a href="https://jedfox.com">Jed Fox</a>{' '}
            <a href="https://github.com/j-f1">
              <GitHubIcon>GitHub Profile</GitHubIcon>
            </a>{' '}
            <a href="https://twitter.com/jed_fox1">
              <TwitterIcon>Twitter Profile</TwitterIcon>
            </a>{' '}
            (
            <a href="https://github.com/j-f1/read262/blob/master/LICENSE">
              MIT License
            </a>
            )
          </li>
          <li>
            Built with <a href="https://www.gatsbyjs.com">Gatsby</a>
          </li>
          <li>
            <a href="https://github.com/j-f1/read262">Contribute on GitHub</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
