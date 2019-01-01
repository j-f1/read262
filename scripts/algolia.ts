///<reference path="./types.d.ts" />

import fs from 'fs'
import path from 'path'

import glob from 'glob'
import HtmlExtractor from 'algolia-html-extractor'
import algolia from 'algoliasearch'
import ora from 'ora'
import chunk from 'lodash.chunk'
import chalk from 'chalk'
import { promisify as p } from 'util'

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
const tty = !!process.stdout.isTTY
const spinner = ora()
;(async () => {
  spinner.start('Globbing')
  const matches = await p(glob)('public/**/*.html', { cwd: projectRoot })
  let records = new Array<Record>()
  let i = 0
  let n = 0
  spinner.text = `Reading ${matches.length} files`

  for (const filename of matches) {
    i++
    tty &&
      (spinner.text = chalk`Reading files ({bold ${String(
        Math.round((i / matches.length) * 100)
      )}%}) {gray ${filename}}`)
    if (filename.includes('404') || filename.includes('public/index.html'))
      continue
    n++
    const content = await p(fs.readFile)(
      path.join(projectRoot, filename),
      'utf8'
    )
    records = records.concat(
      extractor
        .run(content, {
          cssSelector:
            'p, emu-grammar, emu-clause>ul, emu-clause>ol, div>ul, div>ol',
        })
        .map(record => ({
          ...record,
          route:
            filename
              .replace(/\\/g, '/')
              .replace(/^public/, '')
              .replace(/(\/index)?\.html$/, '') +
            (record.anchor ? `#${record.anchor}` : ''),
          content: record.content.replace(/\s+/g, ' '),
          node: undefined,
          html: undefined,
        }))
    )
  }

  spinner.succeed(`Read ${records.length} records from ${n} files`)

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
  let done = 0
  const chunkJobs = chunk(records, 100).map(async function(chunk) {
    const { taskID } = await indexToUse.addObjects(chunk)
    done += chunk.length
    tty && (spinner.text = `Pushing records (${done}/${records.length})`)
    spinner.render()
    await indexToUse.waitTask(taskID)
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
