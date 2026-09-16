import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      (localStorage.getItem("venma_theme") || localStorage.getItem("markethub_theme")) === "dark" ||
      (!("venma_theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    // 1. DOM Theme Class
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("venma_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("venma_theme", "light");
    }

    // 2. Dynamic Favicon Switching
    const faviconHref = darkMode ? "/branding/favicon-dark.png" : "/branding/favicon-light.png";
    let linkFavicon = document.querySelector("link[rel*='icon']");
    if (!linkFavicon) {
      linkFavicon = document.createElement("link");
      linkFavicon.rel = "icon";
      document.head.appendChild(linkFavicon);
    }
    linkFavicon.type = "image/png";
    linkFavicon.href = faviconHref;

    // Apple touch icon
    let linkApple = document.querySelector("link[rel='apple-touch-icon']");
    if (!linkApple) {
      linkApple = document.createElement("link");
      linkApple.rel = "apple-touch-icon";
      document.head.appendChild(linkApple);
    }
    linkApple.href = faviconHref;

    // 3. Dynamic Browser Theme Color (<meta name="theme-color">)
    const themeColor = darkMode ? "#121212" : "#F7F5F2";
    let metaTheme = document.querySelector("meta[name='theme-color']");
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.name = "theme-color";
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = themeColor;
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
