# Design System PT Eka Timur Raya (Etira Mushrooms) — B2B Jamur

Dokumen ini adalah **satu-satunya sumber kebenaran** untuk tampilan. Ia mendeskripsikan
sistem yang **benar-benar terpakai di kode**, bukan rencana lama. Kalau dokumen dan kode
bertabrakan, kodenya yang benar dan dokumen inilah yang harus diperbaiki.

Menggantikan: `DESIGN_SYSTEM.md` versi lama, `DESIGN_GUIDELINES.md`,
`CONSISTENCY_REVIEW_SUMMARY.md`, dan `DUOTONE_MIGRATION.md` (ketiganya sudah dihapus
dari repo — isinya sudah menyatu di dokumen ini).

Sistemnya **duotone**: satu warna merek (hijau hutan) + satu tangga abu netral. Warna
lain (`semantic-*`) hanya boleh muncul sebagai penanda status, tidak sebagai dekorasi.

Referensi kode:
- Token & tema: `app/globals.css`, `tailwind.config.ts`
- Primitif UI: `components/ui/` (`Button`, `Badge`, `Input`, `Card`, `Table`, `Modal`, `Toggle`, `index.ts`)
- Komponen domain: `components/ProductCard.tsx`, `components/ProductVisual.tsx`, `components/StatusBadge.tsx`, `components/HeroCinematic.tsx`
- helper angka/tanggal: `lib/format.ts` (`formatRupiah`, `statusLabel`)

---

## 1. Cara memilih warna (urutan prioritas)

1. **Pakai primitif `components/ui/*`** kalau sudah ada bentuknya (tombol, badge, input,
   kartu, tabel, modal, toggle). Primitif ini sudah membawa varian light + dark.
2. **Pakai token CSS-var** (`bg-bg`, `bg-bg-subtle`, `bg-surface`, `text-charcoal`,
   `text-charcoal-muted`, `border-border`, `border-border-subtle`, `primary`, `danger`,
   `info`, `success`, `warning`) untuk permukaan dan teks halaman. Token ini
   **otomatis berubah di dark mode** karena nilainya di-override di blok `.dark` — jadi
   tidak perlu menulis `dark:` sama sekali.
3. **Pakai skala literal** (`brand-forest-*`, `neutral-*`, `semantic-*`) hanya kalau butuh
   tone spesifik/aksen. Skala ini **tidak** otomatis — setiap pemakaian wajib ditemani
   varian `dark:`. Pastikan shade-nya benar-benar ada di `tailwind.config.ts`: class yang
   menunjuk shade kosong (mis. `brand-forest-950` sebelum tangga itu dibuat) tidak
   menghasilkan CSS sama sekali, jadi chip tetap terang di dark mode tanpa peringatan apa pun.
4. **Jangan** hard-code hex di class (`bg-[#faf9f6]`). Kalau warna belum ada di tema,
   tambahkan token/varian baru di `tailwind.config.ts` atau `globals.css`.

Catatan penting: `neutral` di proyek ini **bukan** abu bawaan Tailwind. Skalanya sudah
ditimpa (`#f8f9fa` → `#212529`) dan merupakan bagian resmi sistem. Warna bawaan lain
(`blue-*`, `green-*`, `emerald-*`, `red-*`, `amber-*`, `stone-*`) **sudah habis** dari
kode — jangan ditulis lagi; state form dan badge pakai tangga `semantic-*`. Skala merek
lain (`brand-earth`, `brand-amber`, `brand-fresh`) sudah dihapus dari tema bersama
varian `cta` di `Button` dan varian `earth` di `Badge` — satu-satunya warna di luar
hijau/abu yang diizinkan adalah hijau WhatsApp (`#25D366`); scrim foto di hero memakai
hitam transparan (`black/*`), bukan warna hex — lihat §8.

Teks sekunder **selalu** lewat satu token: `text-charcoal-muted` (5.2:1 di atas kartu
putih, 4.9:1 di kartu gelap). Jangan menulis `text-neutral-400/500/600` untuk teks muted
— di light mode angka itu cuma 1.5–3.3:1 dan bacanya pegal, di dark mode kamu harus
menambah varian `dark:` lagi. `placeholder:text-neutral-400` dan state `disabled:` tetap
boleh pucat karena memang bukan isi.

### Token CSS (nilai sebenarnya)

| Token | Light | Dark | Dipakai untuk |
|---|---|---|---|
| `bg` | `#F1F3F5` | `#0F1110` | Latar halaman |
| `bg-subtle` | `#E9ECEF` | `#212529` | Panel, blok aksen, input, placeholder produk |
| `surface` | `#FFFFFF` | `#3A424A` | Kartu, popover, modal, footer |
| `primary` | `#2D5A27` | `#6B9B6B` | Aksi utama, tautan aktif, garis fokus |
| `primary-hover` | `#1E4A1A` | `#8FB88F` | Hover aksi utama |
| `primary-light` | `#F0F7F0` | `#1E3218` | Latar terpilih, `::selection` |
| `charcoal` | `#212529` | `#F8F9FA` | Teks utama |
| `charcoal-muted` | `#646B66` | `#ADB5BD` | Teks sekunder, caption, ikon placeholder |
| `border` | `#DEE2E6` | `#495057` | Garis pemisah 1px |
| `border-subtle` | `#DEE2E6` | `#343A40` | Garis dalam panel |
| `danger` | `#EF4444` | `#F87171` | Kesalahan, hapus, pembatalan |
| `danger-bg` | `#FEE2E2` | `#7F1D1D` | Latar pesan error |
| `success` | `#10B981` | `#22C55E` | Status tersedia / selesai |
| `success-bg` | `#D1FAE5` | `#064E3B` | Latar pesan sukses |
| `warning` | `#F59E0B` | `#FBBF24` | Stok menipis, peringatan |
| `warning-bg` | `#FEF3C7` | `#78350F` | Latar pesan peringatan |
| `info` | `#3B82F6` | `#60A5FA` | Status diproses, informasi |
| `info-bg` | `#DBEAFE` | `#1E3A8A` | Latar pesan info |

