/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1C1C1E",
          hover: "#2A2A2E",
          light: "#3A3A40",
          dark: "#121212",
          50: "#F7F5F2",
          100: "#EFEAE3",
          200: "#DDD6CE",
          800: "#2A2A2E",
          900: "#1C1C1E",
          950: "#121212",
        },
        copper: {
          DEFAULT: "#C67C4E",
          hover: "#A9653C",
          light: "#D8956A",
          dark: "#8F4E24",
          50: "#FDF8F5",
          100: "#F8ECE3",
          200: "#EED7C7",
          300: "#E0BDA5",
          400: "#D39D79",
          500: "#C67C4E",
          600: "#A9653C",
          700: "#8F4E24",
        },
        gold: {
          DEFAULT: "#D4A24C",
          hover: "#BA8B3B",
          light: "#E5BE73",
          50: "#FCF9EE",
          100: "#F7EFCF",
          500: "#D4A24C",
          600: "#BA8B3B",
        },
        venma: {
          50: "#FDF8F5",
          100: "#F8ECE3",
          200: "#EED7C7",
          300: "#E0BDA5",
          400: "#D39D79",
          500: "#C67C4E", // Copper
          600: "#A9653C", // Copper hover
          700: "#8F4E24",
          800: "#2A2A2E",
          900: "#1C1C1E", // Primary Charcoal
        },
        navy: {
          DEFAULT: "#1C1C1E",
          hover: "#2A2A2E",
          light: "#3A3A40",
          dark: "#121212",
          800: "#2A2A2E",
          900: "#1C1C1E",
          950: "#121212",
        },
        emerald: {
          DEFAULT: "#C67C4E",
          hover: "#A9653C",
          50: "#FDF8F5",
          100: "#F8ECE3",
          500: "#C67C4E",
          600: "#A9653C",
          700: "#8F4E24",
        },
        teal: {
          DEFAULT: "#D4A24C",
          50: "#FCF9EE",
          500: "#D4A24C",
          600: "#BA8B3B",
        },
        primary: {
          DEFAULT: "#1C1C1E",
          hover: "#2A2A2E",
          50: "#F7F5F2",
          100: "#EFEAE3",
          500: "#2A2A2E",
          600: "#1C1C1E",
          700: "#121212",
        },
        surface: {
          DEFAULT: "#F7F5F2",
          dark: "#121212",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1E1E20",
        }
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #1C1C1E 0%, #C67C4E 100%)",
        "gradient-copper": "linear-gradient(135deg, #C67C4E 0%, #D4A24C 100%)",
        "gradient-ocean": "linear-gradient(135deg, #1C1C1E 0%, #C67C4E 100%)",
        "gradient-emerald": "linear-gradient(135deg, #C67C4E 0%, #D4A24C 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "soft": "0 4px 20px -2px rgba(28, 28, 30, 0.05)",
        "card": "0 10px 30px rgba(28, 28, 30, 0.08)",
        "hover": "0 14px 35px -5px rgba(198, 124, 78, 0.15), 0 10px 10px -5px rgba(28, 28, 30, 0.04)",
      },
      borderRadius: {
        "card": "20px",
        "form": "16px",
      }
    },
  },
  plugins: [],
};
