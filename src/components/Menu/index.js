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
                        fixed(width: 60, height: 60) {
                            ...GatsbyImageSharpFixed_tracedSVG
                        }
                    }
                }
            }
        `
    )

    return (
        <Style.Menu>
            <Link to="/">
                <Img fixed={imageIcon.childImageSharp.fixed} />
            </Link>
            <Contact />
        </Style.Menu>
    );
}

export default Menu;