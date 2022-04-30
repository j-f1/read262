const SectionTitle = require('./SectionTitle')

module.exports = ({ prev, next }) => (
  // adapted from https://github.com/gaearon/overreacted.io/blob/e1520ea8/src/templates/blog-post.js#L75-L98
  <ul class="prev-next">
    <li>
      {prev && (
        <a
          href={prev.permalink}
          rel="prev"
          aria-label={`Previous section (${prev.title})`}
        >
          <span class="prev-next-arrow" aria-hidden="true">
            {'<-'}
          </span>
          <SectionTitle {...prev} />
        </a>
      )}
    </li>
    <link rel="stylesheet" href="/assets/css/prev-next.css" />
    <li>
      {next && (
        <a
          href={next.permalink}
          rel="next"
          aria-label={`Next section (${next.title})`}
        >
          <SectionTitle {...next} />
          <span class="prev-next-arrow" aria-hidden="true">
            {'->'}
          </span>
        </a>
      )}
    </li>
  </ul>
)
