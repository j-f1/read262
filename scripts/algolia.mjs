// @ts-check

import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import glob from 'glob'
import HtmlExtractor from './extract-html.mjs'
import algolia from 'algoliasearch'
import ora from 'ora'
import chunk from 'lodash.chunk'
import chalk from 'chalk'

import dotenv from 'dotenv'
dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
})
dotenv.config({
  path: fileURLToPath(new URL('../.env.public', import.meta.url)),
})

/** @typedef {import('./types').SearchRecord} SearchRecord */
/** @typedef {import('algoliasearch').SearchIndex} SearchIndex */
/** @typedef {import('algoliasearch').SearchClient} SearchClient */

if (!process.env.ALGOLIA_PUSH_KEY) {
  console.error('No ALGOLIA_PUSH_KEY specified')
  process.exit(1)
}

const extractor = new HtmlExtractor()

const siteDir = fileURLToPath(new URL('../public', import.meta.url))
const tty = !!process.stdout.isTTY
const spinner = ora()
try {
  spinner.start('Globbing')
  const matches = await promisify(glob)('**/*.html', { cwd: siteDir })

  /** @type {SearchRecord[]} */
  let records = []
  let i = 0
  let n = 0
  tty && (spinner.text = `Reading ${matches.length} files`)

  for (const filename of matches) {
    i++
    tty &&
      (spinner.text = chalk`Reading files ({bold ${String(
        Math.round((i / matches.length) * 100)
      )}%}) {gray ${filename}}`)
    if (filename.includes('404') || filename.includes('public/index.html'))
      continue
    n++
    const content = await fs.readFile(path.join(siteDir, filename), 'utf8')
    records = records.concat(
      extractor
        .run(content, {
          cssSelector:
            'p, emu-grammar, emu-clause>ul, emu-clause>ol, div>ul, div>ol',
        })
        .map((record) => {
          const heading = record.headings.slice(-1)[0]
          const secnum = heading && heading.querySelector('.secnum')
          return {
            objectID: record.objectID,
            route:
              filename
                .replace(/\\/g, '/')
                .replace(/^public/, '')
                .replace(/(\/index)?\.html$/, '') +
              (record.anchor ? `#${record.anchor}` : ''),
            content: record.content.replace(/\s+/g, ' ').trim(),
            heading: heading
              ? heading.textContent.replace(
                  secnum ? secnum.textContent : '',
                  ''
                )
              : undefined,
            secnum: secnum ? secnum.textContent : undefined,
          }
        })
    )
  }

  spinner.succeed(`Read ${records.length} records from ${n} files`)

  const client = algolia(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_PUSH_KEY
  )
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
  await indexToUse.waitTask((await indexToUse.clearObjects()).taskID)
  let done = 0
  const chunkJobs = chunk(records, 1000).map(async function (chunk) {
    const { taskIDs } = await indexToUse.saveObjects(chunk)
    done += chunk.length
    tty && (spinner.text = `Pushing records (${done}/${records.length})`)
    spinner.render()
    await Promise.all(taskIDs.map((id) => indexToUse.waitTask(id)))
  })
  await Promise.all(chunkJobs)
  spinner.succeed('Records pushed')

  if (mainIndexExists) {
    tty && spinner.start(chalk`Deploying updated index {bold ${indexName}}`)
    await moveIndex(client, tmpIndex, index)
    spinner.succeed(chalk`Deployed updated index {bold ${indexName}}`)
  }

  /** @param {SearchIndex} index */
  async function indexExists(index) {
    try {
      const { nbHits } = await index.search('')
      return nbHits > 0
    } catch (e) {
      console.log(e)
      return false
    }
  }
  /**
   * @param {SearchClient} client
   * @param {SearchIndex} sourceIndex
   * @param {SearchIndex} targetIndex
   */
  async function scopedCopyIndex(client, sourceIndex, targetIndex) {
    const { taskID } = await client.copyIndex(
      sourceIndex.indexName,
      targetIndex.indexName,
      { scope: ['settings', 'synonyms', 'rules'] }
    )
    return targetIndex.waitTask(taskID)
  }

  /**
   * @param {SearchClient} client
   * @param {SearchIndex} sourceIndex
   * @param {SearchIndex} targetIndex
   */
  async function moveIndex(client, sourceIndex, targetIndex) {
    const { taskID } = await client.moveIndex(
      sourceIndex.indexName,
      targetIndex.indexName
    )
    return targetIndex.waitTask(taskID)
  }
} catch (err) {
  spinner.fail('Error:')
  console.error(err)
  console.error(err.transporterStackTrace)
  process.exit(1)
}
