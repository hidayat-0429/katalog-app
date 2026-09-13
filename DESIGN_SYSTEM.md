# Design System — PT Eka Timur Raya (B2B Jamur)

## Warna

### Light Mode
- Background utama: `#FAFAF7` (off-white hangat)
- Background subtle / kartu: `#F5F4F0`
- Surface (modal, dropdown): `#FFFFFF`
- Primary (olive green): `#4A5D3A`
- Primary hover: `#3D4E30`
- Primary light (badge/bg aksen): `#E8EFE3`
- CTA (amber): `#E8A33D`
- CTA hover: `#D4922F`
- Text utama: `#1F2419`
- Text muted: `#6B7263`
- Border: `#E5E3DC` (1px solid, konsisten)
- Danger/Error: `#B94A48`
- Danger bg: `#FDF0EF`

### Dark Mode
- Background utama: `#141410`
- Background subtle: `#1C1C18`
- Surface: `#222220`
- Primary: `#7FA882`
- Primary hover: `#95BC98`
- CTA: `#E8A33D`
- Text utama: `#E5E5E0`
- Text muted: `#9C9C90`
- Border: `#2C2C28`

### Status Pills
| Status     | Background | Text      |
|------------|-----------|-----------|
| Menunggu   | `#FDF3E3` | `#8B6914` |
| Diproses   | `#E8F1FB` | `#1A5FB4` |
| Dikirim    | `#F0E8FB` | `#6C3FA0` |
| Selesai    | `#EAF4EA` | `#2D5A27` |
| Dibatalkan | `#FDF0EF` | `#B94A48` |
| Netral     | `#F1F0EB` | `#6B7263` |

## Tipografi

- **Heading** (h1–h3): `Bricolage Grotesque` — bold, tracking tight
- **Body / paragraf**: `Figtree` — regular/medium
- **Angka, harga, kode pesanan**: `font-mono` (JetBrains Mono atau Inter monospace fallback)
- **Format harga**: `Rp 150.000` (tanpa desimal, titik sebagai pemisah ribuan)
- **Satuan**: ditulis jelas setelah harga → `/kg`, `/karton`, `/pak`, `/kaleng`, `/pouch`

## Aturan Visual

### Wajib
- Border radius maksimal `10px` (gunakan `rounded`, `rounded-md`, atau `rounded-lg max-[10px]`)
- Border: selalu `1px solid` menggunakan warna border dari palet, tidak ada border tebal
- Ikon: **Lucide React** saja, tidak ada emoji sebagai ikon dekoratif
- Bahasa: **Indonesia** untuk semua label, tombol, pesan error, dan placeholder
- Setiap komponen baru HARUS menggunakan warna & font dari dokumen ini

### Dilarang
- ❌ Gradasi / gradient
- ❌ Warna purple / ungu (kecuali status pill "Dikirim")
- ❌ Glassmorphism / blur / backdrop-filter
- ❌ Box-shadow besar (shadow hanya boleh untuk dropdown & modal, dan harus tipis: `shadow-sm` maks)
- ❌ Emoji sebagai ikon (🏭❄️📦 dsb) — ganti dengan ikon Lucide yang sesuai
- ❌ Animasi berlebihan — hanya transisi halus (`transition-colors`, `transition-opacity`)

## Komponen Referensi

### Tombol
- **Primary**: bg `#4A5D3A`, text white, hover `#3D4E30`, rounded `8px`, padding `10px 20px`
- **CTA / Aksi utama**: bg `#E8A33D`, text `#1F2419`, hover `#D4922F`
- **Secondary**: bg transparent, border `1px #E5E3DC`, text `#1F2419`, hover bg `#F5F4F0`
- **Danger**: bg transparent, border `1px #B94A48`, text `#B94A48`, hover bg `#FDF0EF`
- **Disabled**: opacity `0.5`, cursor `not-allowed`

### Kartu Produk (ProductCard)
- Border: `1px solid #E5E3DC`
- Radius: `8px`
- Foto: rasio `4:3`, object-fit cover
- Nama produk: `Figtree` semibold, 1 baris (truncate)
- Harga: `font-mono` bold + satuan muted (`/karton`)
- Badge stok: kecil, di pojok, bg sesuai status pill

### Input / Form
- Border: `1px solid #E5E3DC`
- Radius: `8px`
- Focus: border `#4A5D3A`, ring tipis `2px #E8EFE3`
- Placeholder: text muted `#6B7263`
- Label: `Figtree` medium, ukuran kecil (`text-xs`), uppercase tracking wider

### Tabel (Admin)
- Header: bg `#F5F4F0`, text `#6B7263`, uppercase, `text-xs`
- Row: border-bottom `1px #E5E3DC`
- Row hover: bg `#FAFAF7`
- Padding rapi: `px-4 py-3`

## Struktur Layout

### Navbar
- Tinggi: `64px`
- Background: `#FAFAF7` (light) / `#141410` (dark)
- Border-bottom: `1px solid #E5E3DC`
- Logo: teks bold `Bricolage Grotesque`
- Nav items: `Figtree` medium, hover underline atau color shift ke primary

### Footer
- Background: `#F5F4F0` (light) / `#1C1C18` (dark)
- Border-top: `1px solid #E5E3DC`
- Grid 3 kolom: Brand info | Navigasi | Kontak
- Teks: `text-xs` sampai `text-sm`, warna muted

### Admin Sidebar
- Background: `#4A5D3A` (olive green solid)
- Text: white
- Active menu: bg `#3D4E30`, border-left `3px solid #E8A33D`
- Ikon menu: Lucide, ukuran `18px`, warna white/muted

## Catatan untuk AI / Developer
- Jangan mengubah logika apapun: `use server`, `useTransition`, `startTransition`, server actions, Prisma calls, routing — JANGAN DISENTUH
- Hanya ubah: class Tailwind CSS, struktur HTML/JSX, dan impor font/ikon
- Pastikan semua perubahan tetap responsif (mobile-first) dan mendukung dark mode
- Gunakan custom color dari `tailwind.config.ts` — jangan pakai warna Tailwind default (blue-500 dsb) kecuali memang sesuai palet di atas
