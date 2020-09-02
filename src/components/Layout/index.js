import React from 'react'
import PropTypes from 'prop-types'
import { TransitionPortal } from 'gatsby-plugin-transition-link'

import GlobalStyles from 'styles/global'
import Menu from "components/Menu"
import MenuBar from "components/MenuBar"

import * as Style from './styled'

const Layout = ({ children }) => {

  return (
    <Style.Layout>
      <GlobalStyles />
      <TransitionPortal level='top'>
        <Menu />
      </TransitionPortal>
      <Style.Main>
        <Style.LayoutMain>{children}</Style.LayoutMain>
      </Style.Main>
      <TransitionPortal level="top">
        <MenuBar />
      </TransitionPortal>
    </Style.Layout>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
