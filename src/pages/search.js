import React from "react"

import Layout from "components/Layout"
import SEO from "components/Seo"
import Search from "components/Search"

const SearchPage = () => (
  <Layout>
    <SEO title="Search" />
    <Search />
  </Layout>
)

export default SearchPage