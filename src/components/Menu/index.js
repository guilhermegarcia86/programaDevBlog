import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import './Menu.css';

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
        <nav className="Menu">
            <Link to="/">
                <Img fixed={imageIcon.childImageSharp.fixed} />
            </Link>
        </nav>
    );
}

export default Menu;