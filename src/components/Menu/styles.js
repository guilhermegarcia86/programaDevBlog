import styled from 'styled-components';
import media from "styled-media-query"
import Img from "gatsby-image"

export const Menu = styled.nav`

  width: 100%;
  height: 94px;
  z-index: 100;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 2%;
  padding-right: 5%;

  background: var(--mediumBackground);
  border-bottom: 1px solid var(--borders);
  transition: background 0.5s;
  
  a {
    text-decoration: none;
    font-family: var(--titulo);
    color: var(--linkText);
    font-size: 50px;
  }

  strong {
    color: var(--strongText)
  }
  
`

export const Icon = styled(Img)`
  border-radius: 50%;
  height: 3.75rem;
  margin: auto;
  width: 3.75rem;

  ${media.lessThan("large")`
    height: 1.875rem;
    width: 1.875rem;
  `}
`