const { readFileSync } = require('node:fs')

const { GitHubIcon, TwitterIcon } = require('./Icon')

const siteCopyright = readFileSync(require.resolve('../LICENSE'), 'utf8')
  .split('\n')[2]
  .split(' ')
  .slice(1, -2)
  .join(' ')

module.exports = async ({ pages }) => {
  const { select } = await import('hast-util-select')
  const { toString } = await import('hast-util-to-string')
  const copyright = toString(
    select(
      'h2 + p',
      <div>
        {
          pages.find((p) => p.id === 'sec-copyright-and-software-license')
            .content
        }
      </div>
    )
  )
  return (
    <footer>
      <div class="container">
        <ul class="footer-content">
          <li>
            <a href="https://tc39.es/ecma262/">Spec content</a> {copyright} (
            <a href="/copyright-and-software-license">BSD License</a>)
          </li>
          <li>
            Site {siteCopyright} <a href="https://jedfox.com">Jed Fox</a>{' '}
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
