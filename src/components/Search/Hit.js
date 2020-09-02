import React from "react"
import PostItem from "components/PostItem"

const Hit = ({ hit }) => {

  return (<PostItem
    slug={hit.fields.slug}
    title={hit.title}
    date={hit.date}
    author={hit.author}
    description={hit.description}
    tags={hit.tags}
    timeToRead={hit.timeToRead}
  />)
}

export default Hit
