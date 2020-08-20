import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import * as Style from './styles'

import getThemeColor from "../../utils/getThemeColor"

const PostItem = ({
    slug,
    background,
    category,
    date,
    timeToRead,
    title,
    description,
    author,
    image,
}) => {

    const { avatarImage } = useStaticQuery(
        graphql`
          query {
            avatarImage: file(relativePath: { eq: "assets/img/camadas.png" }) {
              childImageSharp {
                fluid(maxWidth: 60) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
        `
      )


    return (
        <Style.PostItemLink to={slug}
            cover
            direction="right"
            bg={getThemeColor()}
            duration={0.6}>
            <Style.PostItemWrapper>
                <Style.PostImage fluid={avatarImage} />
                <Style.PostItemTag background={background}>{category}</Style.PostItemTag>
                <Style.PostItemInfo>
                    <Style.PostItemDate>
                        {date} • {timeToRead} min de leitura
        </Style.PostItemDate>
                    <Style.PostItemTitle>{title}</Style.PostItemTitle>
                    <Style.PostItemDescription>{description}</Style.PostItemDescription>
                    <Style.PostItemAuthor>{author}</Style.PostItemAuthor>
                </Style.PostItemInfo>
            </Style.PostItemWrapper>
        </Style.PostItemLink>
    )
}

PostItem.propTypes = {
    slug: PropTypes.string.isRequired,
    background: PropTypes.string,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    timeToRead: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
}

export default PostItem