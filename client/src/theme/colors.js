/**
 * VENMA Brand Design System - Color Tokens
 * Single Source of Truth - Charcoal + Copper Aesthetic
 */

export const colors = {
  // Primary Palette
  primary: {
    DEFAULT: "#1C1C1E", // Primary Charcoal
    hover: "#2A2A2E",
    light: "#3A3A40",
    dark: "#121212",
  },
  secondary: {
    DEFAULT: "#C67C4E", // Copper
    hover: "#A9653C",
    light: "#D8956A",
    dark: "#8F4E24",
  },
  accent: {
    DEFAULT: "#D4A24C", // Gold Accent
    hover: "#BA8B3B",
    light: "#E5BE73",
  },

  // Neutral Palette
  neutral: {
    light: {
      background: "#F7F5F2",
      card: "#FFFFFF",
      surface: "#EFEAE3",
      border: "#DDD6CE",
      text: "#1C1C1E",
      mutedText: "#6B6B70",
    },
    dark: {
      background: "#121212",
      card: "#1E1E20",
      surface: "#2B2B2F",
      border: "#3A3A40",
      text: "#F8F7F5",
      mutedText: "#A1A1AA",
    },
  },

  // Semantic
  semantic: {
    success: "#2E8B57",
    warning: "#D18F2C",
    error: "#C0392B",
    info: "#6C5CE7",
    pending: "#8E44AD",
  },

  // Gradients
  gradients: {
    brand: "linear-gradient(135deg, #1C1C1E 0%, #C67C4E 100%)",
    copper: "linear-gradient(135deg, #C67C4E 0%, #D4A24C 100%)",
    charcoal: "linear-gradient(135deg, #1C1C1E 0%, #2A2A2E 100%)",
  },
};

export default colors;
