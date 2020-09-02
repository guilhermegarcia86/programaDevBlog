import React from 'react'
import { graphql } from 'gatsby'

import Layout from 'components/Layout'
import SEO from 'components/Seo'
import Pagination from 'components/Pagination'

import PostItem from 'components/PostItem'

const BlogList = (props) => {
  const { currentPage, numPages } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}`
  const nextPage = `/page/${currentPage + 1}`

  const list = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title='Blog' />
      {list.map(({ node }, i) => (
        <PostItem
          key={i}
          slug={node.fields.slug}
          date={node.frontmatter.date}
          title={node.frontmatter.title}
          description={node.frontmatter.description}
          tags={node.frontmatter.tags}
          timeToRead={node.timeToRead}
          image={node.frontmatter.image}
          author={node.frontmatter.author}
        />
      ))}
      <Pagination
        currentPage={currentPage}
        numPages={numPages}
        isFirst={isFirst}
        isLast={isLast}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </Layout>
  )
}

export const BlogListQuery = graphql`
  query BlogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(locale: "pt-br", formatString: "DD MMM[,] YYYY")
            description
            title
            tags
            author
            image {
              id
              publicURL
              childImageSharp {
                fluid(maxWidth: 1280, quality: 60) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          timeToRead
        }
      }
    }
  }
`

export default BlogList
