# Duotone System Migration

**Date:** 2025-01-XX  
**Goal:** Simplify color palette from multi-brand to duotone (Green + Gray only)  
**Result:** Less AI-looking, more focused brand identity

---

## What Changed

### Color Palette Simplification

**Before (Multi-color):**
```
brand.forest   (green)    ✅ Keep
brand.earth    (brown)    ❌ Removed
brand.amber    (orange)   ❌ Removed  
brand.fresh    (green2)   ❌ Removed
```

**After (Duotone):**
```
brand.forest   (primary green)  ✅ Only brand color
neutral.*      (gray scale)     ✅ For everything else
semantic.*     (functional)     ✅ Status only
```

---

## Files Modified

### 1. Core Configuration
- ✅ `tailwind.config.ts` - Removed earth/amber/fresh scales
- ✅ `app/globals.css` - Simplified CSS variables

### 2. Components Updated
- ✅ `components/ui/Button.tsx` - Removed `cta` variant
- ✅ `components/ui/Badge.tsx` - Removed `earth` variant
- ✅ `components/StatusBadge.tsx` - Changed DIKIRIM: earth → outline
- ✅ `components/HeroCinematic.tsx` - Changed fresh → forest
- ✅ `components/ProductCard.tsx` - Changed amber → forest, earth → warning
- ✅ `components/TrustBanner.tsx` - Changed fresh → success, earth → neutral

---

## Color Usage Guide

### Primary Green (brand.forest)
**Use for:**
- ✅ Primary buttons & CTAs
- ✅ Links & active states
- ✅ Brand moments (logo accents, hero highlights)
- ✅ Focus rings
- ✅ Success indicators (if semantic green doesn't fit)

**Example:**
```tsx
<button className="bg-brand-forest-600 hover:bg-brand-forest-700">
  Order Now
</button>
```

### Neutral Gray (neutral)
**Use for:**
- ✅ Text (50-900 scale)
- ✅ Backgrounds (50-100 for light, 800-900 for dark)
- ✅ Borders (200-300)
- ✅ Cards & containers
- ✅ Secondary buttons
- ✅ Disabled states

**Example:**
```tsx
<div className="bg-white border border-neutral-200">
  <p className="text-neutral-900">Content</p>
</div>
```

### Semantic Colors (functional only)
**Use ONLY for:**
- ✅ Status badges (success, warning, danger, info)
- ✅ Form validation (error states, success messages)
- ✅ System alerts

**Example:**
```tsx
<Badge variant="success">Available</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>
```

---

## Migration Benefits

### 1. Less AI-Looking ✅
- Simpler palette = more intentional design
- No over-engineered color system
- Feels handcrafted, not generated

### 2. Stronger Brand Identity ✅
- Single brand color = more memorable
- Green directly associated with natural/organic
- No confusion about which color to use

### 3. Easier Maintenance ✅
- Developers: "What color?" → "Green or gray"
- Less decision fatigue
- Faster development

### 4. Better Performance ✅
- Smaller CSS (removed unused color scales)
- Less Tailwind class permutations

---

## Before vs After Examples

### Hero Section
```tsx
// Before
<span className="text-brand-fresh-300">Premium Mushrooms</span>
<span className="bg-brand-fresh-400">●</span>

// After
<span className="text-brand-forest-300">Premium Mushrooms</span>
<span className="bg-brand-forest-400">●</span>
```

### Product Card
```tsx
// Before
<ChefHat className="text-brand-amber-600" />
<Badge variant="earth">Low Stock</Badge>

// After
<ChefHat className="text-brand-forest-600" />
<Badge variant="warning">Low Stock</Badge>
```

### Buttons
```tsx
// Before
<Button variant="cta">Order</Button>

// After
<Button variant="primary">Order</Button>
```

---

## Testing Checklist

- ✅ TypeScript: No errors
- ✅ ESLint: No warnings
- ✅ Hero section displays correctly
- ✅ Product cards look good
- ✅ Status badges work (all order statuses)
- ✅ Buttons render properly
- ✅ Dark mode still works
- ✅ i18n not affected

---

## Rollback (If Needed)

If you need to revert:
```bash
git revert HEAD
```

Or restore from:
- `tailwind.config.ts` (restore earth/amber/fresh)
- `app/globals.css` (restore old CSS vars)
- Individual component files

---

## What's Next?

Optional improvements (not required):
1. Audit admin panel colors (might still have old colors)
2. Consider removing CSS variable aliases (sage, clay, forest legacy names)
3. Update DESIGN_SYSTEM.md with duotone guidelines

---

**Status:** ✅ Complete  
**Impact:** Visual only, no functionality changes  
**Risk:** Low (all tests passed)
