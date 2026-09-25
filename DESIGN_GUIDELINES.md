# Design System Guidelines - Etira Mushrooms

## Typography Scale (Konsisten untuk semua komponen)

### Headings
- `text-4xl sm:text-5xl` - Hero headings (Page titles)
- `text-3xl sm:text-4xl` - Section headings (H1)
- `text-2xl sm:text-3xl` - Subsection headings (H2)  
- `text-xl sm:text-2xl` - Component headings (H3)
- `text-lg` - Small headings (H4)

### Body Text
- `text-base` - Standard body text (16px)
- `text-sm` - Secondary text, captions (14px)
- `text-xs` - Small labels, meta info (12px)

### Special Cases
- `text-[10px]` - Tiny labels, breadcrumbs (hanya untuk navigasi kecil)
- `text-[11px]` - Form helper text

## Spacing Scale (4px base unit)

### Standard Spacing Values
- `0` (0px) - No spacing
- `1` (4px) - Minimal spacing
- `2` (8px) - Compact spacing  
- `3` (12px) - Standard spacing
- `4` (16px) - Comfortable spacing
- `6` (24px) - Large spacing
- `8` (32px) - Section spacing
- `12` (48px) - Large section spacing
- `16` (64px) - Hero section spacing

### DILARANG - Spacing Non-Standard
❌ Jangan gunakan:
- `.5`, `1.5`, `2.5`, `3.5`, `4.5` (spacing pecahan)
- `5`, `7`, `9`, `10`, `11`, `14`, `15` (tidak mengikuti base 4px)
- `18`, `20`, `22`, `28`, `36`, `40`, `44`, `52`, `56`, `60`, `72`, `80`, `96` (arbitrary values)

### Padding Internal
- `p-1` (4px) - Tiny elements, badges
- `p-2` (8px) - Compact buttons, small badges
- `p-3` (12px) - Standard buttons, form inputs
- `p-4` (16px) - Cards, containers
- `p-6` (24px) - Large cards, page sections
- `p-8` (32px) - Hero sections

### Padding Directional
- `px-2 py-1` - Small badges
- `px-3 py-2` - Standard buttons
- `px-4 py-3` - Large buttons, inputs
- `px-6 py-4` - CTA buttons
- `px-8 py-4` - Hero CTAs

### Margins & Gaps
- `gap-1` (4px) - Tight elements
- `gap-2` (8px) - Icon + text, inline elements
- `gap-3` (12px) - Form elements
- `gap-4` (16px) - Card content spacing
- `gap-6` (24px) - Grid items, sections
- `mb-2` (8px) - Small element spacing
- `mb-4` (16px) - Standard element bottom margin
- `mb-6` (24px) - Section bottom margin
- `mb-8` (32px) - Large section spacing

### Layout Spacing
- `py-8` (32px) - Compact sections
- `py-12` (48px) - Small sections
- `py-16` (64px) - Standard sections  
- `py-20` (80px) - Large sections
- `py-24` (96px) - Hero sections

## Color Usage

### Brand Colors Only
- Gunakan `brand-forest-*` untuk primary actions
- Gunakan `brand-fresh-*` untuk success/freshness indicators
- Gunakan `brand-earth-*` untuk secondary elements
- Gunakan `brand-amber-*` untuk CTAs dan highlights

### Neutral Colors
- Gunakan `neutral-*` untuk backgrounds dan borders
- Hindari warna Tailwind default (emerald, green, blue, etc.)

## Component Standards

### Buttons
- Primary: `px-6 py-3 text-sm font-semibold`
- Secondary: `px-4 py-2 text-sm font-medium`
- Small: `px-3 py-1.5 text-xs font-medium`

### Cards
- Standard: `p-4 rounded-lg`
- Large: `p-6 rounded-xl`  
- Compact: `p-3 rounded-md`

### Inputs
- Standard: `px-3 py-2 text-sm`
- Large: `px-4 py-3 text-base`

### Badges  
- Small: `px-2 py-0.5 text-xs`
- Standard: `px-2.5 py-1 text-xs`

## Responsive Patterns

### Font Scaling
- Selalu gunakan responsive font: `text-base sm:text-lg`
- Hero text: minimal 2 breakpoint (`text-3xl sm:text-4xl lg:text-5xl`)

### Spacing Scaling  
- Section padding: `py-12 sm:py-16 lg:py-20`
- Container padding: `px-4 sm:px-6 lg:px-8`

## Aturan Konsistensi

1. **Tidak boleh** menggunakan warna Tailwind default (emerald, green, blue, red, purple)
2. **Harus** menggunakan font scale yang sudah didefinisikan
3. **Harus** menggunakan spacing scale berbasis 4px
4. **Selalu** responsive dengan minimal 2 breakpoint untuk text
5. **Konsisten** padding/margin dalam satu jenis komponen