import React from 'react'

const Container: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = ({ style, ...props }) => (
  <section
    style={{
      margin: `0 auto`,
      maxWidth: 960,
      padding: `1.45rem 1.0875rem`,
      ...style,
    }}
    {...props}
  />
)

export default Container
