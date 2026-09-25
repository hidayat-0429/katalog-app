# Implementation Plan: UI Redesign Sophisticated

## Overview

This implementation plan converts the sophisticated UI redesign into actionable coding tasks following a bottom-up approach: design tokens → base components → page layouts → micro-interactions → dark mode → verification. All changes are className-only modifications using Tailwind CSS, maintaining existing functionality, TypeScript logic, and component APIs. The redesign elevates visual maturity through refined design tokens, enhanced component architecture, and purposeful micro-interactions.

## Tasks

- [x] 1. Design System V2 Setup
  - [x] 1.1 Configure Tailwind with brand colors, neutral palette, and semantic tokens
    - Update `tailwind.config.ts` with earthy brand colors (olive, sage, amber)
    - Add neutral-cool gray palette for data-centric interfaces
    - Add semantic color tokens (success, warning, danger, info) with light/dark variants
    - Configure font families (Bricolage Grotesque, Figtree, JetBrains Mono)
    - Set up refined typography scale with line heights and letter spacing
    - Configure spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
    - Set border radius maximum to 10px
    - Configure minimal shadow tokens (shadow-sm only)
    - Add transition duration tokens (150ms, 200ms, 300ms)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [x] 1.2 Add CSS variables for surface colors in globals.css
    - Define `--color-base`, `--color-surface`, `--color-elevated` variables
    - Define `--color-border` and `--color-border-hover` variables
    - Map variables to different values in light and dark modes
    - _Requirements: 1.7, 8.1_
  
  - [x] 1.3 Update DESIGN_SYSTEM.md with token specifications
    - Document all color tokens with usage contexts
    - Document typography scale and usage guidelines
    - Document spacing system with application guidance
    - Document elevation approach (borders over shadows)
    - Document animation specifications (timing, easing, patterns)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

- [x] 2. Checkpoint - Verify design tokens
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Refine Button Component
  - [x] 3.1 Update Button variants with brand colors and refined styling
    - Update `components/ui/Button.tsx` className strings only
    - Apply primary variant with `brand-olive` colors
    - Apply secondary variant with neutral colors and refined borders
    - Apply danger variant with semantic danger colors
    - Apply ghost variant with transparent backgrounds
    - Apply icon variant with minimal padding
    - Add size variants (sm, md, lg) with refined padding
    - Add `transition-colors duration-150 ease-out`
    - Update focus ring to use `brand-olive-500`
    - Ensure disabled state styling maintained
    - Add dark mode variants for all button types
    - _Requirements: 2.1, 2.7, 2.8, 5.1_
  
  - [ ]* 3.2 Write unit tests for Button component
    - Test all variants render with correct className strings
    - Test size variants apply correct padding
    - Test disabled state prevents interactions
    - Test dark mode classes are present
    - Test focus states apply correct ring colors
    - _Requirements: 2.1, 2.8_

- [x] 4. Refine Input Component
  - [x] 4.1 Update Input component with refined focus states and styling
    - Update `components/ui/Input.tsx` className strings only
    - Apply 1px border with `neutral-300` color
    - Update focus state with `ring-2 ring-brand-olive-500`
    - Add `transition-colors duration-150 ease-out`
    - Update label styling: uppercase, tracking-wide, text-sm
    - Add dark mode variants (bg-neutral-800, border-neutral-600)
    - Update placeholder color (neutral-400 / neutral-500 dark)
    - Apply disabled state styling
    - _Requirements: 2.4, 2.7, 2.8, 5.4_
  
  - [ ]* 4.2 Write unit tests for Input component
    - Test input renders with correct border and background
    - Test focus state applies ring and border color
    - Test label styling includes uppercase and tracking
    - Test dark mode classes are present
    - Test disabled state styling
    - _Requirements: 2.4, 2.8_

- [x] 5. Refine Badge Component
  - [x] 5.1 Update Badge variants with semantic color mappings
    - Update `components/ui/Badge.tsx` className strings only
    - Apply success variant (bg-semantic-success-light, text-semantic-success-dark, border)
    - Apply warning variant (bg-semantic-warning-light, text-semantic-warning-dark, border)
    - Apply danger variant (bg-semantic-danger-light, text-semantic-danger-dark, border)
    - Apply info variant (bg-semantic-info-light, text-semantic-info-dark, border)
    - Apply neutral variant (bg-neutral-100, text-neutral-700, border-neutral-300)
    - Add `transition-colors duration-200 ease-out`
    - Add dark mode variants with adjusted backgrounds and text colors
    - Apply refined padding (px-2 py-1) and border-radius (rounded-sm)
    - _Requirements: 2.3, 2.7, 4.4, 5.5_
  
  - [ ]* 5.2 Write unit tests for Badge component
    - Test all semantic variants render with correct colors
    - Test transition classes are applied
    - Test dark mode classes are present
    - Test border colors match variant
    - _Requirements: 2.3, 4.4_

