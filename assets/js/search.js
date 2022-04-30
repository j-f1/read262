// @ts-check
///<reference types="../vendor/global.js" />

const onLoad = () => {
  const searchClient = algoliasearch(
    '31SWLKOAHM',
    '530c361aee12e9f0e27938227e011277'
  )

  const search = instantsearch({
    indexName: 'main',
    searchClient: {
      ...searchClient,
      search(requests) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: true,
              query: '',
              params: null,
              processingTimeMS: 0,
            })),
          })
        }

        return searchClient.search(requests)
      },
    },
  })

  let timerId
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#search-box',
      placeholder: 'Search here…',
      showLoadingIndicator: true,
      queryHook(query, search) {
        clearTimeout(timerId)
        timerId = setTimeout(() => search(query), 250)
      },
    }),

    instantsearch.widgets.hits({
      container: '#search-results',
      templates: {
        item: (hit) => {
          const div = document.createElement('div')
          const highlight = (/** @type {keyof typeof hit} */ attribute) =>
            hit._highlightResult[attribute]
              ? instantsearch.highlight({
                  attribute,
                  hit,
                  highlightedTagName: 'mark',
                })
              : ((div.textContent = hit[attribute]), div.innerHTML)
          return `
          <a href="/${hit.route}" class="search-hit">
            <strong class="hit-title">
              <span className="secnum">${highlight('secnum')}</span>
              ${highlight('heading')}
            </strong>
            <p class="hit-content">
              ${highlight('content')}
            </p>
          </a>
        `
        },
      },
    }),
  ])

  search.start()

  document.getElementById('search-box-placeholder').remove()
}

if (
  typeof algoliasearch === 'function' &&
  typeof instantsearch === 'function'
) {
  onLoad()
} else {
  const interval = setInterval(() => {
    if (
      typeof algoliasearch === 'function' &&
      typeof instantsearch === 'function'
    ) {
      clearInterval(interval)
      onLoad()
    }
  }, 100)
}
