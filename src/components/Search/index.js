import React from "react"

import { InstantSearch, SearchBox, Hits, Stats } from "react-instantsearch-dom"

import Hit from "./Hit"
import * as Style from "./styles"

const algolia = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  searchOnlyApiKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
}

const Search = () => (
  <Style.SearchWrapper>
    <InstantSearch
      appId={algolia.appId}
      apiKey={algolia.searchOnlyApiKey}
      indexName={algolia.indexName}
    >
      <SearchBox autoFocus translations={{ placeholder: "Pesquisar..." }} />
      <Stats
        translations={{
          stats(nbHits, timeSpentMs) {
            return `${nbHits} resultados encontrados em ${timeSpentMs}ms`
          },
        }}
      />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  </Style.SearchWrapper>
)

export default Search