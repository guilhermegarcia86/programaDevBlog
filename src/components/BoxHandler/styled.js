import styled from 'styled-components'
import media from 'styled-media-query'


export const BoxHandler = styled.article`

  color: var(--primaryColor);
  display: block;
  height: 100%;
  min-height: 15rem;
  padding: 1.6rem;
  position: relative;
  will-change: border-color;
  margin-left: 1rem;

  ${media.greaterThan('medium')`
    padding: 2.4rem;
  `}
`