Mode gelap memakai tangga elevasi netral (bukan hijau): `bg` paling gelap untuk halaman,
`bg-subtle` untuk panel yang tenggelam, `surface` untuk kartu melayang. Jangan menulis
ulang nilai-nilai ini sebagai hex di class — sebut tokennya.

`--cta`, `--cta-hover`, `--fresh`, `--earth` sudah dihapus dari `globals.css` dan
`tailwind.config.ts`. Jangan menghidupkan namanya kembali: aksi komersial sekarang
memakai `primary` / `brand-forest-*`.

### Skala literal yang tersedia

- `brand.forest` 50–900 — satu-satunya warna merek (50 `#f0f7f0`, 500 `#2d5a27`,
  600 `#1e4a1a`, 700 `#163a13`)
- `neutral` 50–900 — abu dingin (teks sekunder, border, latar kontrol)
- `semantic.success|warning|danger|info` — masing-masing punya tangga **50–900** plus
  alias `.light` `DEFAULT` `.dark` `.darkBg`. Tangga ini dipakai untuk state
  form (border error, teks sukses, badge info). Nama bawaan Tailwind (`red-*`,
  `emerald-*`, `blue-*`, `green-*`, `amber-*`, `stone-*`) dan skala merek lama
  (`brand-earth`, `brand-amber`, `brand-fresh`) tidak ada lagi di tema — jangan ditulis.

### Tangga elevasi (dua mode)

| Peran | Light | Dark | Class |
|---|---|---|---|
| Latar halaman | `#F1F3F5` | `#0F1110` | `bg-bg` |
| Panel tenggelam / inset | `#E9ECEF` | `#212529` | `bg-bg-subtle` |
| Kartu, popover, modal, footer, band | `#FFFFFF` | `#3A424A` | `bg-surface` |
| Kontrol form (input, select, textarea, tombol sekunder, baris pilihan) | `#FFFFFF` | `#343A40` | `bg-white dark:bg-neutral-800` |
| Kartu/status aktif | `#FFFFFF` | `#343A40` | `bg-white dark:bg-neutral-800` |

Kanvas light sengaja **neutral-100, bukan neutral-50**: dengan `#F8F9FA` kartu putih
hanya beda 1,05:1 dan bingkai foto produk 1,00:1 (warna persis sama dengan halaman), jadi
daftar produk terbaca sebagai lembaran putih tanpa kotak. Sekarang 1,11:1 (isi) + 1,17:1
(garis tepi `neutral-300`) dan bingkai foto `neutral-200` 1,19:1 terhadap kartu. Dark mode
tidak disentuh — di sana kartunya sudah 1,86:1. Kalau suatu saat menambah section band
baru, pakai `bg-bg-subtle`; jangan `bg-neutral-50` lagi karena tone itu sekarang **lebih
terang** dari kanvas.

Aturannya: **wadah** memakai `bg-surface`, **kontrol** `bg-white dark:bg-neutral-800`.
Di dark mode sengaja dibuat bertingkat: halaman `#0F1110` < panel `#212529` < kontrol
`#343A40` < kartu `#3A424A`, jadi field masih terbaca di atas kartunya. Jangan pakai
`bg-white` polos untuk wadah — di mode gelap warnanya tidak ikut berubah dan langsung
jadi tapak putih menyala.

Warna font yang dipakai: display/headline = **Bricolage Grotesque** (`font-display` /
`font-heading`), body & UI = **Figtree** (`font-sans`, default), angka/harga/kode order =
**JetBrains Mono** (`font-mono`).

---

## 2. Radius, border, bayangan — dijaga oleh tema, bukan oleh disiplin

`tailwind.config.ts` sudah memotong skalanya, jadi class "terlarang" secara fisik tidak
bisa menghasilkan tampilan yang salah:

| Class | Hasil | Kapan |
|---|---|---|
| `rounded-sm` | 4px | badge kecil, chip |
| `rounded` / `rounded-md` | 6px | input, tombol kecil, panel |
| `rounded-lg` | 8px | **default** kartu, tombol, container |
| `rounded-xl` / `rounded-2xl` | 10px (dibatasi) | kartu besar, modal |
| `rounded-full` | pil | avatar, dot, pill status |

- Border: selalu `1px` (`border`, `border-border`). Tidak ada border tebal.
- Bayangan: `shadow-md`, `shadow-lg`, `shadow-xl` **semuanya disamakan** menjadi
  `0 1px 3px rgb(0 0 0 / .1)`. Pakai nama apa pun, hasilnya tipis. Utamakan `shadow-sm`
  dan hanya beri bayangan pada layer melayang (dropdown, modal, sidebar mobile).
- Bentuk kartu yang benar umumnya **tanpa bayangan**: `rounded-lg border border-border bg-surface`.

---

## 3. Tipografi

Skala `fontSize` sudah membawa line-height dan letter-spacing sendiri; makin besar teks,
makin rapat tracking-nya (mulai `xl` ke atas). Jangan menambah `tracking-*` manual
kecuali untuk label uppercase.

