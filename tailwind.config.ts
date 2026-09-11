import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FFFFFF",
          subtle: "#F6F5F3",
        },
        surface: "#FFFFFF",
        charcoal: {
          DEFAULT: "#1A1A1A",
          muted: "#70706B",
        },
        sage: {
          DEFAULT: "#5B7C5E",
          hover: "#4A684D",
          dark: "#3D5740",
          light: "#EBF2EC",
        },
        border: {
          DEFAULT: "#E5E4E0",
          subtle: "#EEEEEC",
        },
        clay: {
          DEFAULT: "#B94A48",
          muted: "#9B3C3A",
        },
        terracotta: {
          DEFAULT: "#C05621",
          hover: "#A84718",
        },
        forest: {
          DEFAULT: "#2D5A27",
          hover: "#23471E",
        },
        // Dark theme specific mapping
        dark: {
          bg: "#141414",
          "bg-subtle": "#1C1C1C",
          surface: "#202020",
          text: "#E5E5E3",
          muted: "#9C9C97",
          border: "#2C2C2C",
          sage: "#7FA882",
          "sage-hover": "#95BC98",
          cta: "#E5E5E3",
          "cta-text": "#141414",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 6px -1px rgba(0, 0, 0, 0.06)",
        md: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "fade-in-up": "fade-in-up 0.25s ease-out",
        "slide-in-right": "slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
