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
          DEFAULT: "#FAFAF7", // off-white
          subtle: "#F5F4F0",
        },
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#4A5D3A", // olive green
          hover: "#3D4E30",
          light: "#E8EFE3",
        },
        cta: {
          DEFAULT: "#E8A33D", // amber
          hover: "#D4922F",
        },
        charcoal: {
          DEFAULT: "#1F2419",
          muted: "#6B7263",
        },
        border: {
          DEFAULT: "#E5E3DC",
          subtle: "#E5E3DC",
        },
        danger: {
          DEFAULT: "#B94A48",
          bg: "#FDF0EF",
        },
        // Dark theme specific mapping
        dark: {
          bg: "#141410",
          "bg-subtle": "#1C1C18",
          surface: "#222220",
          primary: "#7FA882",
          "primary-hover": "#95BC98",
          text: "#E5E5E0",
          muted: "#9C9C90",
          border: "#2C2C28",
          cta: "#E8A33D",
          "cta-text": "#141410",
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px", // Default 8px
        md: "8px",
        lg: "10px", // Max 10px
        xl: "10px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 6px -1px rgba(0, 0, 0, 0.06)",
        md: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
