import React from "react"
import propTypes from "prop-types"
import * as Style from "./styles"

const RecommendedPosts = ({ next, previous }) => (
  <Style.RecommendedWrapper>
    {previous && (
      <Style.RecommendedLink to={previous.fields.slug} className="previous">
        {previous.frontmatter.title}
      </Style.RecommendedLink>
    )}
    {next && (
      <Style.RecommendedLink to={next.fields.slug} className="next">
        {next.frontmatter.title}
      </Style.RecommendedLink>
    )}
  </Style.RecommendedWrapper>
)

RecommendedPosts.propTypes = {
  next: propTypes.shape({
    frontmatter: propTypes.shape({
      title: propTypes.string.isRequired,
    }),
    fields: propTypes.shape({
      slug: propTypes.string.isRequired,
    }),
  }),
  previous: propTypes.shape({
    frontmatter: propTypes.shape({
      title: propTypes.string.isRequired,
    }),
    fields: propTypes.shape({
      slug: propTypes.string.isRequired,
    }),
  }),
}

export default RecommendedPosts