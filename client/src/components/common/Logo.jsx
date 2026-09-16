import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Logo({
  size = "md",
  iconOnly = false,
  linkTo = "/",
  priority = "eager",
  className = "",
  showText = false, // Full logo already contains "VENMA Buy. Sell. Grow Together."
  showTagline = false,
}) {
  const { darkMode } = useTheme();

  // Size map according to prompt specifications:
  // Navbar: 38-40px, Sidebar: 34px, Footer: 36px, Login: 64px, Hero: 100px
  const sizeMap = {
    xs: "h-7 w-auto",
    sm: "h-9 w-auto", // ~36px (Footer)
    navbar: "h-9 sm:h-10 w-auto", // 38-40px (Navbar)
    sidebar: "h-[34px] w-auto", // 34px (Sidebar)
    md: "h-10 sm:h-11 w-auto",
    lg: "h-14 sm:h-16 w-auto", // 56-64px (Login/Register)
    hero: "h-20 sm:h-24 w-auto", // 80-100px (Hero)
  };

  const currentHeight = sizeMap[size] || sizeMap.md;

  // Determine active asset
  const lightSrc = iconOnly ? "/branding/icon-light.png" : "/branding/logo-light.png";
  const darkSrc = iconOnly ? "/branding/icon-dark.png" : "/branding/logo-dark.png";
  const currentSrc = darkMode ? darkSrc : lightSrc;

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none relative ${className}`}>
      <img
        src={currentSrc}
        alt="VENMA"
        loading={priority}
        className={`${currentHeight} object-contain transition-opacity duration-200 ${
          darkMode ? "opacity-95 hover:opacity-100" : "opacity-100"
        } group-hover:scale-105 transition-transform`}
      />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black tracking-wider text-[#1C1C1E] dark:text-[#F8F7F5] text-2xl">
              VENMA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C67C4E] mb-1"></span>
          </div>
          {showTagline && (
            <span className="font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mt-0.5 text-[9px]">
              Buy. Sell. Grow Together.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="VENMA Home" className="group inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
