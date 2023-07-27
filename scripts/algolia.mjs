// @ts-check
///<reference types="./globals.js" />

import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import { select } from 'hast-util-select'
import { glob } from 'glob'
import { extract } from './extract-html.mjs'
import ora from 'ora'
import chalk from 'chalk-template'
import { toString } from 'hast-util-to-string'
import indexing from 'algolia-indexing'

import dotenv from 'dotenv'
dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
})
dotenv.config({
  path: fileURLToPath(new URL('../.env.public', import.meta.url)),
})

indexing.verbose()

/** @typedef {import('./types').SearchRecord} SearchRecord */
/** @typedef {import('algoliasearch').SearchIndex} SearchIndex */
/** @typedef {import('algoliasearch').SearchClient} SearchClient */

if (!process.env.ALGOLIA_PUSH_KEY) {
  console.error('No ALGOLIA_PUSH_KEY specified')
  process.exit(1)
}

const siteDir = fileURLToPath(new URL('../public', import.meta.url))
const tty = !!process.stdout.isTTY
const spinner = ora()
try {
  spinner.start('Globbing')
  const matches = await promisify(glob)('**/*.html', {
    cwd: siteDir,
    ignore: ['index.html', '404.html', 'assets/**'],
  })

  /** @type {SearchRecord[]} */
  let records = []
  let i = 0
  let n = 0
  tty && (spinner.text = `Reading ${matches.length} files`)

  for (const filename of matches) {
    i++
    if (tty) {
      spinner.text = chalk`Reading pages ({bold ${String(
        Math.round((i / matches.length) * 100)
      )}%}) {gray ${filename.replace('/index.html', '')}}`
    }

    n++
    const content = await fs.readFile(path.join(siteDir, filename), 'utf8')
    let extracted = []
    try {
      extracted = extract(content)
    } catch (e) {
      spinner.fail(`Error extracting ${filename}`)
      console.error(e)
      continue
    }
    records = records.concat(
      extracted.map((record) => {
        const heading = record.headings.slice(-1)[0]
        const secnum = select('.secnum', heading)
        return {
          route:
            filename
              .replace(/\\/g, '/')
              .replace(/^public/, '')
              .replace(/(\/index)?\.html$/, '') +
            (record.anchor ? `#${record.anchor}` : ''),
          content: record.content.replace(/\s+/g, ' ').trim(),
          headings: record.headings.map(([k, v]) => [+k, v && toString(v)]),
          // heading: heading
          //   ? toString(heading).replace(secnum ? toString(secnum) : '', '')
          //   : undefined,
          secnum: secnum ? toString(secnum) : undefined,
        }
      })
    )
  }

  spinner.succeed(`Read ${records.length} records from ${n} files`)

  if (process.argv.includes('--dry-run')) {
    await fs.writeFile('records.json', JSON.stringify(records, null, 2))
    spinner.info('Dry run, wrote records.json')
  } else {
    await indexing.fullAtomic(
      {
        apiKey: process.env.ALGOLIA_PUSH_KEY,
        appId: process.env.ALGOLIA_APP_ID,
        indexName: 'main',
      },
      records
    )
  }
} catch (err) {
  spinner.fail('Error:')
  console.error(err)
  console.error(err.transporterStackTrace)
  process.exit(1)
}
