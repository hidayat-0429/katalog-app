# Design Document: UI Redesign Sophisticated

## Overview

This design document outlines the architecture and implementation approach for elevating the katalog-app B2B mushroom catalog system through a sophisticated UI redesign. The redesign focuses on refined design tokens, enhanced component architecture, purposeful micro-interactions, and improved information hierarchy while maintaining 100% of existing functionality. The approach is component-first, using exclusively Tailwind CSS without introducing new dependencies.

## Architecture

### Design System Architecture

The Design System V2 follows a token-based architecture implemented through Tailwind CSS configuration:

```
tailwind.config.ts
├── Theme Extension
│   ├── Colors (semantic tokens)
│   │   ├── Brand colors (earthy: olive, sage, amber)
│   │   ├── Neutral colors (cool grays for data)
│   │   ├── Semantic colors (success, warning, danger, info)
│   │   └── Surface colors (backgrounds, borders)
│   ├── Typography
│   │   ├── Font families (Bricolage Grotesque, Figtree, JetBrains Mono)
│   │   ├── Font sizes (refined scale)
│   │   └── Font weights
│   ├── Spacing (4, 8, 12, 16, 24, 32, 48, 64)
│   ├── Border radius (max 10px)
│   └── Shadows (minimal, max shadow-sm)
└── Dark mode variants (via CSS variables)
```

**Design Token Strategy:**
- **CSS Variables for Semantic Colors**: Define semantic color tokens as CSS variables that map to different concrete values in light/dark modes
- **Context-Aware Color System**: Separate color palettes for brand contexts (earthy, warm) vs. data contexts (neutral-cool)
- **Tailwind Extend Pattern**: Extend default Tailwind config rather than replacing, preserving standard utilities while adding custom tokens
- **Type-Safe Configuration**: Use TypeScript for tailwind.config.ts to ensure type safety and autocomplete

### Component Architecture

Components follow a composition pattern with variants:

```
Component Structure Pattern:
├── Base Component (functionality + layout)
├── Variant Props (styling variations)
├── State Management (internal UI state)
└── Styling Layer (Tailwind classes only)
```

**Component Hierarchy:**
```
Base UI Components (components/ui/)
├── Button (primary, secondary, danger, ghost, icon)
├── Input (with label, validation states)
├── Badge (success, warning, danger, info, neutral)
├── Card (with hover elevation)
├── Table (optimized for data density)
└── Modal (with backdrop and transitions)

Feature Components (app/)
├── Product Cards
├── Metric Cards
├── Status Displays
└── Form Sections
```

**Styling Principles:**
- **className Only Changes**: All visual changes implemented through className modifications, no logic changes
- **Composition Over Configuration**: Components accept children and compose rather than using complex prop APIs
- **cn() Utility**: Use `cn()` utility from `lib/utils.ts` for conditional className merging
- **Server/Client Boundaries**: Maintain existing "use client" directives, no boundary changes

### Layout Architecture

**Landing Page Structure:**
```
Landing Page (app/(main)/page.tsx)
├── Hero Section
│   ├── Background Image + Gradient Overlay
│   ├── Heading (Bricolage Grotesque, large scale)
│   ├── Subheading (Figtree, muted color)
│   └── CTA Buttons (earthy brand colors)
├── Features Section
│   ├── Grid Layout (responsive)
│   ├── Icon Containers (subtle bg fills)
│   └── Feature Cards (layered backgrounds)
├── Products Showcase
│   ├── Product Cards (hover states)
│   └── Category Filters
└── Value Proposition Section
    ├── Testimonials or Stats
    └── Secondary CTA
```

**Admin Dashboard Structure:**
```
Admin Dashboard (app/admin/)
├── Sidebar Navigation
│   ├── Logo/Brand
│   ├── Nav Links (active states)
│   └── User Section
├── Main Content Area
│   ├── Page Header (breadcrumbs, actions)
│   ├── Metric Cards (monospace numbers)
│   ├── Data Tables (optimized density)
│   └── Form Sections (grouped inputs)
└── Data Surfaces
    ├── Neutral color palette
    ├── High-contrast typography
    └── Refined status indicators
```

**Visual Depth Strategy:**
- **Layered Backgrounds**: Base (gray-50/900) → Surface (white/gray-800) → Elevated (shadow-sm)
- **Subtle Borders**: 1px borders with refined gray tones
- **Minimal Shadows**: shadow-sm for floating elements only (modals, dropdowns)
- **Color Differentiation**: Use background color shifts instead of heavy shadows for depth

## Design System V2 Specification

### Color System

