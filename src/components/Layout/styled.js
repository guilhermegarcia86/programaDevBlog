import styled from 'styled-components'
import media from 'styled-media-query'


export const LayoutMain = styled.main`
  background: var(--background);
  min-height: 100vh;
  padding-right: 2.5rem;
  transition: background 0.5s;
  width: 100%;

  body#grid & {
    grid-template-areas:
      "posts"
      "pagination";
  }

  ${media.lessThan("large")`
    padding: 4.125rem 0 3rem 0;
  `}
`

export const Layout = styled.section`
  background-color: var(--bg);
  display: block;
  will-change: background-color;
`

export const Main = styled.main.attrs({
  role: 'main',
})`
  min-height: 100vh;
  width: 100%;

  ${media.greaterThan('medium')`
  `}
`
