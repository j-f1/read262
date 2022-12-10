// @ts-check
// Based on https://github.com/mansona/html-extractor/blob/6979a4061b5a00cea1cf5ad2cefeab5bbe4c8e48/lib/algoliaHtmlExtractor.js

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { select, selectAll, matches } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { toHtml } from 'hast-util-to-html'
import { parents } from 'unist-util-parents'

const options = {
  cssSelector: 'p, emu-grammar, emu-clause>ul, emu-clause>ol, div>ul, div>ol',
  headingSelector: 'h1,h2,h3,h4,h5,h6',
  maxWeight: 100,
}

/** @param {string} input */
export function extract(input) {
  const items = []
  const currentHierarchy = []
  let currentPosition = 0 // Position of the DOM node in the tree
  let currentLvl = null // Current closest headings level
  let currentAnchor = null // Current closest anchor
  //
  // We select all nodes that match either the headings or the elements to
  // extract. This will allow us to loop over it in order it appears in the DOM
  for (const node of selectAll(
    `:any(${options.headingSelector},${options.cssSelector})`,
    /** @type {import('hast').Root} */
    (parents(select('article', unified().use(rehypeParse).parse(input))))
  )) {
    // If it's a heading, we update our current hierarchy
    if (matches(options.headingSelector, node)) {
      console.log(
        toString(node),
        parseInt(node.tagName.slice(1), 10) - 1 + countClauseNesting(node),
        currentHierarchy.map(toString)
      )
      currentHierarchy.length =
        parseInt(node.tagName.slice(1), 10) - 1 + countClauseNesting(node)
      // Update this level, and set all the following ones to nil
      currentHierarchy.push(node)

      // Update the anchor, if the new heading has one
      const newAnchor = extractAnchor(node)

      if (newAnchor) {
        currentAnchor = newAnchor
      }
      continue
    }

    const content = toString(node)

    // Stop if node is empty
    if (content.length === 0) {
      continue
    }

    const item = {
      html: toHtml(node),
      content,
      headings: Object.entries(currentHierarchy),
      anchor: currentAnchor,
      node,
      customRanking: {
        position: currentPosition,
        heading:
          options.maxWeight - (currentLvl == null ? 0 : (currentLvl + 1) * 10),
      },
    }
    items.push(item)

    currentPosition += 1
  }

  return items
}

function countClauseNesting(node) {
  if (node.parent.tagName === 'emu-clause') {
    return 1 + countClauseNesting(/** @type {any} */ (node).parent)
  }

  return 0
}

// Returns the anchor to the node
//
// eg.
// <h1 name="anchor">Foo</h1> => anchor
// <h1 id="anchor">Foo</h1> => anchor
// <h1><a name="anchor">Foo</a></h1> => anchor
/**
 * @param {import('hast').Element} node
 * @returns {string | null}
 */
function extractAnchor(node, _isParent = false) {
  const anchor = node.properties?.name || node.properties?.id || null

  if (anchor) {
    return String(anchor)
  }

  // No anchor found directly in the header, search on children
  const subelement = select('[name],[id]', node)

  if (subelement) {
    return extractAnchor(subelement)
  }

  if (!_isParent) {
    return extractAnchor(/** @type {any} */ (node).parent, true)
  }

  return null
}
