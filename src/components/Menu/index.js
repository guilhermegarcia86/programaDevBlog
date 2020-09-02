import React from 'react';
import AniLink from "gatsby-plugin-transition-link/AniLink"
import * as Style from './styles';

import getThemeColor from "utils/getThemeColor"

const Menu = () => {

    return (
        <Style.Menu id="menu">
            <AniLink to="/"
                cover
                direction="right"
                bg={getThemeColor()}
                duration={0.6}
                title="Voltar para Home">
                programa<strong>Dev</strong>
            </AniLink>
        </Style.Menu>
    );
}

export default Menu;