- [x] 6. Refine Card Component
  - [x] 6.1 Update Card component with layered backgrounds and hover states
    - Update `components/ui/Card.tsx` className strings only
    - Apply 1px border with `border-neutral-200`
    - Set background to `bg-white` (surface layer)
    - Apply padding `p-6` and border-radius `rounded-lg`
    - Add `transition-colors duration-200 ease-out`
    - Add dark mode variants (bg-neutral-800, border-neutral-700)
    - Create interactive card variant with hover state (border-neutral-300, bg-neutral-50)
    - Maintain existing card header, footer, and content composition patterns
    - _Requirements: 2.2, 2.7, 3.4, 5.2_
  
  - [ ]* 6.2 Write unit tests for Card component
    - Test card renders with correct border and background
    - Test interactive variant includes hover classes
    - Test transition classes are applied
    - Test dark mode classes are present
    - Test padding and border-radius values
    - _Requirements: 2.2, 3.4_

- [x] 7. Refine Table Component
  - [x] 7.1 Update Table component optimized for data density
    - Update `components/ui/Table.tsx` className strings only
    - Update table headers: uppercase, tracking-wide, text-xs, bg-neutral-50
    - Update header text color: text-neutral-600 (light), text-neutral-400 (dark)
    - Update row padding to `px-4 py-3` for optimal density
    - Add row hover state: `hover:bg-neutral-50` with `transition-colors duration-150`
    - Update row borders: `border-b border-neutral-100` (light), `border-neutral-800` (dark)
    - Apply monospace font for numeric columns: `font-mono tabular-nums`
    - Update dark mode backgrounds: headers bg-neutral-800/50, rows hover bg-neutral-800/50
    - Maintain existing table structure (thead, tbody, tr, th, td elements)
    - _Requirements: 2.5, 2.7, 4.3, 5.6_
  
  - [ ]* 7.2 Write property test for table row hover timing
    - **Property 7: Table Row Hover Feedback**
    - **Validates: Requirements 5.6**
    - Generate random table configurations
    - Verify hover transition duration <= 150ms
    - Verify ease-out timing function applied
    - _Requirements: 5.6_
  
  - [ ]* 7.3 Write unit tests for Table component
    - Test header styling includes uppercase and small text
    - Test row padding matches specification (py-3)
    - Test hover classes are applied to rows
    - Test numeric columns use monospace font
    - Test dark mode classes are present
    - _Requirements: 2.5, 4.3_

- [x] 8. Refine Modal Component
  - [x] 8.1 Update Modal component with backdrop blur and transitions
    - Update `components/ui/Modal.tsx` className strings only
    - Update backdrop: `bg-black/50 backdrop-blur-sm` with `transition-opacity duration-300`
    - Update modal content: `shadow-sm` (minimal shadow for elevation)
    - Add enter/exit transitions: initial `scale-95 opacity-0`, open `scale-100 opacity-100`
    - Apply border `border border-neutral-200` and background `bg-white`
    - Add dark mode variants (bg-neutral-800, border-neutral-700)
    - Apply padding `p-6` and border-radius `rounded-lg`
    - Use data attributes for state-based styling (data-state="open|closed")
    - Maintain existing modal open/close logic and event handlers
    - _Requirements: 2.6, 2.7, 5.3, 8.6_
  
  - [ ]* 8.2 Write property test for modal animation timing
    - **Property 4: Modal Animation Specification**
    - **Validates: Requirements 5.3**
    - Generate random modal instances
    - Verify animation duration between 200ms and 300ms
    - Verify backdrop fade and content scale animations present
    - _Requirements: 5.3_
  
  - [ ]* 8.3 Write unit tests for Modal component
    - Test backdrop includes blur and opacity transition
    - Test modal content has shadow-sm
    - Test enter/exit transition classes present
    - Test dark mode classes are present
    - Test data-state attribute controls visibility
    - _Requirements: 2.6, 5.3_

