import React from "react"
import { graphql } from "gatsby"

import Layout from '../components/Layout'
import SEO from '../components/seo'
import RecommendedPosts from "../components/RecommendedPosts"
import Comments from "../components/Comments"

import * as Style from "../components/Post/styles"

const BlogPost = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const next = pageContext.nextPost
  const previous = pageContext.previousPost

  debugger
  console.log(post)
  console.log(post.frontmatter.title)

  return (
    <Layout>
      <SEO tittle={post.frontmatter.title} />
      <Style.PostHeader>
        <Style.PostDate>
          {post.frontmatter.date} • {post.timeToRead} min de leitura
        </Style.PostDate>
        <Style.PostTitle>{post.frontmatter.title}</Style.PostTitle>
        <Style.PostDescription>{post.frontmatter.description}</Style.PostDescription>
      </Style.PostHeader>
      <Style.MainContent>
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </Style.MainContent>
      <RecommendedPosts next={next} previous={previous} />
      <Comments url={post.fields.slug} title={post.frontmatter.title} />
    </Layout>
  )
}

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      frontmatter {
        title
        description
        date(locale: "pt-br", formatString: "DD [de] MMMM [de] YYYY")
      }
      html
      timeToRead
    }
  }
`

export default BlogPost