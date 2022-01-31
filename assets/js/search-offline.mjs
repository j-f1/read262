// import match from 'autosuggest-highlight/match'
// import parse from 'autosuggest-highlight/parse'
import workerize from './workerize.mjs'

// import SectionTitle from '../section-title'

// const Highlight = ({ text, query }) =>
//   parse(text, match(text, query)).map(({ text, highlight }, i) =>
//     highlight ? <mark key={i}>{text}</mark> : text
//   )

const worker = workerize(/* JS */ `
  importScripts(${JSON.stringify(
    new URL('/assets/js/lunr.min.js', location.href)
  )})

  const indexFile = ${JSON.stringify(
    new URL('/search-data.json', location.href)
  )}
  console.log('[WORKER] loading index from', indexFile)

  console.time('[WORKER] index loaded')
  const index = fetch(indexFile)
    .then(res => res.json())
    .then(lunr.Index.load)
    .finally(() => console.timeEnd('[WORKER] index loaded'))
    .catch(err => console.error('Loading index failed:', err))

  export async function search(query) {
    debugger
    return (await index).search(query)
      //.map(doc => ({ doc, score: score(tokens, doc, index._documents) }))
  }
`)

/** @type {HTMLInputElement} */
const search = document.getElementById('search-box')
const results = document.getElementById('search-results')

search.disabled = false
search.placeholder = 'Search here…'

let expando = 0
search.addEventListener('input', () => {
  const { value } = search

  if (value === '') {
    for (const child of [...results.children]) {
      child.remove()
    }
    return
  }

  const check = ++expando

  worker.search(value).then((results) => {
    if (check !== expando) return

    for (const child of [...results.children]) {
      child.remove()
    }

    for (const { doc } of results) {
      if (!doc) continue
      const strong = document.createElement('strong')
      strong.className = 'hit-title'
      strong.textContent = doc.title

      const a = document.createElement('a')
      a.href = doc.route
      a.className = 'search-hit'

      const li = document.createElement('li')
      li.appendChild(a)
    }
  })
})

// function Search({ value, onChange }) {
//   ;<strong className={styles.hitTitle}>
//     <SectionTitle
//       secnum={doc.secnum}
//       title={<Highlight text={doc.title} query={value} />}
//     />
//   </strong>
// }
