export type SpecPageMeta = Pick<SpecPage, 'route' | 'secnum' | 'title'>

interface BaseSpecPage {
  id: string
  route: string
  secnum: string
  title: string
  hasContent: boolean
  prev?: SpecPageMeta
  next?: SpecPageMeta
  internal: {
    type: 'SpecPage'
    mediaType: 'text/html'
    content: string
    contentDigest: string
  }
}
export interface SpecPage extends BaseSpecPage {
  children?: undefined
}
export interface NestedSpecPage extends BaseSpecPage {
  children: Array<SpecPage | NestedSpecPage>
}

export interface Edge<T> {
  node: T
}

export interface SearchRecord {
  objectID: string
  route: string
  content: string
  heading?: string
  secnum?: string
}
