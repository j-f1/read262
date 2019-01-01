///<reference path="./types.d.ts" />

import fs from 'fs'
import path from 'path'

import glob from 'glob'
import HtmlExtractor from 'algolia-html-extractor'
import algolia from 'algoliasearch'
import ora from 'ora'
import chunk from 'lodash.chunk'
import chalk from 'chalk'

interface Record extends HtmlExtractor.Record {
  route: string
}

const extractor = new HtmlExtractor()
;(extractor as any).extractAnchor = function(
  node: HTMLElement,
  _isParent = false
) {
  const anchor = node.getAttribute('name') || node.getAttribute('id') || null

  if (anchor) {
    return anchor
  }

  // No anchor found directly in the header, search on children
  const subelement = node.querySelector('[name],[id]')

  if (subelement) {
    return this.extractAnchor(subelement)
  }

  // start mod
  if (!_isParent) return this.extractAnchor(node.parentElement, true)

  // end mod
  return null
}

const projectRoot = path.dirname(__dirname)
const matches = glob.sync('public/**/*.html', { cwd: projectRoot })
let records = new Array<Record>()

for (const filename of matches) {
  if (filename.includes('404') || filename.includes('public/index.html'))
    continue
  const content = fs.readFileSync(path.join(projectRoot, filename), 'utf8')
  records = records.concat(
    extractor.run(content, { cssSelector: 'p,li,emu-grammar' }).map(record => ({
      ...record,
      route:
        filename
          .replace(/\\/g, '/')
          .replace(/^public/, '')
          .replace(/(\/index)?\.html$/, '') +
        (record.anchor ? `#${record.anchor}` : ''),
      node: undefined,
    }))
  )
}

const spinner = ora('Initializing...')
const tty = !!process.stdout.isTTY
;(async () => {
  const client = algolia('31SWLKOAHM', process.env.ALGOLIA_PUSH_KEY!)
  const indexName = 'main'
  const backupName = `${indexName}_tmp`

  // Adapted from https://github.com/algolia/gatsby-plugin-algolia/blob/f50b7afe/gatsby-node.js
  const index = client.initIndex(indexName)
  const tmpIndex = client.initIndex(backupName)
  const mainIndexExists = await indexExists(index)
  const indexToUse = mainIndexExists ? tmpIndex : index

  if (mainIndexExists) {
    tty &&
      spinner.start(
        chalk`Copying index {bold ${indexName}} to {bold ${backupName}}`
      )
    await scopedCopyIndex(client, index, tmpIndex)
    spinner.succeed(
      chalk`Copied index {bold ${indexName}} to {bold ${backupName}}`
    )
  }

  tty && spinner.start('Pushing records')
  const chunkJobs = chunk(records, 1000).map(async function(chunk) {
    const { taskID } = await indexToUse.addObjects(chunk)
    return indexToUse.waitTask(taskID)
  })
  await Promise.all(chunkJobs)
  spinner.succeed('Records pushed')

  if (mainIndexExists) {
    tty && spinner.start(chalk`Deploying updated index {bold ${indexName}}`)
    await moveIndex(client, tmpIndex, index)
    spinner.succeed(chalk`Deployed updated index {bold ${indexName}}`)
  }

  async function indexExists(index: algolia.Index) {
    try {
      const { nbHits } = await index.search({})
      return nbHits > 0
    } catch (e) {
      return false
    }
  }
  async function scopedCopyIndex(
    client: algolia.Client,
    sourceIndex: algolia.Index,
    targetIndex: algolia.Index
  ) {
    const { taskID } = await client.copyIndex(
      sourceIndex.indexName,
      targetIndex.indexName,
      ['settings', 'synonyms', 'rules']
    )
    return targetIndex.waitTask(taskID)
  }
  async function moveIndex(
    client: algolia.Client,
    sourceIndex: algolia.Index,
    targetIndex: algolia.Index
  ) {
    const { taskID } = await client.moveIndex(
      sourceIndex.indexName,
      targetIndex.indexName
    )
    return targetIndex.waitTask(taskID)
  }
})().catch(err => {
  spinner.fail('Error:')
  console.error(err)
  return process.exit(1)
})
