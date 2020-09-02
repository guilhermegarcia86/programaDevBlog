import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'

import BoxHandler from 'components/BoxHandler'
import SocialLinks from 'components/SocialLinks'

import * as S from './styled'


const AboutImg = ({ imageSrc }) => {
  const { images } = useStaticQuery(
    graphql`
      query {
        images: allFile(filter: { sourceInstanceName: { eq: "about" } }) {
          edges {
            node {
              extension
              relativePath
              childImageSharp {
                fluid(maxWidth: 300) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `
  )

  const image = images.edges.find(image => {
    return image.node.relativePath === imageSrc.relativePath
  })

  return <S.Image fluid={image.node.childImageSharp.fluid} />
}

const About = ({ content }) => {
  return (
    <S.AboutList>
      {content.map(({ node }) => {
        return (
          <BoxHandler>
            <AboutImg imageSrc={node.imageSrc} />
            {node.links && <SocialLinks links={node.links} />}
            <S.Title>{node.nome}</S.Title>
            <S.Text>{node.descricao}</S.Text>
          </BoxHandler>
        )
      })}
    </S.AboutList>
  )
}

About.propTypes = {
  children: PropTypes.node.isRequired
}

export default About
