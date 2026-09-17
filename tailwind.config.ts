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
            DEFAULT: "rgb(var(--bg) / <alpha-value>)",
            subtle: "rgb(var(--bg-subtle) / <alpha-value>)",
          },
          surface: "rgb(var(--surface) / <alpha-value>)",
          primary: {
            DEFAULT: "rgb(var(--primary) / <alpha-value>)",
            hover: "rgb(var(--primary-hover) / <alpha-value>)",
            light: "rgb(var(--primary-light) / <alpha-value>)",
          },
          cta: {
            DEFAULT: "rgb(var(--cta) / <alpha-value>)",
            hover: "rgb(var(--cta-hover) / <alpha-value>)",
          },
          charcoal: {
            DEFAULT: "rgb(var(--charcoal) / <alpha-value>)",
            muted: "rgb(var(--charcoal-muted) / <alpha-value>)",
          },
          border: {
            DEFAULT: "rgb(var(--border) / <alpha-value>)",
            subtle: "rgb(var(--border-subtle) / <alpha-value>)",
          },
          danger: {
            DEFAULT: "rgb(var(--danger) / <alpha-value>)",
            bg: "rgb(var(--danger-bg) / <alpha-value>)",
          },
          info: {
            DEFAULT: "rgb(var(--info) / <alpha-value>)",
            bg: "rgb(var(--info-bg) / <alpha-value>)",
          },
          success: {
            DEFAULT: "rgb(var(--success) / <alpha-value>)",
            bg: "rgb(var(--success-bg) / <alpha-value>)",
          },
          warning: {
            DEFAULT: "rgb(var(--warning) / <alpha-value>)",
            bg: "rgb(var(--warning-bg) / <alpha-value>)",
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
  plugins: [require('@tailwindcss/forms')],
};

export default config;
