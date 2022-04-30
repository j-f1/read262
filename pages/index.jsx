const { createElement } = require('eleventy-hast-jsx')

function nestPages(pages) {
  const nestedPages = []
  for (const page of pages) {
    const lastPage = nestedPages[nestedPages.length - 1]
    if (lastPage && page.secnum.split('.')[0] === lastPage.secnum) {
      lastPage.children.push(page)
    } else {
      nestedPages.push(Object.assign({ children: [] }, page))
    }
  }
  return nestedPages
}

exports.default = ({ pages: flatPages }) => {
  const pages = nestPages(flatPages)
  const appendixIdx = pages.findIndex((p) => p.secnum[0] === 'A')
  const mainContent = pages.slice(1, appendixIdx)
  const appendix = pages.slice(appendixIdx)
  return (
    <>
      <link rel="stylesheet" href="/assets/css/toc.css" />
      <h3>
        <a href={pages[0].permalink}>{pages[0].title}</a>
      </h3>
      <h3>Main Content</h3>
      <ol class="toc-list">
        {mainContent.map(({ id, permalink, title, content, children }) => (
          <li key={id}>
            {content.length > 1 ? <a href={permalink}>{title}</a> : title}
            {children && children.length ? <PageList pages={children} /> : null}
          </li>
        ))}
      </ol>
      <h3>Appendix</h3>
      <ol class="toc-list appendix">
        {appendix.map(({ id, permalink, title, content, children }) => (
          <li key={id}>
            {content.length > 1 ? <a href={permalink}>{title}</a> : title}
            {children && children.length ? <PageList pages={children} /> : null}
          </li>
        ))}
      </ol>
    </>
  )
}

function PageList({ pages }) {
  return (
    <ol>
      {pages.map(({ id, permalink, title, content }) => (
        <li key={id}>
          {content.length > 1 ? <a href={permalink}>{title}</a> : title}
        </li>
      ))}
    </ol>
  )
}
