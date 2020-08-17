import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import Contact from './components/Contact'
import * as Style from './styles';

const Menu = () => {

    const { imageIcon } = useStaticQuery(
        graphql`
            query {
                imageIcon: file(relativePath: { eq: "gatsby-icon.png"}) {
                    childImageSharp {
                        fluid(maxWidth: 60) {
                            ...GatsbyImageSharpFluid_tracedSVG
                        }
                    }
                }
            }
        `
    )

    return (
        <Style.Menu>
            <Link to="/">
                <Style.Icon fluid={imageIcon.childImageSharp.fluid} />
            </Link>
            <Contact />
        </Style.Menu>
    );
}

export default Menu;