const getThemeColor = () => {
    const theme = typeof window !== "undefined" && window.__theme
  
    if (theme === "light") return "#f0f0f3"
    if (theme === "dark") return "#0D0D0D"
  }
  
  export default getThemeColor
  