- [x] 9. Checkpoint - Verify all base components refined
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Update Landing Page Hero Section
  - [x] 10.1 Refine hero section with gradient overlay and typography
    - Update `app/(main)/page.tsx` hero section className strings only
    - Apply full-width background image with gradient overlay
    - Use gradient: `bg-gradient-to-b from-black/60 via-black/40 to-black/60`
    - Update heading: `font-display text-6xl md:text-7xl font-bold` with negative letter-spacing
    - Update subheading: `text-xl md:text-2xl font-sans` with muted color
    - Apply refined CTA button spacing with gap-4
    - Ensure responsive breakpoints maintained (md, lg)
    - _Requirements: 3.1, 3.3, 3.7_
  
  - [ ]* 10.2 Write unit tests for hero section
    - Test hero section includes gradient overlay
    - Test heading uses display font and correct size
    - Test CTA buttons use refined brand colors
    - Test responsive classes are present
    - _Requirements: 3.1, 3.3_

- [ ] 11. Update Landing Page Feature Sections
  - [ ] 11.1 Refine feature sections with icon containers and cards
    - Update feature section className strings in `app/(main)/page.tsx`
    - Apply layered backgrounds: base (gray-50/900), surface (white/gray-800)
    - Create icon containers: `w-16 h-16 rounded-lg bg-brand-olive-100` with dark variant
    - Update feature card styling with subtle borders and refined spacing
    - Apply grid layout with responsive columns (grid-cols-1 md:grid-cols-3)
    - Use spacing-6 or spacing-8 between feature cards
    - Update typography hierarchy: title with font-display, description with muted color
    - _Requirements: 3.2, 3.3, 3.5_
  
  - [ ]* 11.2 Write unit tests for feature sections
    - Test feature cards use layered backgrounds
    - Test icon containers have subtle background fills
    - Test grid layout includes responsive columns
    - Test typography hierarchy with display font for titles
    - _Requirements: 3.2, 3.5_

- [ ] 12. Update Landing Page Product Cards
  - [ ] 12.1 Refine product cards with hover states and image treatment
    - Update product card className strings (likely in `components/ProductCard.tsx`)
    - Apply subtle border: `border border-neutral-200`
    - Add group class for hover effects
    - Apply hover state: `hover:border-brand-olive-300 hover:shadow-sm`
    - Add image hover effect: `group-hover:scale-105 transition-transform duration-300`
    - Update product name: `font-display text-lg font-semibold`
    - Update price display: `font-mono text-2xl font-bold text-brand-olive-600`
    - Apply transition: `transition-all duration-200 ease-out`
    - Add dark mode variants for all elements
    - _Requirements: 3.4, 3.7, 5.2_
  
  - [ ]* 12.2 Write property test for card hover feedback
    - **Property 3: Clickable Card Hover Feedback**
    - **Validates: Requirements 5.2**
    - Generate random product card configurations
    - Verify hover transition duration <= 200ms
    - Verify border color change and background shift present
    - _Requirements: 5.2_
  
  - [ ]* 12.3 Write unit tests for product cards
    - Test card includes hover state classes
    - Test image includes scale transform on hover
    - Test product name uses display font
    - Test price uses monospace font
    - Test dark mode classes are present
    - _Requirements: 3.4, 3.7_

- [ ] 13. Update Admin Dashboard Sidebar
  - [ ] 13.1 Refine admin sidebar navigation with active states
    - Update `app/admin/AdminSidebar.tsx` className strings only
    - Update sidebar background with surface color differentiation
    - Apply refined navigation link styling with hover states
    - Update active link indicator with brand-olive color
    - Add transition: `transition-colors duration-150 ease-out`
    - Update spacing between navigation items (space-y-2)
    - Apply dark mode variants for all sidebar elements
    - Maintain existing navigation logic and routing
    - _Requirements: 4.6, 5.1_
  
  - [ ]* 13.2 Write unit tests for admin sidebar
    - Test sidebar uses surface background color
    - Test navigation links include hover states
    - Test active link styling uses brand color
    - Test transition classes are applied
    - Test dark mode classes are present
    - _Requirements: 4.6_

- [ ] 14. Update Admin Dashboard Metric Cards
  - [x] 14.1 Refine metric cards with monospace numbers and hierarchy
    - Update metric card className strings in `app/admin/page.tsx`
    - Update label: `text-xs uppercase tracking-wide text-neutral-500`
    - Update value: `font-mono text-4xl font-bold tabular-nums`
    - Apply neutral color for value (neutral-900 / neutral-100 dark)
    - Add trend indicator styling with semantic colors
    - Apply card styling from refined Card component
    - Use spacing-2 between label and value, spacing-1 for trend
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 14.2 Write unit tests for metric cards
    - Test label uses uppercase and tracking
    - Test value uses monospace font and tabular-nums
    - Test trend indicators use semantic colors
    - Test card follows refined Card component styling
    - _Requirements: 4.2_

