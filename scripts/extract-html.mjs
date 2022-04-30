// @ts-check
// Based on https://github.com/mansona/html-extractor/blob/6979a4061b5a00cea1cf5ad2cefeab5bbe4c8e48/lib/algoliaHtmlExtractor.js

import { JSDOM } from 'jsdom'
import { createHash } from 'node:crypto'

// Extract content from an HTML page in the form of items with associated
// headings data
export default class AlgoliaHTMLExtractor {
  defaultOptions(options) {
    return {
      cssSelector: 'p',
      headingSelector: 'h1,h2,h3,h4,h5,h6',
      tagsToExclude: '',
      ...options,
    }
  }

  // Getting a list of HTML nodes from an input and a CSS selector
  css(input, selector) {
    return new JSDOM(input).window.document.querySelectorAll(selector)
  }

  run(input, options = {}) {
    const runOptions = this.defaultOptions(options)
    const { headingSelector, cssSelector, tagsToExclude } = runOptions
    //
    const items = []
    const currentHierarchy = {
      lvl0: null,
      lvl1: null,
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
    }
    let currentPosition = 0 // Position of the DOM node in the tree
    let currentLvl = null // Current closest headings level
    let currentAnchor = null // Current closest anchor
    //
    // We select all nodes that match either the headings or the elements to
    // extract. This will allow us to loop over it in order it appears in the DOM
    this.css(input, `${headingSelector},${cssSelector}`).forEach((node) => {
      // If it's a heading, we update our current hierarchy
      if (node.matches(headingSelector)) {
        // Which level heading is it?
        currentLvl =
          parseInt(this.extractTagName(node).replace(/^h/, ''), 10) - 1
        // Update this level, and set all the following ones to nil
        currentHierarchy[`lvl${currentLvl}`] = node

        for (let i = currentLvl + 1; i < 6; i += 1) {
          currentHierarchy[`lvl${i}`] = null
        }

        // Update the anchor, if the new heading has one
        const newAnchor = this.extractAnchor(node)

        if (newAnchor) {
          currentAnchor = newAnchor
        }
      }

      // Stop if node is not to be extracted
      if (!node.matches(cssSelector)) {
        return
      }

      // Removing excluded child from the node
      if (tagsToExclude && tagsToExclude.length) {
        node.querySelectorAll(tagsToExclude).forEach((element) => {
          element.remove()
        })
      }

      const content = this.extractText(node)

      // Stop if node is empty
      if (content.length === 0) {
        return
      }

      const item = {
        html: this.extractHtml(node),
        content,
        headings: Object.values(currentHierarchy).filter((h) => h),
        anchor: currentAnchor,
        node,
        customRanking: {
          position: currentPosition,
          heading: this.headingWeight(currentLvl),
        },
      }

      item.objectID = this.uuid(item)
      items.push(item)

      currentPosition += 1
    })

    return items
  }

  // Returns the outer HTML of a given node
  //
  // eg.
  // <p>foo</p> => <p>foo</p>
  extractHtml(node) {
    return node.outerHTML.toString().trim()
  }

  // Returns the inner HTML of a given node
  //
  // eg.
  // <p>foo</p> => foo
  extractText(node) {
    return node.textContent
  }

  // Returns the tag name of a given node
  //
  // eg
  // <p>foo</p> => p
  extractTagName(node) {
    return node.tagName.toLowerCase()
  }

  // Returns the anchor to the node
  //
  // eg.
  // <h1 name="anchor">Foo</h1> => anchor
  // <h1 id="anchor">Foo</h1> => anchor
  // <h1><a name="anchor">Foo</a></h1> => anchor
  extractAnchor(node, _isParent = false) {
    const anchor = node.getAttribute('name') || node.getAttribute('id') || null

    if (anchor) {
      return anchor
    }

    // No anchor found directly in the header, search on children
    const subelement = node.querySelector('[name],[id]')

    if (subelement) {
      return this.extractAnchor(subelement)
    }

    if (!_isParent) {
      return this.extractAnchor(node.parentElement, true)
    }

    return null
  }

  // Generate a unique identifier for the item
  uuid(inputItem) {
    // We don't use the objectID as part of the hash algorithm
    const { objectID: _, ...item } = inputItem

    // We first get all the keys of the object, sorted alphabetically...
    const keys = Object.keys(item)
    keys.sort()

    // ...then we build a huge array of "key=value" pairs...
    const orderedArray = keys.map((key) => {
      let value = item[key]
      // We apply the method recursively on other hashes
      if (typeof value === 'object' && value != null) {
        value = this.uuid(value)
      }

      return `${key}=${value}`
    })

    // ...then we build a unique md5 hash of it
    return createHash('md5').update(orderedArray.join(',')).digest('hex')
  }

  // Get a relative numeric value of the importance of the heading
  // 100 for top level, then -10 per heading
  headingWeight(headingLevel) {
    const maxWeight = 100

    if (headingLevel === null || headingLevel === undefined) {
      return maxWeight
    }

    return maxWeight - (headingLevel + 1) * 10
  }
}
