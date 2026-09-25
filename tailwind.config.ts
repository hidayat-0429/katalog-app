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

        // Design System V2: Sweetgreen-Inspired Premium Food Palette
        brand: {
          // Deep Forest Green (Primary) - Inspired by Sweetgreen's signature green
          forest: {
            50: '#f0f7f0',   // Lightest sage for backgrounds
            100: '#d8ebd8',  // Light sage for subtle elements  
            200: '#b8d4b8',  // Medium-light for borders
            300: '#8fb88f',  // Mid-tone for muted elements
            400: '#6b9b6b',  // Active states
            500: '#2d5a27',  // Primary brand color - rich forest
            600: '#1e4a1a',  // Hover states
            700: '#163a13',  // Pressed states
            800: '#0f2a0c',  // Deep accent
            900: '#081a05',  // Darkest for text
          },
          // Warm Earth Brown (Secondary) - Premium natural feel
          earth: {
            50: '#faf8f5',   // Cream background
            100: '#f0ebe0',  // Light beige for cards
            200: '#e1d7c7',  // Warm neutral borders
            300: '#cfc0a8',  // Mid-tone earth
            400: '#b8a082',  // Muted earth accent
            500: '#8b7355',  // Rich brown secondary
            600: '#725d44',  // Brown hover
            700: '#5a4834',  // Brown pressed
            800: '#423525',  // Deep brown
            900: '#2b2217',  // Darkest earth
          },
          // Premium Amber (Accent) - Warmth and appetite appeal
          amber: {
            50: '#fefbf3',   // Lightest amber glow
            100: '#fdf4e1',  // Soft amber background
            200: '#fae6c1',  // Light amber for badges
            300: '#f6d496',  // Medium amber
            400: '#f1bc68',  // Active amber
            500: '#d97706',  // Rich amber accent - Sweetgreen inspired
            600: '#b8620a',  // Amber hover
            700: '#8f4d08',  // Amber pressed
            800: '#6b3a06',  // Deep amber
            900: '#4a2704',  // Darkest amber
          },
          // Fresh Green (Success/Freshness Indicators)  
          fresh: {
            50: '#f0fdf4',   // Lightest fresh
            100: '#dcfce7',  // Light fresh background
            200: '#bbf7d0',  // Fresh badge background
            300: '#86efac',  // Fresh indicator
            400: '#4ade80',  // Fresh active
            500: '#16a34a',  // Fresh primary
            600: '#15803d',  // Fresh hover
            700: '#166534',  // Fresh pressed
            800: '#14532d',  // Deep fresh
            900: '#0f3d26',  // Darkest fresh
          }
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
        semantic: {
          success: {
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#065f46',
            darkBg: '#064e3b',
          },
          warning: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#92400e',
            darkBg: '#78350f',
          },
          danger: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#991b1b',
            darkBg: '#7f1d1d',
          },
          info: {
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
