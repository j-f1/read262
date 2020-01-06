import React from 'react'
import { Link } from 'gatsby'

const Footer = () => (
  <footer>
    <div className="container">
      <a href="https://tc39.es/ecma262/">Spec content</a> © 2018 Ecma
      International (<Link to="/copyright-and-software-license">License</Link>)
      • Site © 2018 <a href="https://github.com/j-f1">Jed Fox</a> (
      <a href="https://github.com/j-f1/read262/blob/master/LICENSE">License</a>)
      • Built with <a href="https://www.gatsbyjs.org">Gatsby</a> •{' '}
      <a href="https://github.com/j-f1/read262">Contribute on GitHub</a>
    </div>
  </footer>
)
export default Footer