| Peran | Kelas |
|---|---|
| Judul hero | `font-heading` (alias `font-display`, sama-sama Bricolage); baris utama `.hero-title` (`clamp(2.6rem, 5.2vw + 1rem, 6rem)` + echo satu lapis `text-shadow: 0.045em 0.045em 0 rgb(143 184 143 / 0.32)`), baris kedua `.hero-subtitle` (`clamp(1.7rem, 2.6vw + 0.6rem, 3.6rem)`, `font-semibold`) — dua-duanya `text-white`, penekanan dari ukuran/bobot bukan warna. Echo dipakai **hanya** di `.hero-title`: offset dalam `em` membuatnya ikut besar-kecilnya clamp (1,9 px di HP → 4,3 px di monitor), dan rona `forest-300` dipilih karena judul ini selalu duduk di atas scrim foto gelap, tempat abu/hijau tua tidak terlihat. Judul halaman lain tetap datar — efek teks di atas latar terang langsung terbaca norak |
| Judul halaman (H1) | `font-heading text-2xl sm:text-3xl font-bold tracking-tight` — satu varian untuk semua halaman publik (profil, pesanan, keranjang, faq, tentang, kontak, invoice, login, register) |
| Judul entitas (H1 detail produk) | `font-heading text-3xl sm:text-4xl font-bold tracking-tight` — lebih besar karena nama produk adalah subjek halaman |
| Judul bagian dalam halaman (H2) | `font-heading text-2xl sm:text-3xl`; homepage pakai `<h2>` untuk judul katalog supaya `<h1>` hero tetap satu-satunya |
| Judul komponen (H3) | `font-display text-xl sm:text-2xl` |
| Judul kecil (H4) | `font-sans text-lg font-semibold` |
| Body | `font-sans text-base` |
| Teks sekunder / caption | `text-sm text-charcoal-muted` |
| Label form, meta | `text-xs uppercase tracking-wider` |
| Helper text | `text-[11px]` (jarang), breadcrumb `text-[10px]` |
| Harga, nomor order, angka | `font-mono` + `font-semibold` |

- Format harga: `Rp 150.000` tanpa desimal, titik sebagai pemisah ribuan → selalu lewat
  `formatRupiah()`, jangan menulis angka manual.
- Satuan ditulis setelah harga dengan gaya muted: `Rp 12.000<span class="text-charcoal-muted">/kg</span>`.
- Heading pendek: maksimal 2 baris di desktop, `leading-tight`.
- Skala fluidik khusus bagian atas homepage ada di `app/globals.css` sebagai enam kelas
  `clamp()`: `.hero-title`, `.hero-subtitle`, `.hero-lead` (`clamp(1rem, 0.6vw + 0.85rem,
  1.25rem)` + `max-width: 58ch`), `.hero-stat-value` (`clamp(1.25rem, 0.8vw + 0.9rem, 1.75rem)`),
  `.hero-stat-label` (`clamp(0.75rem, 0.3vw + 0.65rem, 0.85rem)`), plus `.hero-gutter` untuk
  padding kiri-kanan. Bawah clamp = ukuran HP, atas = monitor, jadi tidak ada breakpoint yang
  perlu dikejar per layar. Kelas lain di seluruh aplikasi tetap pakai tangga `text-*`.

---

## 4. Spacing

Skala dasar 4px dan sudah didefinisikan ulang di tema: `1`=4, `2`=8, `3`=12, `4`=16,
`6`=24, `8`=32, `12`=48, `16`=64.

- Dalam komponen: `gap-2` (ikon+teks), `gap-3` (antar field), `gap-4` (isi kartu).
- Antar elemen: `mb-2` / `mb-4` / `mb-6` / `mb-8`.
- Bagian halaman: halaman publik dengan satu kolom isi (`/faq`, `/profil`, `/pesanan`,
  `/keranjang`, `/kontak`, `/tentang`, invoice) pakai `py-8`; section homepage lebih longgar
  (`py-10 sm:py-14` / `py-16 sm:py-24`).
- Hero = tiga zona vertikal dalam satu section `min-h-[92vh] sm:min-h-screen flex flex-col`:
  lockup logo di atas (`pt-6 sm:pt-10 lg:pt-12`), blok judul + deskripsi + CTA di tengah
  (`flex-1` + `justify-center`), pita statistik di dasar (lebar penuh, `border-t` sampai
  pinggir). Sisa tinggi viewport didistribusikan jadi dua celah antar zona, bukan dibiarkan
  mengendap di bawah: sebelumnya konten nempel atas dengan `pb-24` dan hasilnya ±300px foto
  nganggur, yang dibaca sebagai "hero tidak full". Jangan balik ke `items-center` di level
  section — itu sumber pita ±290px di atas logo.
- Poros teks: rata tengah, **tanpa cap lebar** pada zona tengah dan pita angka — dua-duanya
  `w-full`; yang dibatasi cuma deskripsi lewat `.hero-lead` (`max-width: 58ch` — panjang
  baris diukur dalam karakter, bukan px, jadi tetap terbaca di monitor lebar). Semuanya
  fluidik dari `clamp()` di `app/globals.css`, bukan breakpoint: `.hero-gutter`
  (`clamp(1rem, 4.5vw, 4.5rem)`), `.hero-title`, `.hero-subtitle`, `.hero-lead`,
  `.hero-stat-value` (`clamp(1.25rem, 0.8vw + 0.9rem, 1.75rem)`), `.hero-stat-label`. Batas
  bawah clamp = ukuran HP, batas atas = ukuran monitor — jangan kembalikan ke daftar
  `text-[..] sm:.. lg:..` karena itu yang bikin ukurannya "kurang besar" di layar tertentu.
  CTA tetap `text-base px-7 py-3.5`, logo lockup 64px dengan nama perusahaan
  `text-sm tracking-[0.2em] text-white/80`. Yang di atas sengaja paling terbaca; sel statistik
  justru diikat kecil (`hero-stat-value` mentok di 1.75rem) supaya pita bawah tidak bersaing
  dengan judul. Tiap sel statistik `flex flex-col items-center`.
  Spacer `lg:hidden h-14` di `app/(main)/layout.tsx` tidak menambah ruang terlihat — bar
  atas `fixed` dengan `bg-white/95` menutupinya — jadi `pt` hero tetap kecil; di atas 64px
  blok logo justru turun.
