
import React from "react"
import PropTypes from "prop-types"
import Menu from "../Menu"
import Footer from "../Footer"
import GlobalStyles from '../../styles/global'

const Layout = ({ children }) => {

  return (
    <div id="root">
      <GlobalStyles />
      <Menu />
      <main>{children}</main>
      <Footer />
    </ div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
