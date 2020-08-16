import React from "react"
import PropTypes from "prop-types"
import ReactDisqusComments from "react-disqus-comments"

import * as Style from "./styles"

const Comments = ({ url, title }) => {
  const completeURL = `https://programadev.com.br${url}`

  return (
    <Style.CommentsWrapper>
      <Style.CommentsTitle>Comentários</Style.CommentsTitle>
      <ReactDisqusComments
        shortname="programadev"
        identifier={completeURL}
        title={title}
        url={completeURL}
      />
    </Style.CommentsWrapper>
  )
}

Comments.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default Comments