- [ ] 15. Update Admin Dashboard Data Tables
  - [ ] 15.1 Apply refined Table component to admin data tables
    - Update order table in `app/admin/pesanan/page.tsx` to use refined Table styles
    - Update product table in `app/admin/produk/page.tsx` to use refined Table styles
    - Update category table in `app/admin/kategori/page.tsx` to use refined Table styles
    - Apply monospace font to numeric columns (order ID, price, stock, quantity)
    - Ensure status badges use refined Badge component
    - Apply neutral-cool color palette to all data presentation
    - Maintain existing table data fetching and server actions
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ]* 15.2 Write unit tests for admin tables
    - Test tables use refined Table component styles
    - Test numeric columns use monospace font
    - Test status badges use refined Badge variants
    - Test neutral-cool palette applied
    - _Requirements: 4.1, 4.3, 4.4_

- [ ] 16. Update Admin Dashboard Forms
  - [ ] 16.1 Refine admin form sections with grouped inputs
    - Update product form in `app/admin/produk/ProductForm.tsx`
    - Update order status form in `app/admin/pesanan/[id]/OrderStatusForm.tsx`
    - Update profile form in `app/(main)/profil/ProfilForm.tsx`
    - Update checkout form in `app/(main)/keranjang/CheckoutForm.tsx`
    - Apply refined Input component styling to all form inputs
    - Update label styling: `text-xs uppercase tracking-wide font-medium text-neutral-700`
    - Apply grid layouts for input grouping (grid-cols-1 md:grid-cols-2)
    - Use spacing-6 for spacing between input groups
    - Apply refined Button component to form action buttons
    - Add form section borders: `border-t border-neutral-200 pt-4` for action areas
    - Maintain all existing form logic, validation, and server actions
    - _Requirements: 4.5, 6.4, 6.5_
  
  - [ ]* 16.2 Write unit tests for admin forms
    - Test all inputs use refined Input component styling
    - Test labels use uppercase and tracking
    - Test grid layouts for input grouping
    - Test action buttons use refined Button component
    - Test form logic and validation unchanged
    - _Requirements: 4.5, 6.5_

- [ ] 17. Checkpoint - Verify all page layouts updated
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Add Transition Classes to Interactive Elements
  - [ ] 18.1 Apply transition classes to remaining interactive elements
    - Add `transition-colors duration-150 ease-out` to all button elements not yet updated
    - Add `transition-colors duration-200 ease-out` to card elements
    - Add `transition-colors duration-150 ease-out` to input elements
    - Add `transition-opacity duration-300 ease-out` to modal overlays
    - Verify all interactive elements have appropriate timing (150-300ms)
    - Ensure ease-out timing function used consistently
    - _Requirements: 2.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8_
  
  - [ ]* 18.2 Write property test for consistent transition timing
    - **Property 1: Consistent Interactive Transition Timing**
    - **Validates: Requirements 2.7, 5.8**
    - Generate random interactive components
    - Verify transition duration between 150ms and 300ms
    - Verify ease-out timing function applied
    - _Requirements: 2.7, 5.8_
  
  - [ ]* 18.3 Write property test for ease-out timing consistency
    - **Property 9: Ease-Out Timing Function Consistency**
    - **Validates: Requirements 5.8**
    - Generate random interactive elements with transitions
    - Verify timing function is cubic-bezier(0, 0, 0.2, 1)
    - _Requirements: 5.8_

- [ ] 19. Verify Dark Mode Across All Components
  - [ ] 19.1 Test and refine dark mode color contrast and hierarchy
    - Review all components in dark mode
    - Verify borders visible but subtle in dark mode
    - Check elevated surfaces (modals, dropdowns) lighter than base
    - Verify status badges legible with adjusted colors
    - Test color contrast ratios meet WCAG AA standards
    - Adjust any components with insufficient contrast
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 19.2 Write property test for dark mode border visibility
    - **Property 15: Dark Mode Border Visibility**
    - **Validates: Requirements 8.5**
    - Generate random components with borders in dark mode
    - Verify border lightness > background lightness
    - _Requirements: 8.5_
  
  - [ ]* 19.3 Write property test for dark mode surface hierarchy
    - **Property 16: Dark Mode Elevated Surface Hierarchy**
    - **Validates: Requirements 8.6**
    - Generate random elevated surfaces in dark mode
    - Verify surface background lightness > base background lightness
    - _Requirements: 8.6_

- [ ] 20. Add Reduced Motion Support
  - [ ] 20.1 Wrap animations with prefers-reduced-motion media query
    - Identify all components with animations (transitions, transforms)
    - Wrap animation classes in `@media (prefers-reduced-motion: no-preference)`
    - For reduced motion preference, provide instant state changes
    - Update globals.css with reduced motion utilities if needed
    - Test with browser reduced motion setting enabled
    - _Requirements: 7.6_
  
  - [ ]* 20.2 Write property test for reduced motion respect
    - **Property 13: Reduced Motion Preference Respect**
    - **Validates: Requirements 7.6**
    - Generate random animated elements
    - Simulate prefers-reduced-motion: reduce
    - Verify animations reduced or eliminated
    - _Requirements: 7.6_