- Scrim harus sama gelapnya kiri dan kanan (`bg-gradient-to-b from-black/70 via-black/60
  to-black/70`) karena teks di tengah; bottom-fade `h-16 sm:h-20` selalu disamakan dengan
  `pb-16 sm:pb-20` supaya tidak menimpa statistik.
- Hero cuma punya satu tempat untuk klaim: baris status `Sejak 1999 · HACCP Certified ·
  500+ Clients` sudah dihapus beserta kunci `hero.statusBadge`/`statExperience`/`statYear`.
  Faktanya sekarang ada di empat statistik (`1999` · `50 ton` · `24 jam` · `HoReCa`,
  `grid-cols-2 md:grid-cols-4`, semua item dipakai — tidak ada lagi `slice(0, 3)`).
  `1999` dan `HoReCa` lewat `value` teks (labelnya `hero.statFounded`/`statSegment`), hanya
  `50` dan `24` yang punya `numericValue` dan dianimasikan.
  Angka yang sama tidak boleh muncul dua kali dalam satu layar.
- **Aturan klaim:** tiap angka, nama klien, atau sertifikat di situs publik harus ada buktinya
  di situs resmi perusahaan (`etira.co.id` / `etiramushrooms.com`). Yang terbukti: 1999,
  "lebih dari 25 tahun", alamat Nongkojajar KM 1.4, dan kata *halal*. Yang sudah dibuang karena
  tidak terbukti: angka `500+`, enam nama klien karangan, dan chip HACCP / ISO 22000.
  TrustBanner sekarang menampilkan enam **segmen** pelanggan (`trustBanner.segments.*`) dengan label
  "Komitmen Mutu"; kartu produk memakai `productDetail.certSterile`, bukan HACCP.
  Fallback email dan nomor WhatsApp keduanya data resmi (`marketing@etiramushrooms.com` dan
  `628113503650`), jadi localhost maupun deployment tanpa env tetap menunjuk kontak perusahaan.
  Nomor itu bisa ditimpa lewat `NEXT_PUBLIC_ADMIN_PHONE` kalau PT memasang nomor baru.
  Masih menunggu konfirmasi PT: `50 ton/bulan` dan `24 jam`.
- Container: **selalu lewat `<Container>`** (`components/Container.tsx`) =
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Semua halaman publik pakai lebar penuhnya
  (tanpa `max-w-*` per halaman) supaya tidak ada gutter kosong di kiri-kanan; 7xl baru
  aktif di layar >1600px. `className` di-merge pakai `cn()` kalau suatu saat memang perlu
  override. Halaman beranda & detail produk jadi pengecualian: `px-6 sm:px-8 lg:px-16`,
  sedangkan bagian atas homepage memakai `.hero-gutter` (`clamp(1rem, 4.5vw, 4.5rem)`) —
  keduanya untuk ruang ekstra.
  Skeleton (`loading.tsx`) wajib memakai Container dengan kelas yang sama, kalau tidak
  posisi konten melompat saat data masuk.
- Komponen: badge `px-2 py-1`, tombol kecil `px-3 py-1.5`, tombol standar `px-4 py-2`,
  CTA `px-6 py-3`, input `px-3 py-2`.
- Hindari nilai di luar skala ini (`p-5`, `gap-7`, `mt-9`). Nilai pecahan kecil
  (`py-0.5`, `h-3.5` untuk ikon) boleh untuk penyesuaian ikon/density.
- Target sentuh: kontrol navigasi punya area sentuh ≥ 44px, **tanpa** membesarkan kotak
  visualnya. Dua cara yang dipakai:
  - Baris/nav link yang memang teks: `min-h-[44px]` (`NavLinkActive`, pil & rail
    `AdminSidebar`, pil filter status di `/pesanan`).
  - Kontrol kecil (ikon-saja, chip bahasa, tombol hamburger/tutup): tinggi visual tetap
    32–36px, area sentuh dilebarkan lewat `relative` +
    `after:absolute after:-inset-*:after:content-['']`. Karena itu jangan pasang
    `overflow-hidden` pada pembungkusnya — pseudo-elementnya akan terpotong.
  Jangan balik ke `w-11 h-11` untuk tombol kecil; hasilnya terlihat gondok.

### Rail navigasi (publik & admin)

Sistemnya sama untuk dua sidebar: lebar penuh saat terbuka, rail ikon 72px saat di-ciutkan.

| | Publik | Admin |
|---|---|---|
| Shell | `components/AppSidebarClient.tsx` | `app/admin/AdminLayoutClient.tsx` |
| Mode ciut | kelas `nav-collapsed` di `<html>` + `--nav-w` | state `isCollapsed`, kelas inline |
| Simpan preferensi | ya (`localStorage["etira-nav-collapsed"]`) | tidak (selalu terbuka saat reload) |
| Lebar | `--nav-w`: `16rem` → `72px` | `260px` ↔ `72px` |

Kelas yang dipakai (`app/globals.css`, dibungkus `@media (min-width: 1024px)` supaya drawer
mobile tidak ikut ciut):

