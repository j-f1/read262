type Options = {
  type?: 'classic' | 'module'
  credentials?: 'omit' | 'same-origin' | 'include'
  name?: string
}

type Asyncify<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => Promise<R>
  : never

type Workerize = <T extends Record<string, Function>>(
  code: string,
  options?: Options
) => {
  [K in keyof T]: Asyncify<T[K]>
}

const workerize: Workerize = require('workerize').default

export default workerize
