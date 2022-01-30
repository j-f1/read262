import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { JSDOM } from 'jsdom'

export const specURL = new URL('https://tc39.es/ecma262/')

export const selectors = {
  clause: 'emu-clause, emu-annex',
}

const cache = new URL('./cache.html', import.meta.url)
export const {
  window: { document },
} = new JSDOM(
  existsSync(cache)
    ? await fs.readFile(cache, 'utf8')
    : await fetch(specURL.toString()).then((res) => res.text())
)
