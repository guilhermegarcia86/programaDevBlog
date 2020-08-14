import React from 'react'
import PropTypes from "prop-types"
import * as Style from './styles'

const PostItem = ({
    slug,
    background,
    category,
    date,
    timeToRead,
    title,
    description,
}) => (
        <Style.PostItemLink to={slug}>
            <Style.PostItemWrapper>
                <Style.PostItemTag background={background}>{category}</Style.PostItemTag>
                <Style.PostItemInfo>
                    <Style.PostItemDate>
                        {date} • {timeToRead} min de leitura
        </Style.PostItemDate>
                    <Style.PostItemTitle>{title}</Style.PostItemTitle>
                    <Style.PostItemDescription>{description}</Style.PostItemDescription>
                </Style.PostItemInfo>
            </Style.PostItemWrapper>
        </Style.PostItemLink>
    )

PostItem.propTypes = {
    slug: PropTypes.string.isRequired,
    background: PropTypes.string,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    timeToRead: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
}

export default PostItem