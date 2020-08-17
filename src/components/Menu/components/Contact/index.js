import React from 'react';
import * as Style from './styles'

import getThemeColor from "../../../../utils/getThemeColor"

const Contact = () => (

    <Style.Contact to="/"
        cover
        direction="right"
        bg={getThemeColor()}
        duration={0.6}
        title="Voltar para Home">
        CONTATO
    </ Style.Contact>

)

export default Contact;