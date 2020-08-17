
import React from "react"
import PropTypes from "prop-types"
import { TransitionPortal } from "gatsby-plugin-transition-link"

import Menu from "../Menu"
import MenuBar from "../MenuBar"

import * as Style from "./styles"
import GlobalStyles from '../../styles/global'


const Layout = ({ children }) => {

  return (
    <Style.LayoutWrapper>
      <GlobalStyles />
      <TransitionPortal level="top">
        <Menu />
      </TransitionPortal>
      <Style.LayoutMain>{children}</Style.LayoutMain>
      <TransitionPortal level="top">
        <MenuBar />
      </TransitionPortal>
    </ Style.LayoutWrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
