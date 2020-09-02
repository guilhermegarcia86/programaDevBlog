import React from "react"
import propTypes from "prop-types"
import AniLink from "gatsby-plugin-transition-link/AniLink"

import * as Style from "./styles"

import getThemeColor from "utils/getThemeColor"

const Pagination = ({
  isFirst,
  isLast,
  currentPage,
  numPages,
  prevPage,
  nextPage,
}) => (
    <Style.PaginationWrapper>
      {!isFirst && <AniLink to={prevPage}
        cover
        direction="left"
        bg={getThemeColor()}
        duration={0.6}>← página anterior</AniLink>}
      <p>
        {currentPage} de {numPages}
      </p>
      {!isLast && <AniLink to={nextPage}
        cover
        direction="right"
        bg={getThemeColor()}
        duration={0.6}>proxima página →</AniLink>}
    </Style.PaginationWrapper>
  )

Pagination.propTypes = {
  isFirst: propTypes.bool.isRequired,
  isLast: propTypes.bool.isRequired,
  currentPage: propTypes.number.isRequired,
  numPages: propTypes.number.isRequired,
  prevPage: propTypes.string,
  nextPage: propTypes.string,
}

export default Pagination