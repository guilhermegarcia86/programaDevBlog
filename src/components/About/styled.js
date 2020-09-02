import styled from 'styled-components'
import media from 'styled-media-query'
import Img from 'gatsby-image'


export const AboutList = styled.section`
  display: grid;
  grid-column-gap: 2.4rem;
  grid-row-gap: 2.4rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`

export const Image = styled(Img)`
  border-radius: 50%;
  height: 5.75rem;
  margin: auto;
  width: 5.75rem;

  ${media.lessThan('large')`
    height: 4.875rem;
    width: 4.875rem;
  `}
`

export const Title = styled.h1`

  color: var(--postColor);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.022em;
  line-height: 1.3em;

  ${media.greaterThan('medium')`
      font-size: 1rem;
  `}

  &:not(:first-child) {
    margin-top: 1.6rem;
  }

  &:not(:last-child) {
    margin-bottom: .4rem;
  }
`

export const Text = styled.p`
  color: var(--texts);
  font-size: 1em;
  letter-spacing: -0.04px;
  line-height: 1.3em;
`