| Kelas | Efek saat ciut |
|---|---|
| `nav-label` | disembunyikan (teks label nav, nama akun, kata "Masuk"/"Daftar") |
| `nav-hide-collapsed` | blok dibuang: label grup, kartu akun, pemilih bahasa |
| `nav-center-row` | baris judul grup "Menu" (label + tema/bahasa) dipusatkan |
| `nav-link` | `justify-center`, padding-x 0, `gap-0` supaya badge keranjang menempel ke ikon |
| `nav-wordmark` / `nav-wordmark-row` / `nav-collapse-toggle` | baris logo jadi kolom: logo di atas, tombol ciut di bawah |
| `nav-auth` / `nav-auth-btn` | blok masuk/daftar jadi kolom dan tombolnya ikon-saja |

Konten halaman digeser dengan `lg:ml-[var(--nav-w)]` + `transition-[margin]` di
`app/(main)/layout.tsx`, jadi offset ikut saat rail berubah. Tombol ciut wajib
`aria-label` (`nav.collapseMenu` / `nav.expandMenu`) dan `aria-expanded`.

Preferensi tampilan **selalu di atas**, di kedua shell — dulu tema di dasar rail sementara
bahasa di bar atas mobile, dan di desktop dua-duanya mengendap di dasar. Sekarang:
`components/AppSidebarClient.tsx` menaruh `ThemeToggle` + pil ID/EN di bar `h-14` mobile,
`components/AppSidebarContent.tsx` menaruh keduanya di **kanan baris judul grup "Menu"**
(`hidden lg:flex` pada klusternya, jadi drawer mobile tidak duplikasi). Bawah rail tinggal
**kartu akun → aksi akun (Logout / Masuk·Daftar)**. ThemeToggle 36px visual dengan
`after:-inset-1` sehingga area sentuh 44px; rail ciut menyembunyikan label grup + pemilih
bahasa (`nav-hide-collapsed`) dan memusatkan ikon tema (`nav-center-row`) — ikon tema
**jangan** ikut dibungkus `nav-hide-collapsed`, karena itulah satu-satunya kontrol yang
tersisa saat rail 72px.
- Panel admin menaruh `ThemeToggle` di baris logo (`app/admin/AdminSidebar.tsx`), sejajar
  kata "ETIRA", dan tetap terlihat saat rail admin di-ciutkan.

---

## 5. Primitif UI (`components/ui/`)

Impor dari `@/components/ui`. Semua primitif menerima `className` tambahan.

### Button
`<Button variant size>` — variant: `primary | secondary | danger | ghost | icon`,
size: `sm | md | lg`.
- `primary` = `brand-forest-600` → hover 700 → active 800, dark `brand-forest-500`.
  Ini satu-satunya tombol ajakan; varian `cta` (amber) sudah dihapus, aksi "pesan sekarang"
  dan "lanjut WhatsApp" sama-sama pakai `primary`.
- `secondary` = latar surface + `neutral-300` border; `danger` = `semantic-danger`.
- Semua variant sudah membawa: `inline-flex items-center justify-center gap-2`,
  `active:scale-95`, `focus:ring-2 focus:ring-offset-2`, `disabled:opacity-50`.
- Jangan menimpa warna tombol dengan `className` kecuali benar-benar perlu.

### Badge / StatusBadge
`<Badge variant>` — `default | outline | info | success | warning | danger`;
dasarnya `inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm`.
Varian `default` = `brand-forest-600` (dark 500) dengan teks putih; varian `outline`
tidak berwarna dan dipakai untuk status netral seperti `DIKIRIM`. Varian semantic
memakai pasangan `bg-semantic-*-light` + `text-semantic-*-dark` (gelap di atas terang)
dan `dark:bg-semantic-*-darkBg` + `dark:text-semantic-*-200`.
`<StatusBadge status label?>` memetakan status pesanan ke varian + ikon Lucide:

| Status | Varian | Ikon |
|---|---|---|
| `PENDING` | `warning` | `Clock` |
| `DIPROSES` | `info` | `Loader` (`animate-spin`) |
| `DIKIRIM` | `outline` | `Truck` |
| `SELESAI` | `success` | `CheckCircle` |
| `DIBATALKAN` | `danger` | `XCircle` |

Label datang dari `statusLabel()`. Untuk kesegaran/stok ada `FreshnessBadge`; badge
harga/label pendek di kartu memakai latar `bg-white/90` agar terbaca di atas gambar.
Badge angka di rail navigasi admin (`AdminSidebar`) memakai `bg-semantic-warning-700`
dan `bg-semantic-info-700` dengan teks putih — varian `DEFAULT` + putih hanya 2.2:1 dan
3.7:1, sedangkan `-700` naik ke 5.0:1 dan 6.7:1.

### Input / Card / Table / Modal / Toggle
- `Input`: `rounded-md border-neutral-300 bg-white` + `focus:ring-2 ring-brand-forest-500`,
  dark memakai `neutral-800` (sengaja — kontrol harus lebih terang dari kartunya).
  Label: `text-xs uppercase tracking-wider` + `Figtree medium`.
- `Card`: `rounded-lg border-neutral-200 bg-surface p-6`, prop `hover` menambah border/latar
  saat disentuh. Kartu konten umum: `bg-surface border-border`.
- `Table`: header `bg-bg-subtle text-charcoal-muted uppercase text-xs`, baris
  `border-b border-border`, hover `bg-bg`, padding `px-4 py-3`.
- `Modal`: overlay `bg-black/50 backdrop-blur-sm` (salah satu dari sedikit blur yang
  diizinkan), panel `bg-surface rounded-lg border border-neutral-200 shadow-sm`.
- Placeholder: `text-charcoal-muted` / `placeholder:text-neutral-400`.

### Empty state & loading
- `EmptyState` untuk list kosong (ikon Lucide + 1 kalimat + tombol aksi).
- Skeleton: `ProductSkeleton.tsx` + `.shimmer-line`; jangan `animate-spin` penuh halaman.
- Setiap perubahan status async memakai `useTransition`/`startTransition` — bagian logika,
  jangan diutak-atik (§12).