- [ ] 21. Verify Accessibility Attributes Preserved
  - [ ] 21.1 Audit all updated components for accessibility
    - Check all buttons maintain appropriate aria labels
    - Verify form inputs maintain label associations
    - Check modals maintain aria-modal and role attributes
    - Verify table headers maintain scope attributes
    - Test keyboard navigation for all interactive elements
    - Run automated accessibility tests with axe or similar tool
    - _Requirements: 7.2, 7.3_
  
  - [ ]* 21.2 Write property test for ARIA attribute preservation
    - **Property 10: ARIA Attribute Preservation**
    - **Validates: Requirements 7.2**
    - Compare components before/after redesign
    - Verify ARIA attributes match
    - _Requirements: 7.2_
  
  - [ ]* 21.3 Write property test for keyboard navigation
    - **Property 11: Keyboard Navigation Support**
    - **Validates: Requirements 7.3**
    - Generate random interactive elements
    - Verify keyboard event handlers present (Enter, Space, Tab, Arrow keys)
    - _Requirements: 7.3_
  
  - [ ]* 21.4 Write property test for color contrast
    - **Property 12: Color Contrast Accessibility**
    - **Validates: Requirements 7.4**
    - Generate random text-background color pairs from design tokens
    - Verify contrast ratio >= 4.5:1 for normal text
    - Verify contrast ratio >= 3:1 for large text
    - _Requirements: 7.4_

- [ ] 22. Verify Responsive Breakpoints
  - [ ] 22.1 Test responsive layouts at all breakpoints
    - Test mobile layout (< 768px)
    - Test tablet layout (768px - 1024px)
    - Test desktop layout (> 1024px)
    - Verify grid layouts collapse appropriately
    - Check hero section responsive text sizes
    - Verify admin sidebar behavior on mobile
    - Check form layouts on mobile devices
    - _Requirements: 7.5_
  
  - [ ]* 22.2 Write unit tests for responsive classes
    - Test components include md: and lg: breakpoint classes
    - Test grid layouts have responsive column definitions
    - Test typography includes responsive size classes
    - _Requirements: 7.5_

- [ ] 23. Performance Verification
  - [ ] 23.1 Verify no performance regression from redesign
    - Run Lighthouse performance audit on landing page
    - Run Lighthouse performance audit on admin dashboard
    - Compare Core Web Vitals to baseline (before redesign)
    - Check CSS bundle size (should not increase significantly due to Tailwind purging)
    - Test page load times on slow 3G network
    - Verify Next.js Image component still used for all images
    - _Requirements: 7.1, 7.7_
  
  - [ ]* 23.2 Write integration tests for performance
    - Test landing page loads within acceptable time
    - Test admin dashboard loads within acceptable time
    - Test CSS bundle size within limits
    - _Requirements: 7.1_

- [ ] 24. Final Checkpoint - Comprehensive verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test-related sub-tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- All changes are className-only modifications to maintain existing functionality
- Implementation follows bottom-up approach: tokens → components → pages → interactions
- Checkpoints ensure incremental validation at logical breaks
- Property tests validate universal correctness properties from the design document
- Dark mode verification is a separate phase to ensure comprehensive testing
- All TypeScript logic, component APIs, server actions, and routing remain unchanged
- The redesign uses only Tailwind CSS without new dependencies

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 2, "tasks": ["3.2", "4.2", "5.2", "6.1", "7.1", "8.1"] },
    { "id": 3, "tasks": ["6.2", "7.2", "7.3", "8.2", "8.3"] },
    { "id": 4, "tasks": ["10.1", "11.1", "12.1", "13.1", "14.1"] },
    { "id": 5, "tasks": ["10.2", "11.2", "12.2", "12.3", "13.2", "14.2", "15.1", "16.1"] },
    { "id": 6, "tasks": ["15.2", "16.2"] },
    { "id": 7, "tasks": ["18.1"] },
    { "id": 8, "tasks": ["18.2", "18.3", "19.1", "20.1", "21.1"] },
    { "id": 9, "tasks": ["19.2", "19.3", "20.2", "21.2", "21.3", "21.4", "22.1"] },
    { "id": 10, "tasks": ["22.2", "23.1"] },
    { "id": 11, "tasks": ["23.2"] }
  ]
}
```
