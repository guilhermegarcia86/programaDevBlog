import React, { useState, useEffect } from "react"

import { Home } from "@styled-icons/boxicons-regular/Home"
import { SearchAlt2 as Search } from "@styled-icons/boxicons-regular/SearchAlt2"
import { UpArrowAlt as Arrow } from "@styled-icons/boxicons-regular/UpArrowAlt"
import { LightBulb as Light } from "@styled-icons/entypo/LightBulb"

import getThemeColor from "../../utils/getThemeColor"

import * as Style from "./styles"

const MenuBar = () => {
  const [theme, setTheme] = useState(null)

  const isDarkMode = theme === "dark"

  useEffect(() => {
    setTheme(window.__theme)

    window.__onThemeChange = () => setTheme(window.__theme)
  }, [])

  return (
    <Style.MenuBarWrapper>
      <Style.MenuBarGroup>
        <Style.MenuBarLink
          to="/"
          cover
          direction="right"
          bg={getThemeColor()}
          duration={0.6}
          title="Voltar para Home"
        >
          <Style.MenuBarItem>
            <Home />
          </Style.MenuBarItem>
        </Style.MenuBarLink>
        <Style.MenuBarLink
          to="/search/"
          cover
          direction="right"
          bg={getThemeColor()}
          duration={0.6}
          title="Pesquisar"
        >
          <Style.MenuBarItem>
            <Search />
          </Style.MenuBarItem>
        </Style.MenuBarLink>

        <Style.MenuBarItem
          title="Mudar o tema"
          onClick={() => {
            window.__setPreferredTheme(isDarkMode ? "light" : "dark")
          }}
          className={theme}
        >
          <Light />
        </Style.MenuBarItem>
      </Style.MenuBarGroup>
      <Style.MenuBarGroup>
        <Style.MenuBarItem title="Ir para o Topo">
          <Arrow />
        </Style.MenuBarItem>
      </Style.MenuBarGroup>
    </Style.MenuBarWrapper>
  )
}

export default MenuBar
