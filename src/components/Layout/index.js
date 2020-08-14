
import React from "react"
import PropTypes from "prop-types"
import Menu from "../Menu"
import Footer from "../Footer"

const Layout = ({ children }) => {

  return (
    <>
      <Menu />
      <main>{children}</main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
