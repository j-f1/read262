import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'
import { parents } from 'unist-util-parents'

export const specURL = new URL('https://tc39.es/ecma262/')

export const selectors = {
  clause: 'emu-clause, emu-annex',
}

const cache = new URL('./cache.html', import.meta.url)
export const spec = parents(
  unified()
    .use(rehypeParse)
    .parse(
      existsSync(cache)
        ? await fs.readFile(cache, 'utf8')
        : await fetch(specURL.toString()).then((res) => res.text())
    )
)
