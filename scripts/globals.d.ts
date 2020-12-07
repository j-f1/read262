declare module 'react-instantsearch-core' {
  export type HighlightResult<TDoc> = TDoc extends { [k: string]: any }
    ? { [K in keyof TDoc]?: HighlightResultField<TDoc[K]> }
    : never

  type HighlightResultField<TField> = TField extends Array<infer TItem>
    ? HighlightResultArray<TItem>
    : TField extends string
    ? HighlightResultPrimitive
    : HighlightResult<TField>

  type HighlightResultArray<TItem> = TItem extends string
    ? HighlightResultPrimitive[]
    : Array<HighlightResult<TItem>>

  interface HighlightResultPrimitive {
    /** the value of the facet highlighted (html) */
    value: string
    /** full, partial or none depending on how the query terms match */
    matchLevel: 'none' | 'partial' | 'full'
    matchedWords: string[]
    fullyHighlighted?: boolean
  }

  export interface BasicDoc {
    [k: string]: string
  }

  export type Hit<TDoc = BasicDoc> = TDoc & {
    objectID: string
    /**
     * Contains the searchable attributes within the document and shows which part of the
     * attribute was matched by the search terms.  Note that if the index has defined
     * any searchable attributes, this object will only contain those keys and others
     * will not exist.
     */
    _highlightResult: HighlightResult<TDoc>
  }

  export interface InstantSearchProps {
    searchClient: any
    indexName: string
    createURL?: (...args: any[]) => any
    searchState?: any
    refresh?: boolean
    onSearchStateChange?: (...args: any[]) => any
    onSearchParameters?: (...args: any[]) => any
    widgetsCollector?: (...args: any[]) => any
    resultsState?: any
    stalledSearchDelay?: number
  }

  /**
   * <InstantSearch> is the root component of all React InstantSearch implementations. It provides all the connected components (aka widgets) a means to interact with the searchState.
   *
   * https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/
   */
  export class InstantSearch extends React.Component<InstantSearchProps> {}
}

declare module 'react-instantsearch-dom' {
  import { InstantSearch, Hit, BasicDoc } from 'react-instantsearch-core'
  export { InstantSearch }

  interface CommonWidgetProps {
    /**
     * All static text rendered by widgets, such as “Load more”, “Show more” are translatable using the translations prop on relevant widgets.
     * This prop is a mapping of keys to translation values. Translation values can be either a String or a (...args: any[]) => any, as some take parameters.
     *
     * https://community.algolia.com/react-instantsearch/guide/i18n.html
     */
    translations?: {
      [key: string]: string | ((...args: any[]) => any)
    }
  }

  export interface SearchBoxProps extends CommonWidgetProps {
    focusShortcuts?: string[]
    autoFocus?: boolean
    defaultRefinement?: string
    searchAsYouType?: boolean
    showLoadingIndicator?: boolean

    submit?: JSX.Element
    reset?: JSX.Element
    loadingIndicator?: JSX.Element

    onSubmit?: (event: React.SyntheticEvent<HTMLFormElement>) => any
    onReset?: (event: React.SyntheticEvent<HTMLFormElement>) => any
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any
  }
  /**
   * The SearchBox component displays a search box that lets the user search for a specific query.
   *
   * https://community.algolia.com/react-instantsearch/widgets/SearchBox.html
   */
  export class SearchBox extends React.Component<SearchBoxProps> {}

  export interface HitsProps<T> {
    hitComponent?: React.ComponentType<{ hit: Hit<T> }>
  }
  export class Hits<T = BasicDoc> extends React.Component<HitsProps<T>> {}

  export class Highlight extends React.Component<any> {}
}
