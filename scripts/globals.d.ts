declare module 'algolia-indexing' {
  import { EventEmitter } from 'node:events'
  export function fullAtomic(
    credentials: {
      apiKey: string
      appId: string
      indexName: string
    },
    userRecords: object[],
    userSettings?: object
  ): Promise<void>
  export function verbose(): void
  export function config(config: {
    batchMaxSize?: number
    batchMaxConcurrency?: number
  }): void
  export const pulse: EventEmitter
}
