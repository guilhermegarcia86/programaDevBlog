import React from 'react'

import * as Style from './styles'


const Details = ({ tags, author }) => {
    return (
        <Style.Details>
            <Style.Item key={author}>{author}</Style.Item>
            {tags.map((tag, i) => (
                <Style.Item key={i}>{tag}</Style.Item>
            ))}
        </Style.Details>
    )
}

export default Details