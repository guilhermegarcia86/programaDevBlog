import React from "react"
import propTypes from "prop-types"
import * as Style from "./styles"
import getThemeColor from "utils/getThemeColor"

const RecommendedPosts = ({ next, previous }) => (
  <Style.RecommendedWrapper>
    {previous && (
      <Style.RecommendedLink to={previous.fields.slug}
        cover
        direction="left"
        bg={getThemeColor()}
        className="previous">
        {previous.frontmatter.title}
      </Style.RecommendedLink>
    )}
    {next && (
      <Style.RecommendedLink to={next.fields.slug}
        cover
        direction="right"
        bg={getThemeColor()}
        className="next">
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