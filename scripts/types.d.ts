declare module 'algolia-html-extractor' {
  class AlgoliaHTMLExtractor {
    constructor()
    run(
      input: string,
      options?: AlgoliaHTMLExtractor.Options
    ): AlgoliaHTMLExtractor.Record[]
  }
  namespace AlgoliaHTMLExtractor {
    interface Options {
      cssSelector?: string
      headingSelector?: string
      tagsToExclude?: string
    }
    interface Record {
      // html: string
      content: string
      headings: string[]
      anchor: string
      // node: HTMLElement
      customRanking: {
        position: number
        heading: 100 | 90 | 80 | 70 | 60 | 50
      }
    }
  }
  export = AlgoliaHTMLExtractor
}