**Brand Colors (Earthy Palette for Marketing):**
```typescript
// Use in: hero sections, CTAs, feature highlights, brand elements
colors: {
  brand: {
    olive: {
      50: '#f6f7f4',
      100: '#e4e7dd',
      200: '#cad0bc',
      300: '#a8b295',
      400: '#8a9773',
      500: '#6d7a5a', // primary brand
      600: '#556147',
      700: '#44503a',
      800: '#384131',
      900: '#30372b',
    },
    sage: {
      50: '#f4f6f5',
      100: '#e3e8e5',
      200: '#c7d1cc',
      300: '#a3b3aa',
      400: '#7f9387',
      500: '#62776d',
      600: '#4d5f56',
      700: '#404e47',
      800: '#36403b',
      900: '#2f3632',
    },
    amber: {
      50: '#fefbf3',
      100: '#fdf4e1',
      200: '#fae6c1',
      300: '#f6d496',
      400: '#f1bc68',
      500: '#eca246', // accent color
      600: '#d97f2b',
      700: '#b45e24',
      800: '#924924',
      900: '#783d21',
    },
  }
}
```

**Neutral Colors (Cool Grays for Data Presentation):**
```typescript
// Use in: admin tables, metric cards, data displays, forms
colors: {
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
  }
}
```

**Semantic Colors:**
```typescript
colors: {
  semantic: {
    success: {
      light: '#d1fae5',    // bg in light mode
      DEFAULT: '#10b981',  // border/icon
      dark: '#065f46',     // text in light mode
      darkBg: '#064e3b',   // bg in dark mode
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
  }
}
```

**Surface Colors (via CSS Variables):**
```css
:root {
  --color-base: 249 250 251;        /* gray-50 */
  --color-surface: 255 255 255;     /* white */
  --color-elevated: 255 255 255;    /* white with shadow */
  --color-border: 229 231 235;      /* gray-200 */
  --color-border-hover: 209 213 219; /* gray-300 */
}

.dark {
  --color-base: 17 24 39;           /* gray-900 */
  --color-surface: 31 41 55;        /* gray-800 */
  --color-elevated: 55 65 81;       /* gray-700 */
  --color-border: 55 65 81;         /* gray-700 */
  --color-border-hover: 75 85 99;   /* gray-600 */
}
```

### Typography System

**Font Families:**
```typescript
fontFamily: {
  display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],  // Headings, titles
  sans: ['Figtree', 'system-ui', 'sans-serif'],                 // Body text, UI
  mono: ['JetBrains Mono', 'Courier New', 'monospace'],         // Numbers, code
}
```

**Type Scale:**
```typescript
fontSize: {
  // Data/UI text
  'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.5rem' }],
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  
  // Headings
  'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
  '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
  '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
  
  // Display/Hero
  '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
  '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
}
```

**Typography Usage Guidelines:**
- **Display Font (Bricolage Grotesque)**: Hero headlines, section titles, page headers
- **Sans Font (Figtree)**: Body text, UI labels, button text, descriptions
- **Mono Font (JetBrains Mono)**: Numeric data, prices, quantities, metric values, code

### Spacing System

**Spacing Scale:**
```typescript
spacing: {
  '1': '4px',    // tight spacing, icon gaps
  '2': '8px',    // compact element spacing
  '3': '12px',   // input padding, small gaps
  '4': '16px',   // standard element spacing
  '6': '24px',   // section spacing
  '8': '32px',   // component spacing
  '12': '48px',  // large section spacing
  '16': '64px',  // hero/major section spacing
}
```

**Usage Guidelines:**
- **Intra-element**: 1-2 (4-8px) for padding within buttons, badges
- **Inter-element**: 3-4 (12-16px) for gaps between form fields, list items
- **Component groups**: 6-8 (24-32px) for spacing between sections
- **Major sections**: 12-16 (48-64px) for hero sections, page sections

### Elevation System

**Border Strategy:**
```typescript
borderWidth: {
  DEFAULT: '1px',
  '0': '0px',
  '2': '2px',  // focus rings only
}

borderRadius: {
  'sm': '4px',   // badges, small buttons
  'md': '6px',   // inputs, cards, regular buttons
  'lg': '8px',   // modals, large cards
  'xl': '10px',  // maximum border radius
}
```

**Shadow Strategy (Minimal Usage):**
```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',           // floating cards
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1)',       // modals, dropdowns
  'none': '0 0 #0000',                              // default state
}
```

**Elevation Guidelines:**
- **Base Level**: No shadow, border only
- **Interactive Level**: No shadow at rest, border color change on hover
- **Floating Level**: shadow-sm for truly floating elements (modals, tooltips, dropdowns)
- **Avoid**: shadow-md, shadow-lg, shadow-xl (too heavy for design aesthetic)

