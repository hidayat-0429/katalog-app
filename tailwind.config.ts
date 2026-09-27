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
        // Existing CSS Variable-based colors (maintain for compatibility)
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
        
        // Legacy aliases (maintain for backward compatibility)
        sage: "rgb(var(--primary) / <alpha-value>)",
        clay: "rgb(var(--danger) / <alpha-value>)",
        forest: "rgb(var(--primary-hover) / <alpha-value>)",
        "dark-text": "rgb(var(--charcoal) / <alpha-value>)",
        "dark-muted": "rgb(var(--charcoal-muted) / <alpha-value>)",
        "dark-surface": "rgb(var(--surface) / <alpha-value>)",
        "dark-bg": "rgb(var(--bg) / <alpha-value>)",
        "dark-bg-subtle": "rgb(var(--bg-subtle) / <alpha-value>)",
        "dark-border": "rgb(var(--border) / <alpha-value>)",
        "dark-sage": "rgb(var(--primary) / <alpha-value>)",
        "dark-cta": "rgb(var(--cta) / <alpha-value>)",
        "dark-cta-text": "rgb(var(--charcoal) / <alpha-value>)",

        // Duotone System: Primary Green + Neutral Gray
        // Simplified from multi-color palette for cleaner, more focused brand identity
        brand: {
          // Primary: Forest Green (Natural, Organic, Growth)
          // Used for: CTAs, links, active states, brand moments
          forest: {
            50: '#f0f7f0',   // Lightest - backgrounds, hover states
            100: '#d8ebd8',  // Light - subtle accents
            200: '#b8d4b8',  // Medium-light - borders
            300: '#8fb88f',  // Mid-tone - disabled states
            400: '#6b9b6b',  // Medium - muted elements
            500: '#2d5a27',  // Primary brand color
            600: '#1e4a1a',  // Hover states
            700: '#163a13',  // Pressed states
            800: '#0f2a0c',  // Deep accent
            900: '#081a05',  // Darkest
          },
        },

        // Design System V2: Neutral Colors (Cool Grays for Data Presentation)
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },

        // Design System V2: Semantic Colors
        // Tangga 50-900 dipakai untuk state error/success/info/warning. Nama lamanya
        // (light / DEFAULT / dark / darkBg) tetap ada karena dipakai Badge & Button.
        semantic: {
          success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#065f46',
            darkBg: '#064e3b',
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#92400e',
            darkBg: '#78350f',
          },
          danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#991b1b',
            darkBg: '#7f1d1d',
          },
          info: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            light: '#dbeafe',
            DEFAULT: '#3b82f6',
            dark: '#1e40af',
            darkBg: '#1e3a8a',
          },
        },
      },

      // Design System V2: Typography
      fontFamily: {
        // Display font for headings and titles
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        // Body text and UI
        sans: ['var(--font-figtree)', 'Figtree', 'system-ui', '-apple-system', 'sans-serif'],
        // Numbers, code, data
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
        // Legacy alias
        heading: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
      },

      // Design System V2: Type Scale with refined line heights and letter spacing
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },

      // Design System V2: Spacing Scale (4, 8, 12, 16, 24, 32, 48, 64)
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },

      // Design System V2: Border Radius (max 10px)
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '10px', // capped at 10px
      },

      // Design System V2: Shadows (minimal usage)
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 1px 3px 0 rgb(0 0 0 / 0.1)', // capped at shadow equivalent
        lg: '0 1px 3px 0 rgb(0 0 0 / 0.1)', // capped at shadow equivalent
        xl: '0 1px 3px 0 rgb(0 0 0 / 0.1)', // capped at shadow equivalent
        none: '0 0 #0000',
      },

      // Design System V2: Transition Durations
      transitionDuration: {
        '150': '150ms', // button clicks, input focus
        '200': '200ms', // card hovers, badge changes
        '300': '300ms', // modal open/close, complex state changes
      },

      // Design System V2: Transition Timing Functions
      transitionTimingFunction: {
        out: 'cubic-bezier(0, 0, 0.2, 1)', // ease-out for all interactions
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
