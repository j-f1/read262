// @ts-check
// Based on https://github.com/mansona/html-extractor/blob/6979a4061b5a00cea1cf5ad2cefeab5bbe4c8e48/lib/algoliaHtmlExtractor.js

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { createHash } from 'node:crypto'
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
  /** @type {Record<'0' | '1' | '2' | '3' | '4' | '5', import('hast').Element | null>} */
  const currentHierarchy = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  }
  let currentPosition = 0 // Position of the DOM node in the tree
  let currentLvl = null // Current closest headings level
  let currentAnchor = null // Current closest anchor
  //
  // We select all nodes that match either the headings or the elements to
  // extract. This will allow us to loop over it in order it appears in the DOM
  for (const node of selectAll(
    `${options.headingSelector},${options.cssSelector}`,
    /** @type {import('hast').Root} */
    (parents(unified().use(rehypeParse).parse(input)))
  )) {
    // If it's a heading, we update our current hierarchy
    if (matches(options.headingSelector, node)) {
      // Which level heading is it?
      currentLvl = parseInt(node.tagName.slice(1), 10) - 1
      // Update this level, and set all the following ones to nil
      currentHierarchy[currentLvl] = node

      for (let i = currentLvl + 1; i < 6; i += 1) {
        currentHierarchy[i] = null
      }

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
      headings: Object.values(currentHierarchy).filter((h) => h),
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
