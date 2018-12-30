export interface SitePage {
  id: string
  route: string
  secnum: string
  title: string
  hasContent: string
  children?: SitePage[]
  internal: {
    content: string
  }
}

export interface Edge<T> {
  node: T
}
