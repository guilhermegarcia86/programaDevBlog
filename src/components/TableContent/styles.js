import styled from "styled-components"
import media from "styled-media-query"

export const TableWrapper = styled.nav`
    position: fixed;
    top: 350px;
    width: 400px;
    display: block;
    flex-direction: column;
    padding: 0.75rem;
    margin: 0.75rem 0px;

    ${media.lessThan("large")`
        display: none !important;
  `}
`

export const Content = styled.ul`
    overflow: hidden auto;
    margin: 0.75rem;
`

export const Items = styled.li`
    font-size: 12px;
    line-height: 16px;
    padding-bottom: 8px;
`

export const LinkItem = styled.a`
    color: var(--texts);
    text-decoration: none;
`