### Animation System

**Transition Tokens:**
```typescript
transitionDuration: {
  '150': '150ms',  // button clicks, input focus
  '200': '200ms',  // card hovers, badge changes
  '300': '300ms',  // modal open/close, complex state changes
}

transitionTimingFunction: {
  'out': 'cubic-bezier(0, 0, 0.2, 1)',     // ease-out, use for all interactions
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)', // rare usage
}
```

**Animation Patterns:**
```typescript
// Apply to all interactive elements
className="transition-colors duration-150 ease-out"

// Hover states
className="hover:border-gray-300 hover:bg-gray-50"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-brand-olive-500 focus:border-brand-olive-500"

// Modal/overlay animations
className="transition-opacity duration-300"
```

**Animation Rules:**
- **Use**: transition-colors, transition-opacity, transition-transform
- **Avoid**: transition-all (performance issue), complex keyframe animations
- **Timing**: 150ms for clicks/focus, 200ms for hovers, 300ms for modals
- **Easing**: ease-out for all interactions
- **Respect prefers-reduced-motion**: Wrap in `@media (prefers-reduced-motion: no-preference)`

## Component Specifications

### Button Component

**File**: `components/ui/Button.tsx`

**Variants:**
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'

interface ButtonProps {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}
```

**Styling Specifications:**
```typescript
const variantStyles = {
  primary: cn(
    // Light mode: earthy brand olive
    'bg-brand-olive-600 text-white',
    'hover:bg-brand-olive-700',
    'active:bg-brand-olive-800',
    'border border-brand-olive-700',
    // Dark mode
    'dark:bg-brand-olive-500 dark:hover:bg-brand-olive-600',
    'dark:border-brand-olive-600'
  ),
  
  secondary: cn(
    'bg-white text-neutral-700 border border-neutral-300',
    'hover:bg-neutral-50 hover:border-neutral-400',
    'dark:bg-neutral-800 dark:text-neutral-200',
    'dark:border-neutral-600 dark:hover:bg-neutral-700'
  ),
  
  danger: cn(
    'bg-semantic-danger-DEFAULT text-white',
    'hover:bg-red-600 border border-red-600',
    'dark:bg-red-600 dark:hover:bg-red-700'
  ),
  
  ghost: cn(
    'bg-transparent text-neutral-700 border border-transparent',
    'hover:bg-neutral-100 hover:border-neutral-200',
    'dark:text-neutral-200 dark:hover:bg-neutral-800'
  ),
  
  icon: cn(
    'bg-transparent text-neutral-600 border-0 p-2',
    'hover:bg-neutral-100 hover:text-neutral-900',
    'dark:text-neutral-300 dark:hover:bg-neutral-800'
  ),
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-6 py-3 text-lg rounded-lg',
}

const baseStyles = cn(
  'inline-flex items-center justify-center font-medium',
  'transition-colors duration-150 ease-out',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'disabled:hover:bg-current' // prevents hover state when disabled
)
```

**Usage Example:**
```tsx
<Button variant="primary" size="md" onClick={handleSubmit}>
  Add to Cart
</Button>
```

### Input Component

**File**: `components/ui/Input.tsx`

**Styling Specifications:**
```typescript
const inputStyles = cn(
  // Base styles
  'w-full px-3 py-2 rounded-md',
  'border border-neutral-300',
  'bg-white text-neutral-900',
  'font-sans text-base',
  
  // Focus state
  'focus:outline-none focus:ring-2 focus:ring-brand-olive-500',
  'focus:border-brand-olive-500',
  'transition-colors duration-150 ease-out',
  
  // Placeholder
  'placeholder:text-neutral-400',
  
  // Dark mode
  'dark:bg-neutral-800 dark:text-neutral-100',
  'dark:border-neutral-600',
  'dark:placeholder:text-neutral-500',
  
  // Disabled state
  'disabled:bg-neutral-50 disabled:text-neutral-500',
  'disabled:cursor-not-allowed',
  'dark:disabled:bg-neutral-900'
)

const labelStyles = cn(
  'block text-sm font-medium text-neutral-700 mb-2',
  'uppercase tracking-wide',
  'dark:text-neutral-300'
)
```

**Usage Example:**
```tsx
<div>
  <label htmlFor="email" className={labelStyles}>
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className={inputStyles}
    placeholder="you@example.com"
  />
