import { Link } from 'gatsby'
import React from 'react'

const Header = ({ siteTitle = '' }) => (
  <div
    style={{
      background: `#F0DB4F`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `#323330`,
            // source: https://github.com/voodootikigod/logo.js/blob/1544bdee/js.html#L21
            fontFamily: `Futura, Trebuchet MS, Arial, sans-serif`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
