import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import Layout from 'components/Layout'
import SEO from 'components/Seo'
import About from 'components/About'

const aboutJsonQuery = graphql`
  query {
    allAboutJson {
      edges {
        node {
          id,
          nome
          descricao
          links {
            label
            url
          }
          imageSrc {
            relativePath
          }
        }
      }
    }
  }
`

const AboutPage = () => {
  const data = useStaticQuery(aboutJsonQuery)
  
  return (
    <Layout>
      <SEO title="About" description="About us" />
      <About content={data.allAboutJson.edges} />
    </Layout>
  )
}

export default AboutPage