</div>
```

### Badge Component

**File**: `components/ui/Badge.tsx`

**Variants:**
```typescript
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const variantStyles = {
  success: cn(
    'bg-semantic-success-light text-semantic-success-dark',
    'border border-semantic-success-DEFAULT',
    'dark:bg-semantic-success-darkBg dark:text-green-200'
  ),
  
  warning: cn(
    'bg-semantic-warning-light text-semantic-warning-dark',
    'border border-semantic-warning-DEFAULT',
    'dark:bg-semantic-warning-darkBg dark:text-amber-200'
  ),
  
  danger: cn(
    'bg-semantic-danger-light text-semantic-danger-dark',
    'border border-semantic-danger-DEFAULT',
    'dark:bg-semantic-danger-darkBg dark:text-red-200'
  ),
  
  info: cn(
    'bg-semantic-info-light text-semantic-info-dark',
    'border border-semantic-info-DEFAULT',
    'dark:bg-semantic-info-darkBg dark:text-blue-200'
  ),
  
  neutral: cn(
    'bg-neutral-100 text-neutral-700',
    'border border-neutral-300',
    'dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600'
  ),
}

const baseStyles = cn(
  'inline-flex items-center px-2 py-1',
  'text-xs font-medium rounded-sm',
  'transition-colors duration-200 ease-out'
)
```

### Card Component

**File**: `components/ui/Card.tsx`

**Styling Specifications:**
```typescript
const cardStyles = cn(
  // Base structure
  'rounded-lg border border-neutral-200',
  'bg-white p-6',
  
  // Dark mode
  'dark:bg-neutral-800 dark:border-neutral-700',
  
  // Optional hover state (for interactive cards)
  'transition-colors duration-200 ease-out'
)

const interactiveCardStyles = cn(
  cardStyles,
  'hover:border-neutral-300 hover:bg-neutral-50',
  'dark:hover:border-neutral-600 dark:hover:bg-neutral-750',
  'cursor-pointer'
)
```

**Usage Example:**
```tsx
<Card className="space-y-4">
  <h3 className="text-xl font-display font-semibold">
    Product Name
  </h3>
  <p className="text-neutral-600 dark:text-neutral-400">
    Description text
  </p>
</Card>
```

### Table Component

**File**: `components/ui/Table.tsx`

**Styling Specifications:**
```typescript
const tableStyles = cn(
  'w-full border-collapse',
  'text-sm text-left'
)

const theadStyles = cn(
  'border-b border-neutral-200',
  'dark:border-neutral-700'
)

const thStyles = cn(
  'px-4 py-3',
  'text-xs font-semibold uppercase tracking-wide',
  'text-neutral-600 bg-neutral-50',
  'dark:text-neutral-400 dark:bg-neutral-800/50'
)

const tbodyStyles = ''

const trStyles = cn(
  'border-b border-neutral-100',
  'transition-colors duration-150 ease-out',
  'hover:bg-neutral-50',
  'dark:border-neutral-800',
  'dark:hover:bg-neutral-800/50'
)

const tdStyles = cn(
  'px-4 py-3',
  'text-neutral-900',
  'dark:text-neutral-200'
)

// For numeric data columns
const numericCellStyles = cn(
  tdStyles,
  'font-mono tabular-nums'
)
```

**Usage Example:**
```tsx
<table className={tableStyles}>
  <thead className={theadStyles}>
    <tr>
      <th className={thStyles}>Product</th>
      <th className={cn(thStyles, 'text-right')}>Price</th>
      <th className={thStyles}>Status</th>
    </tr>
  </thead>
  <tbody className={tbodyStyles}>
    <tr className={trStyles}>
      <td className={tdStyles}>Shiitake</td>
      <td className={cn(numericCellStyles, 'text-right')}>45,000</td>
      <td className={tdStyles}><Badge variant="success">Active</Badge></td>
    </tr>
  </tbody>
</table>
```

### Modal Component

**File**: `components/ui/Modal.tsx`

**Styling Specifications:**
```typescript
const backdropStyles = cn(
  'fixed inset-0 z-50',
  'bg-black/50 backdrop-blur-sm',
  'transition-opacity duration-300 ease-out'
)

const modalContainerStyles = cn(
  'fixed inset-0 z-50',
  'flex items-center justify-center p-4',
  'pointer-events-none'
)

const modalContentStyles = cn(
  'relative w-full max-w-lg',
  'bg-white rounded-lg shadow-sm',
  'border border-neutral-200',
  'p-6',
  'pointer-events-auto',
  
  // Animation
  'transition-all duration-300 ease-out',
  'scale-95 opacity-0', // initial state
  'data-[state=open]:scale-100 data-[state=open]:opacity-100',
  
  // Dark mode
  'dark:bg-neutral-800 dark:border-neutral-700'
)
```

**Animation Implementation:**
```tsx
// Use Tailwind's data attribute pattern for state-based styling
<div 
  className={modalContentStyles} 
  data-state={isOpen ? 'open' : 'closed'}
