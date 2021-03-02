import React from 'react'
import { graphql } from 'gatsby'
import { DOMParser } from 'xmldom'

import Layout from 'components/Layout'
import SEO from 'components/Seo'

import RecommendedPosts from "components/RecommendedPosts"
import Comments from "components/Comments"

import TableContent from "components/TableContent"

import * as Style from "components/Post/styles"

const BlogPost = (props) => {
  const post = props.data.markdownRemark
  const next = props.pageContext.next
  const previous = props.pageContext.previous

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.image ? `https://programadev.com.br${post.frontmatter.image.publicURL}` : 'https://programadev.com.br/assets/og-image.jpg'}
      />
      <Style.PostHeader>
        <Style.PostImage fluid={post.frontmatter.image.childImageSharp.fluid} />
        <Style.PostDate>
          {post.frontmatter.date} • {post.timeToRead} min de leitura
        </Style.PostDate>
        <Style.PostTitle>{post.frontmatter.title}</Style.PostTitle>
        <Style.PostDescription>{post.frontmatter.description}</Style.PostDescription>
        <Style.PostAuthor>por {post.frontmatter.author}</Style.PostAuthor>
      </Style.PostHeader>
      {/* <TableContent listElements={getElements(post.html)} /> */}
      <Style.MainContent>
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </Style.MainContent>
      <RecommendedPosts next={next} previous={previous} />
      <Comments url={post.fields.slug} title={post.frontmatter.title} />
    </Layout>
  )
}

const getElements = (html) => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');

  return doc.getElementsByTagName('h2');

}

export default BlogPost

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
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
`