---

## 6. Gambar: `ProductVisual` & foto dokumentasi

`components/ProductVisual.tsx` menangani realita bahwa sebagian besar produk **belum punya
foto asli**.

- Kalau `imageUrl` benar-benar foto → `<Image fill sizes … className="object-contain p-[8%]" />`.
- Kalau `imageUrl` kosong **atau** menunjuk ke salah satu `PLACEHOLDER_ASSETS`
  (`/hero-branding.jpg`, `/og-image.png`, `/etira.webp`) → panel placeholder:
  `bg-bg-subtle border border-border-subtle` + ikon Lucide besar (`w-1/3 max-w-24`,
  `strokeWidth 1.25`, `text-charcoal-muted`), `aria-hidden`.
- Ikon dipilih dari nama/kategori: `beku|frozen|iqf` → `Snowflake`, `kaleng|canned` →
  `Package`, `pouch|retort|sachet` → `Boxes`, `nugget|bakso|olahan` → `ChefHat`,
  `segar|fresh` → `Leaf`, sisanya `Sprout`.
- Wadah foto kartu produk **kotak** (`aspect-square`) dengan latar `bg-neutral-200`
  (dark: `bg-neutral-900`), sama seperti halaman detail dan skeletonnya
  (`ProductSkeleton`), supaya tidak ada layout shift saat kartu muncul. Latar bingkai ini
  bukan hiasan: foto resmi berbentuk potongan punya latar transparan, jadi warna bingkai
  yang mengisi ruang di sekitar kemasan — kalau disamakan dengan `bg` halaman, kartu
  hilang ke latar. Tepi kartu `border-neutral-300` (dark: `neutral-700`).
  Foto potongan potret (rasio 0,69–0,92) ditampilkan `object-contain` dengan jarak
  `p-[8%]` sehingga kemasan utuh dan tidak menempel tepi; `object-cover` di wadah
  memotong 31–48% tinggi foto. Thumbnail keranjang ikut `object-contain p-1`.
  Zoom hover: `group-hover:scale-105` dengan `motion-safe:transition-transform`.
- Jangan memakai satu foto yang sama untuk semua produk sebagai "filler"; placeholder ikon
  lebih jujur dan langsung tergantikan saat admin mengunggah foto.

Foto dokumentasi perusahaan (`public/tentang/`) diperlakukan berbeda dari foto produk:
ini foto asli, rasio bebas, jadi wajar dipotong.

- Wadah `aspect-[16/10]`/`aspect-[4/3]` + `object-cover`; `object-contain` dilarang di sini
  karena akan meninggalkan bar latar.
- `budidaya.webp` dipakai di blok "Profil Perusahaan" dan `sortir.webp` +
  `kontrol-mutu.webp` jadi strip dua foto di bagian Fasilitas.
- Caption foto memakai pola overlay yang sama: `bg-neutral-900/80 backdrop-blur-xs` +
  `text-white` + `border-white/10`, `text-[11px]`, di `figcaption`.
- Teks caption dan alt teks datang dari `messages/*.json` (`tentang.photo*`), tidak ada
  string pabrikan di komponen. Caption hanya menyebut yang terlihat di foto — jangan
  menyelipkan klaim sertifikasi.

---

## 7. Motion

- **Semua** animasi transitions ditulis dengan prefix `motion-safe:` (lihat `Button`,
  `Badge`, `Card`, `ProductCard`). Ini syarat, bukan saran.
- Durasi hanya `150ms` (klik, fokus), `200ms` (hover kartu/badge), `300ms` (modal,
  perubahan besar). Easing: `ease-out` (`cubic-bezier(0,0,.2,1)`).
- `globals.css` cuma mendefinisikan empat `@keyframes`: `buttonPress`, `shimmer`,
  `skeleton-loading`, `slideInUp`. Blok `prefers-reduced-motion` di ujung file mematikan
  semuanya lewat durasi (`animation-duration`/`transition-duration` `0.01ms`,
  `animation-iteration-count: 1`) lalu mematikan total `.shimmer-line` dan `.skeleton`
  dengan `animation: none` — kerangka muat tidak boleh berkedip terus.
- Kosakata kelas yang **hidup** dan boleh dipakai: `.hero-stagger` +
  `.hero-stagger-visible`, `.reveal-hidden` / `.reveal-hidden-left|right` +
  `.reveal-visible` (lewat `components/ScrollReveal.tsx`), `.shimmer-line`
  (`components/ProductSkeleton.tsx`), `.skeleton`, `.no-scrollbar`,
  `.section-divider-wave`, `.feature-card-num`, `.input` / `.input-with-icon`
  (form admin).
- Animasi looping hanya untuk hal yang benar-benar menyatakan "hidup": indikator loading
  (`animate-spin` pada `Loader`). Scroll cue `animate-bounce` di hero sudah dihapus — pita
  statistik sekarang menempati dasar hero, jadi tidak ada tempat kosong untuk cue itu.
  Maksimal dua elemen beranimasi loop per halaman.
- Munculnya elemen: geser + fade pendek (150–300ms) atau stagger, bukan bounce/pop besar.

---

## 8. Zona pengecualian efek

Larangan lama ("tanpa gradien, tanpa blur") **tidak** dipakai sebagai aturan buta. Sistem
yang shipped membatasi efek sinematik ke beberapa permukaan saja, dan itu disengaja:

| Lokasi | Efek yang diizinkan |
|---|---|
| `components/HeroCinematic.tsx` | scrim **vertical** `bg-gradient-to-b from-black/70 via-black/60 to-black/70` di atas foto (kolom teks rata tengah, jadi kiri dan kanan harus sama gelapnya — scrim horizontal bikin separuh teks jatuh kontras), bottom-fade `h-16 sm:h-20` ke `bg` (selalu disamakan dengan `pb-16 sm:pb-20` konten supaya tidak menimpa statistik), parallax. Teks di atas foto **minimal `text-white/75`** (`/80` untuk body) — di bawah itu kontrasnya jatuh di bawah 4.5:1 |
| Overlay di atas gambar produk (`ProductCard`) | scrim `bg-neutral-900/60` + `backdrop-blur-xs`, chip `bg-white/90` |
| `components/ui/Modal.tsx` | overlay `bg-black/50 backdrop-blur-sm` |
| `components/AppSidebarClient.tsx` (header + drawer mobile) | bar `bg-white/95 backdrop-blur`, scrim `bg-black/60 backdrop-blur-xs` |
| `components/FloatingWhatsApp.tsx` | gradien hijau WhatsApp (`#25D366` → `#20bd5a`) — warna merek pihak ketiga, sengaja di luar palet |

Di luar daftar ini: **tidak ada** gradien, blur, glassmorphism, atau animasi besar.
Khususnya: konten teks di atas latar polos tidak boleh pakai gradien-clip
(`.gradient-text` sudah mati — jangan dihidupkan lagi).

---

## 9. Bahasa & i18n

- **Situs publik: dua bahasa, Indonesia dan Inggris.** Semua string lewat
  `messages/id.json` / `messages/en.json`, diakses dengan `useTranslations()`
  (klien) atau `getServerMessages()` (server action, route handler, metadata).
  Locale disimpan di localStorage dan dicerminkan ke cookie `locale` lewat
  `components/LocaleProvider.tsx`.
  **Default pengunjung baru: Inggris** — `'en'` di `useState`/fallback localStorage
  `components/LocaleProvider.tsx` dan fallback cookie `lib/serverMessages.ts`, supaya
  render pertama (server) dan paint pertama (klien) tidak berbeda bahasa. Pilihan manual
  selalu menang karena tersimpan. Jangan balik ke `'id'` sebagian: kalau klien dan server
  beda default, halaman kedip ganti bahasa.
  Kunci kedua file harus **selalu sama jumlahnya** (saat ini 604/604).
- **Panel admin: hanya bahasa Indonesia.** Ini keputusan lingkup, bukan kelalaian —
  jangan diterjemahkan.
- Semua label, tombol, placeholder, dan pesan error publik mengikuti locale aktif;
  jangan menulis string Indonesia/Inggris mentah di JSX kalau kuncinya sudah ada.
- Ikon: **Lucide React**. Emoji tidak dipakai sebagai ikon dekoratif.

---

## 10. Dark mode

- Mekanisme: `darkMode: "class"` + `.dark` di `globals.css`; toggle di
  `components/ThemeToggle.tsx`; `ThemeProvider` di `components/Providers.tsx` memakai
  `defaultTheme="system"` — pengunjung baru ikut perangkat HP/laptop-nya, dan begitu
  menekan toggle nilainya jadi eksplisit (`light`/`dark`) dan tersimpan.
- Toggle **wajib baca `resolvedTheme`**, bukan `theme`. Dalam mode system `theme` masih
  bernilai `"system"`, jadi tombol yang membacanya akan menampilkan ikon salah dan klik
  pertama kelihatan tidak terjadi apa-apa.
- Posisinya **di atas di ketiga shell**: bar `h-14` mobile situs publik, baris judul grup
  "Menu" di rail publik (`components/AppSidebarContent.tsx`), dan baris logo rail admin
  (`app/admin/AdminSidebar.tsx`). Label teks "Mode Tampilan" di rail admin sudah dihapus —
  ikonnya sudah menjelaskan diri, dan rail ciut 72px tidak muat dua kolom.
- Rail publik: kontrol **tidak** ikut naik ke baris logo. Ruang dalam rail 256px − 32px =
  224px, sementara logo + tulisan (112px) + tombol ciut + tema + pil bahasa (151px) = 263px —
  tidak muat satu baris. Baris wordmark tetap logo + tombol ciut (`lg:pb-2 lg:border-b-0`;
  garis pemisahnya hanya muncul di drawer mobile), tema + bahasa baru muncul di baris "Menu".
- Saat rail di-ciutkan, label grup dan pemilih bahasa hilang tapi **ikon tema tetap ada** dan
  dipusatkan (`nav-center-row`). Jadi satu-satunya jalan ganti tampilan di rail 72px tidak
  pernah ikut tersembunyi.
- Pemilih bahasa satu komponen untuk kedua shell (`components/LanguageSwitcher.tsx`):
  pil ID/EN ±67px, `aria-label` dari `nav.language`. Versi lama pakai bendera emoji
  (`🇮🇩 ID / 🇬🇧 EN`, ±120px) — emoji sebagai ikon dilarang §9 dan lebarnya yang bikin rail
  tidak muat.
- Kalau kamu menulis dengan token §1 butir 2, dark mode sudah beres sendiri — tidak perlu
  varian `dark:` sama sekali. Ini jalur utama untuk permukaan dan teks.
- **Hex mentah di class dilarang**, termasuk `dark:bg-[#141715]`. Nilainya sekarang sudah
  menjadi token (`bg-surface`), jadi menulis hex berarti membuat sumber kebenaran kedua.
- Kalau memakai skala literal (`brand-*`, `neutral-*`), wajib tambahkan varian `dark:`
  untuk latar, teks, dan border — pola standar: `bg-white dark:bg-neutral-800`,
  `text-neutral-900 dark:text-neutral-100`, `border-neutral-300 dark:border-neutral-600`.