>
  {children}
</div>
```

## Layout Patterns

### Landing Page Design

**Hero Section Pattern:**
```tsx
<section className="relative h-screen">
  {/* Background Image */}
  <Image 
    src="/hero-mushroom.jpg" 
    alt="" 
    fill 
    className="object-cover"
    priority
  />
  
  {/* Gradient Overlay for text legibility */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
  
  {/* Content */}
  <div className="relative z-10 flex items-center justify-center h-full">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-6">
        Premium Mushroom Cultivation
      </h1>
      <p className="text-xl md:text-2xl text-white/90 mb-8 font-sans">
        Sustainable, high-quality mushrooms for B2B partners
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary" size="lg">
          View Catalog
        </Button>
        <Button variant="secondary" size="lg">
          Contact Us
        </Button>
      </div>
    </div>
  </div>
</section>
```

**Product Card Pattern:**
```tsx
<Card className={cn(
  'group',
  'transition-all duration-200 ease-out',
  'hover:border-brand-olive-300',
  'hover:shadow-sm'
)}>
  {/* Image */}
  <div className="aspect-square relative overflow-hidden rounded-md mb-4">
    <Image 
      src={product.image} 
      alt={product.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  
  {/* Content */}
  <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
    {product.name}
  </h3>
  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
    {product.category}
  </p>
  
  {/* Price */}
  <div className="flex items-baseline justify-between">
    <span className="font-mono text-2xl font-bold text-brand-olive-600 dark:text-brand-olive-400">
      Rp {formatPrice(product.price)}
    </span>
    <span className="text-sm text-neutral-500">
      per {product.unit}
    </span>
  </div>
</Card>
```

**Feature Section Pattern:**
```tsx
<section className="py-16 bg-neutral-50 dark:bg-neutral-900">
  <Container>
    <h2 className="font-display text-4xl font-bold text-center mb-12">
      Why Choose Us
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.id} className="text-center">
          {/* Icon Container */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-brand-olive-100 dark:bg-brand-olive-900/30 mb-4">
            <feature.icon className="w-8 h-8 text-brand-olive-600 dark:text-brand-olive-400" />
          </div>
          
          {/* Content */}
          <h3 className="font-display text-xl font-semibold mb-3">
            {feature.title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </Container>
</section>
```

### Admin Dashboard Design

**Metric Card Pattern:**
```tsx
<Card>
  {/* Label */}
  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
    Total Revenue
  </p>
  
  {/* Value */}
  <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-1 tabular-nums">
    Rp {formatNumber(totalRevenue)}
  </p>
  
  {/* Trend Indicator */}
  <div className="flex items-center gap-2 text-sm">
    <span className="text-semantic-success-DEFAULT">↑ 12.5%</span>
    <span className="text-neutral-500">vs last month</span>
  </div>
</Card>
```

**Data Table Pattern:**
```tsx
<div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
  <table className={tableStyles}>
    <thead className={theadStyles}>
      <tr>
        <th className={thStyles}>Order ID</th>
        <th className={thStyles}>Customer</th>
        <th className={cn(thStyles, 'text-right')}>Total</th>
        <th className={thStyles}>Status</th>
        <th className={thStyles}>Date</th>
        <th className={thStyles}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.id} className={trStyles}>
          <td className={cn(tdStyles, 'font-mono')}>{order.id}</td>
          <td className={tdStyles}>{order.customerName}</td>
          <td className={cn(numericCellStyles, 'text-right')}>
            Rp {formatNumber(order.total)}
          </td>
          <td className={tdStyles}>
            <Badge variant={getStatusVariant(order.status)}>
              {order.status}
            </Badge>
          </td>
          <td className={cn(tdStyles, 'text-neutral-500')}>
            {formatDate(order.createdAt)}
          </td>
          <td className={tdStyles}>
            <Button variant="ghost" size="sm">View</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Form Section Pattern:**
```tsx
<Card>
  <h2 className="font-display text-2xl font-semibold mb-6">
    Product Details
  </h2>
  
  <form className="space-y-6">
    {/* Input Group */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelStyles}>Product Name</label>
        <input type="text" className={inputStyles} />
      </div>
      
      <div>
        <label className={labelStyles}>Category</label>
        <select className={inputStyles}>
          <option>Select category</option>
        </select>
      </div>
    </div>
    
    {/* Full-width input */}
    <div>
      <label className={labelStyles}>Description</label>
      <textarea className={cn(inputStyles, 'min-h-[120px]')} />
    </div>
    
    {/* Price inputs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className={labelStyles}>Price</label>
        <input type="number" className={cn(inputStyles, 'font-mono')} />
      </div>
      <div>
        <label className={labelStyles}>Stock</label>
        <input type="number" className={cn(inputStyles, 'font-mono')} />
      </div>
      <div>
        <label className={labelStyles}>Unit</label>
        <input type="text" className={inputStyles} placeholder="kg" />
      </div>
    </div>
    
    {/* Actions */}
    <div className="flex gap-4 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary" type="submit">Save Product</Button>
    </div>
  </form>
</Card>
```

## Implementation Strategy

### Phase 1: Design System Setup

1. **Update `tailwind.config.ts`:**
   - Add brand colors (olive, sage, amber)
   - Add neutral colors (cool grays)
   - Add semantic colors (success, warning, danger, info)
   - Configure font families
   - Set up spacing scale
   - Configure border radius limits
   - Add minimal shadow tokens
   - Configure transition durations

2. **Add CSS Variables in `globals.css`:**
   - Define surface color variables
   - Define border color variables
   - Set up dark mode mappings

3. **Update `DESIGN_SYSTEM.md`:**
   - Document all color tokens with usage contexts
   - Document typography scale and usage
   - Document spacing system
   - Document elevation approach
   - Document animation specifications

### Phase 2: Base Component Refinement

Refine components in this order to ensure dependent components have correct base styling:

1. **Button** (`components/ui/Button.tsx`)
   - Update variant styles with brand colors
   - Apply refined padding and border radius
   - Add transition-colors with 150ms duration
   - Ensure focus ring uses brand color

2. **Input** (`components/ui/Input.tsx`)
   - Update border and background colors
   - Apply refined focus state with ring
   - Update label styling (uppercase, tracking)
   - Ensure dark mode support

3. **Badge** (`components/ui/Badge.tsx`)
   - Update semantic color mappings
   - Apply refined background/text color pairs
   - Add transition-colors with 200ms duration
   - Ensure dark mode uses adjusted colors

4. **Card** (`components/ui/Card.tsx`)
   - Update to 1px border with refined gray
   - Set background color for surface layer
   - Add optional hover state variant
   - Apply transition-colors with 200ms duration

5. **Table** (`components/ui/Table.tsx`)
   - Update header styling (uppercase, smaller, background)
   - Optimize row padding (py-3 = 12px)
   - Add row hover state with transition
   - Apply monospace font for numeric columns

6. **Modal** (`components/ui/Modal.tsx`)
   - Update backdrop with blur
   - Apply shadow-sm to modal content
   - Add enter/exit transitions (300ms)
   - Ensure elevated surface background

### Phase 3: Page-Level Updates

**Landing Page Components:**
1. Hero section (background, gradient, typography)
2. Feature sections (icon containers, card styling)
3. Product cards (hover states, image treatment)
4. CTA sections (button styling, spacing)

**Admin Dashboard Components:**
1. Sidebar navigation (active states, spacing)
2. Metric cards (monospace numbers, trend indicators)
3. Data tables (using refined Table component)
4. Form sections (using refined Input component)
5. Status displays (using refined Badge component)

### Phase 4: Micro-Interactions

Add transitions to interactive elements:
- Button clicks: transition-colors duration-150
- Input focus: ring-2 with brand color
- Card hovers: border color + background shift
- Table row hovers: background transition
- Modal open/close: opacity and scale transitions

### Phase 5: Dark Mode Refinement

Verify dark mode across all components:
- Test color contrast ratios
- Verify border visibility
- Check elevated surface hierarchy
- Test status badge legibility
- Verify form input focus states

### Phase 6: Responsive & Accessibility

- Verify responsive breakpoints still work
- Test keyboard navigation
- Verify ARIA attributes preserved
- Test with screen readers
- Verify prefers-reduced-motion support

## Implementation Guidelines

### Component Modification Approach

**DO:**
- Modify only `className` strings
- Use `cn()` utility for conditional classes
- Add inline comments for complex class combinations
- Test component in isolation before integration
- Maintain existing props and event handlers
- Preserve "use client" directives

**DON'T:**
- Modify TypeScript logic or interfaces
- Change component APIs (props, children patterns)
- Alter server actions or data fetching
- Add new dependencies
- Change file structure or component organization
- Remove existing accessibility attributes

### className Composition Pattern

```tsx
// Use cn() for merging base, variant, and custom classes
const buttonClasses = cn(
  // Base styles
  baseStyles,
  // Variant styles
  variantStyles[variant],
  // Size styles
  sizeStyles[size],
  // Custom classes from props
  className
)

return <button className={buttonClasses}>{children}</button>
```

### Dark Mode Pattern

```tsx
// Always pair light and dark mode classes
className={cn(
  // Light mode
  'bg-white text-neutral-900 border-neutral-200',
  // Dark mode
  'dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700'
)}
```

### Transition Pattern

```tsx
// Apply transitions to interactive elements
className={cn(
  'transition-colors duration-150 ease-out',
  'hover:bg-neutral-50',
  'focus:ring-2 focus:ring-brand-olive-500'
)}
```

### Responsive Pattern

```tsx
// Mobile-first responsive classes
className={cn(
  'text-base',           // mobile
  'md:text-lg',          // tablet
  'lg:text-xl'           // desktop
)}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Consistent Interactive Transition Timing

*For any* component with state changes (hover, focus, active, disabled), the component SHALL apply transition classes with duration between 150ms and 300ms using ease-out timing function.

**Validates: Requirements 2.7, 5.8**

### Property 2: Button Click Feedback Timing

*For any* button in the system, clicking the button SHALL trigger a color transition with duration of 150ms or less.

**Validates: Requirements 5.1**

### Property 3: Clickable Card Hover Feedback

*For any* clickable card element, hovering over the card SHALL apply border color change and background shift with transition duration of 200ms or less.

**Validates: Requirements 5.2**

### Property 4: Modal Animation Specification

*For any* modal component, opening the modal SHALL apply backdrop fade-in and content scale animation with duration between 200ms and 300ms.

**Validates: Requirements 5.3**

### Property 5: Form Input Focus Feedback

*For any* form input element, receiving focus SHALL apply border color change and ring appearance with transition duration of 150ms or less.

**Validates: Requirements 5.4**

### Property 6: Badge State Transition

*For any* badge component with dynamic status value, changing the status SHALL apply color transition with duration of 200ms or less.

**Validates: Requirements 5.5**

### Property 7: Table Row Hover Feedback

*For any* data table row, hovering over the row SHALL apply background color transition with duration of 150ms or less.

**Validates: Requirements 5.6**

### Property 8: Landing Page Hover Feedback Pattern

*For any* interactive element on the landing page, hovering SHALL trigger color transitions without shadow animations.

**Validates: Requirements 3.7**

### Property 9: Ease-Out Timing Function Consistency

*For any* interactive element with transitions, the timing function SHALL be ease-out (cubic-bezier(0, 0, 0.2, 1)).

**Validates: Requirements 5.8**

### Property 10: ARIA Attribute Preservation

*For any* component in the system, the redesigned component SHALL maintain all existing ARIA attributes that were present before the redesign.

**Validates: Requirements 7.2**

### Property 11: Keyboard Navigation Support

*For any* interactive element in the system, the element SHALL respond to appropriate keyboard events (Enter, Space, Tab, Arrow keys as applicable).

**Validates: Requirements 7.3**

### Property 12: Color Contrast Accessibility

*For any* text-background color combination in the system, the contrast ratio SHALL meet or exceed WCAG AA standard (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 7.4**

### Property 13: Reduced Motion Preference Respect

*For any* element with animations, when the user's system has prefers-reduced-motion preference enabled, the element SHALL reduce or eliminate motion effects.

**Validates: Requirements 7.6**

### Property 14: Dark Mode Class Pattern

*For any* component with color styling, dark mode colors SHALL be applied through Tailwind's `dark:` variant classes consistently.

**Validates: Requirements 8.2**

### Property 15: Dark Mode Border Visibility

*For any* border in dark mode, the border color SHALL have a higher lightness value than the background color to ensure visibility.

**Validates: Requirements 8.5**

### Property 16: Dark Mode Elevated Surface Hierarchy

*For any* elevated surface (modal, dropdown, tooltip) in dark mode, the background color SHALL be lighter than the base page background to maintain visual hierarchy.

**Validates: Requirements 8.6**

## Testing Strategy

### Unit Testing Approach

**Component-Level Tests:**
- Test each UI component renders with correct variant styles
- Test interactive state classes are applied correctly
- Test dark mode classes are present
- Test accessibility attributes are preserved
- Test component props interfaces unchanged

**Example Test Cases:**
- Button component renders primary variant with brand-olive colors
- Input component displays focus ring on focus event
- Badge component applies correct semantic colors for each variant
- Card component has hover classes for interactive variant
- Modal component has backdrop and transition classes
- Table headers have uppercase styling and correct padding

### Property-Based Testing Approach

**Universal Properties (100+ iterations per test):**
- Transition timing: Generate random interactive components, verify transition duration in range
- Timing function: Generate random interactive components, verify ease-out timing
- Color contrast: Generate random text-background pairs from design tokens, verify contrast ratio >= 4.5:1
- ARIA preservation: Compare components before/after redesign, verify attributes match
- Keyboard navigation: Generate random interactive elements, verify keyboard event handlers present
- Dark mode patterns: Generate random styled components, verify dark: classes present
- Reduced motion: Generate random animated elements, verify prefers-reduced-motion handling

**Test Configuration:**
- Minimum 100 iterations per property test
- Each property test references design document property number
- Tag format: `Feature: ui-redesign-sophisticated, Property {number}: {property_text}`

### Integration Testing Approach

**Page-Level Integration:**
- Test landing page renders with hero, features, products sections
- Test admin dashboard renders with sidebar, metrics, tables
- Test form submissions still work with refined inputs
- Test server actions still function correctly
- Test authentication flows unchanged
- Test routing still works correctly

**Performance Testing:**
- Measure page load times before and after redesign
- Verify no regression in Core Web Vitals
- Test with slow network conditions

**Visual Regression:**
- Capture screenshots of pages in light mode
- Capture screenshots of pages in dark mode
- Compare visual differences at responsive breakpoints

### Manual Testing Checklist

**Visual Design Review:**
- [ ] Color tokens match design specifications
- [ ] Typography scale applied correctly
- [ ] Spacing system used consistently
- [ ] Border radius maximum of 10px enforced
- [ ] Shadows minimal (max shadow-sm)
- [ ] Visual depth achieved through layering
- [ ] Dark mode maintains hierarchy

**Interaction Review:**
- [ ] Button clicks feel responsive
- [ ] Input focus states clear
- [ ] Card hovers provide feedback
- [ ] Modal animations smooth
- [ ] Table rows highlight on hover
- [ ] Transitions feel natural

**Accessibility Review:**
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces all content correctly
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Reduced motion preference respected

**Responsive Review:**
- [ ] Mobile layouts work correctly
- [ ] Tablet breakpoints applied
- [ ] Desktop layouts optimal
- [ ] Touch targets adequately sized
- [ ] Text remains readable at all sizes

## Risk Assessment

### Technical Risks

**Risk: Breaking existing functionality**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**: Only modify className strings, maintain all props and event handlers, comprehensive testing

**Risk: Dark mode contrast issues**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Test color contrast ratios programmatically, manual dark mode review

**Risk: Performance regression from CSS bloat**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Tailwind purges unused CSS, monitor bundle size, performance testing

**Risk: Accessibility regressions**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**: Preserve all ARIA attributes, keyboard navigation testing, screen reader testing

### Design Risks

**Risk: Insufficient visual hierarchy in data tables**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: User testing with admin users, iterate on table styling based on feedback

**Risk: Brand colors not distinct enough from neutral colors**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Clear context guidelines (earthy for brand, neutral for data)

**Risk: Micro-interactions feel sluggish or distracting**
- **Likelihood**: Medium
- **Impact**: Low
- **Mitigation**: Strict timing limits (150-300ms), ease-out timing function, respect prefers-reduced-motion

## Success Criteria

The UI redesign will be considered successful when:

1. **All base UI components refined** with new design tokens and styling patterns
2. **All page layouts updated** with improved visual hierarchy and spacing
3. **All micro-interactions implemented** with appropriate timing and easing
4. **Dark mode refined** with proper contrast and visual hierarchy
5. **Zero functionality regressions** - all existing features work identically
6. **Performance maintained** - no increase in page load times
7. **Accessibility maintained** - all WCAG AA standards still met
8. **Documentation complete** - DESIGN_SYSTEM.md updated with all specifications
9. **All property tests passing** at 100+ iterations
10. **Positive feedback** from stakeholders on visual refinement

## Future Enhancements

Beyond the scope of this redesign but worth considering:

- **Component Storybook**: Visual component documentation with interactive examples
- **Design Token Sync**: Automated sync between design tools and code
- **Advanced Animations**: More sophisticated animations using Framer Motion (requires new dependency)
- **Illustration System**: Custom illustrations for empty states and marketing sections
- **Data Visualization**: Charts and graphs for admin analytics dashboard
- **Progressive Enhancement**: Advanced features for modern browsers while maintaining baseline
- **CSS-in-JS Migration**: If Tailwind proves limiting, consider styled-components or emotion
- **Theme Customization**: Allow users to customize color themes