- Jangan memakai `bg-black`/`text-white` polos untuk permukaan; pakai `bg-bg`/`text-charcoal`.
  Teks putih di atas hijau **gelap** (`brand-forest-600/700`, mis. `Button variant="primary"`)
  tetap wajar dan boleh. Yang tidak: `bg-primary` di mode gelap bernilai `#6B9B6B` — cukup
  terang untuk latar, terlalu terang untuk teks putih (3.2:1). Kelas `.btn-primary` dan
  tombol/chip `bg-primary` di beranda karena itu menutup dengan `dark:text-neutral-900`
  (4.8:1). Pola yang benar: `bg-primary text-white dark:text-neutral-900`.
- Dark bukan tema sekunder: cek setiap perubahan UI di kedua mode.

---

## 11. Utang teknis yang diketahui (jangan ditiru, perbaiki kalau menyentuhnya)

Ini **bukan** bagian dari sistem — ini penyimpangan yang masih tersisa:

1. Sudah dibersihkan (2026-09-27; migrasi duotone menyusul 2026-09-28), jangan kembalikan:
   - `stone-*` → `neutral-*`;
   - hex mentah di class (`dark:bg-[#141715]`, `bg-[#faf9f6]`, `#0f1110`, `#1a1a16`,
     `#222220`) → token `bg-surface` / `bg-bg` / `bg-bg-subtle`;
   - warna bawaan Tailwind (`red-*`, `emerald-*`, `green-*`, `blue-*`) → tangga
     `semantic-danger|success|info-*`. Teks dark mode di `Badge` sekarang
     `semantic-*-200`, bukan `blue-200`/`green-200` lagi;
   - wadah (`Card`, `Modal` panel, kartu admin, `TrustBanner`, popover WhatsApp) dipaksa
     ke `bg-surface`. Yang sengaja **tidak** disatukan: kontrol (`Input`, `Button`
     secondary, `PaginationControls`, baris pilihan pembayaran, kartu aktif) tetap
     `bg-white dark:bg-neutral-800` supaya masih bedaan dari kartunya;
   - palet multi-warna: skala `brand-earth` / `brand-amber` / `brand-fresh`, token `cta`
     (`--cta`, `--cta-hover`) dan `fresh` / `earth`, varian `Button cta`, varian `Badge
     earth`, serta blok alias lama di `tailwind.config.ts` (`sage`, `clay`, `forest`,
     `dark-sage`, `dark-cta`, `dark-text`, `dark-muted`, `dark-surface`, `dark-bg`,
     `dark-border`). Pemakaiannya dipindah ke `primary` / `brand-forest-*` (hijau),
     `danger` (merch status pembatalan), dan `semantic-warning` (stok menipis). Sisa
     pemakaian `bg-primary` + teks harus mengikuti pola §10 supaya kontras tidak turun.
2. Nilai `semantic-*` yang baru ditambahkan ke tema adalah salinan persis dari warna yang
   sudah tampil (mis. `semantic-danger-500` = `#ef4444`), jadi perpindahan nama tidak
   mengubah piksel — kecuali `green-200` → `semantic-success-200` (`#a7f3d0`) yang
   sedikit lebih ke-arah emerald.
3. Semua kelas mati di `app/globals.css` sudah dibuang — 75 aturan, 881 jadi 443 baris.
   Yang tersisa di `@layer components` cuma yang benar-benar dipakai kode:
   `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-icon`, `.input`,
   `.input-with-icon`, `.card`, `.badge`, `.divider` (dipakai form & tombol admin,
   `components/ui/Card`, dan beranda). Jangan menambah kelas baru di layer ini —
   komponen baru menulis class Tailwind langsung atau lewat varian `components/ui`.
   Utilitas yang masih hidup dan dipakai: `.reveal-hidden*`, `.reveal-visible`,
   `.hero-stagger*`, `.hero-gutter`, `.hero-title`, `.hero-subtitle`, `.hero-lead`,
   `.hero-stat-value`, `.hero-stat-label`, `.shimmer-line`, `.section-divider-wave`,
   `.feature-card-num`, `.skeleton`, `.will-change-transform`, `.no-scrollbar`,
   `.animate-slideInUp`.
4. Teks muted di seluruh aplikasi (panel admin 91 tempat + situs publik 186 tempat,
   2026-09-28) sudah dinormalisasi dari `text-neutral-400/500/600` ke
   `text-charcoal-muted`. Yang sengaja **dibiarkan** pucat: `placeholder:`, `disabled:`,
   dan dua angka watermark dekoratif di beranda (`font-mono` di blok langkah & kartu
   fitur) yang memang harus jadi latar belakang.
5. Ikon `w-3.5 h-3.5` sering muncul di dalam badge/tombol kecil — ini acceptable, tetapi
   kalau membuat komponen baru pilih `size` dari skala (`w-4`, `w-5`, `w-6`).

---

## 12. Aturan kerja (tetap dari versi lama, masih berlaku)

- **Jangan mengubah logika apa pun** saat mengerjakan tampilan: `use server`,
  `useTransition`, `startTransition`, server actions, pemanggilan Prisma, `revalidateTag` /
  `revalidatePath`, routing, dan struktur `messages/*.json` tidak disentuh.
- Boleh diubah: class Tailwind, struktur JSX/HTML, impor font/ikon, dan token di tema.
- Mobile-first dan responsif: setiap komponen diuji di ~360px, tablet, dan desktop.
- Sebelum menyelesaikan perubahan tampilan, jalankan `npx tsc --noEmit`,
  `npx next lint`, dan `npm run build`.
- Aksesibilitas tetap syarat: kontras teks ≥ 4.5:1 di kedua mode, `focus:ring` jangan
  dihapus, elemen dekoratif (`aria-hidden`) tidak boleh dibaca screen reader, gambar
  butuh `alt` bermakna dalam bahasa aktif.
