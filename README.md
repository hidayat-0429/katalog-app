# Sistem Katalog & Pemesanan B2B
**Studi Kasus PKN:** PT Eka Timur Raya (Etira Mushrooms)

Sistem Informasi Manajemen Katalog dan Pemesanan Grosir (Business-to-Business) berbasis web. Sistem ini dirancang untuk memfasilitasi klien B2B (hotel, restoran, katering, dan industri) dalam memesan pasokan jamur segar dan olahan langsung dari pabrik.

## 🚀 Teknologi yang Digunakan (Tech Stack)
- **Framework:** Next.js 15.5 (App Router, Server Actions)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **Database ORM:** Prisma 5.22
- **Database:** PostgreSQL (Supabase, melalui connection pool pgbouncer)
- **Autentikasi:** NextAuth.js v4 (provider *credentials* + sesi JWT)
- **Pengujian:** Vitest
- **Ikon:** lucide-react
- **Validasi input:** zod

## ✨ Fitur Unggulan
- **Role-Based Access Control (RBAC):** Pemisahan hak akses dan dasbor khusus untuk Admin (pengelola) dan Buyer (klien).
- **Dua Bahasa (ID/EN):** Seluruh sisi publik berbahasa Indonesia atau Inggris. Locale disimpan di `localStorage` dan dicerminkan ke cookie, jadi *server action*, pesan error, dan metadata tab ikut mengikuti bahasa pengunjung. Dasbor admin memang sengaja hanya bahasa Indonesia.
- **Kalkulator Konversi Grosir:** Penghitungan otomatis dari satuan ecer (kaleng/pouch/pack) ke satuan grosir (Karton/Dus) secara *real-time* saat *checkout*.
- **Opsi Armada Logistik:** Pilihan metode pengiriman spesifik komoditas (Armada Berpendingin Cold Chain, Kargo Kering, atau Ambil di Pabrik).
- **Manajemen Pesanan Atomik:** *Checkout* berjalan dalam transaksi database dengan pengurangan stok bersyarat, sehingga dua klien yang memesan bersamaan tidak bisa membuat stok menjadi minus (*overselling*).
- **Alur Status Pesanan Tertutup:** Aturan perpindahan status (`PENDING → DIPROSES → DIKIRIM → SELESAI`, atau dibatalkan) disimpan di satu modul (`lib/orderStatus.ts`) yang dipakai bersama oleh *server action* dan tombol di dasbor admin. Stok hanya kembali saat pesanan dibatalkan sebelum diberangkatkan.
- **Faktur Siap Cetak (Printable Invoice):** Laman khusus pesanan yang terformat rapi untuk dicetak sebagai dokumen pengiriman.
- **Ekspor Laporan (CSV):** Admin dapat mengunduh rekapan data pesanan ke dalam format `.csv` dengan *encoding* BOM UTF-8 yang sepenuhnya kompatibel dengan Microsoft Excel.
- **Kotak Masuk Kontak:** Pesan dari formulir kontak tersimpan di database dan tampil di dasbor admin (`/admin/pesan`), dengan penanda jumlah pesan belum dibaca di sidebar admin.
- **Pengaman Formulir:** Pembatas laju untuk login, pendaftaran, dan kirim pesan kontak, plus *honeypot* pada formulir kontak.
- **Mode Gelap & Gerak Minimal:** Tema terang/gelap dengan `next-themes`; semua animasi bisa dimatikan lewat `prefers-reduced-motion`.
- **Kerangka Muat per Halaman:** Setiap rute yang memanggil database punya `loading.tsx` sendiri (14 rute) sehingga kerangkanya tampil duluan sambil data diambil. Halaman yang murni sisi klien — Tentang, Kontak, FAQ, login, daftar — sengaja tidak dipasangi karena tidak ada data yang ditunggu.
- **SEO:** Metadata dan *sitemap* mengikuti locale, dengan `robots.txt` dan *open graph* dasar.
- **Integrasi WhatsApp:** *Auto-generate* pesan rincian belanja klien yang dikirim langsung ke *hotline* WhatsApp perusahaan.

## 🛠️ Cara Menjalankan di Lingkungan Lokal (Development)

**1. Install dependensi**
```bash
npm install
```

**2. Setup Environment Variables**
Salin `.env.example` menjadi `.env`. File contoh tersebut menjelaskan setiap variabel; yang wajib diisi:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"     # lewat pooler (aplikasi)
DIRECT_URL="postgresql://user:password@host:5432/database"       # koneksi langsung (migrasi)
NEXTAUTH_SECRET="secret-key-acak-minimal-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"              # unggah gambar produk
SUPABASE_SERVICE_ROLE_KEY="..."
```
Variabel `NEXT_PUBLIC_ADMIN_PHONE` dan `NEXT_PUBLIC_COMPANY_EMAIL` dipakai widget WhatsApp dan halaman kontak.

**3. Generate klien Prisma dan buat struktur tabel**
```bash
npm run prisma:generate
npm run prisma:migrate
```

**4. Pengisian Data Awal (Seeding)**
Jalankan perintah berikut untuk mengisi database dengan kategori resmi, 12 produk Etira, dan dua akun uji:
```bash
npm run seed
```

**5. Jalankan Server Development**
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda. Cukup **satu** server development dalam satu waktu — dua instance yang berbagi folder `.next` akan merusak cache.

**6. Akun Demo untuk Uji Coba**
- **Admin:** `admin@etiramushrooms.com`
- **Buyer (Klien):** `buyer@katalog.test`

Password keduanya dibaca dari `ADMIN_SEED_PASSWORD` dan `BUYER_SEED_PASSWORD` di `.env`. Keduanya **wajib** terisi: kalau kosong, `npm run seed` langsung gagal alih-alih jatuh ke sandi bawaan yang bisa ditebak. Untuk akun yang sudah ada di database, seeder tidak mengubah sandi maupun datanya (`update: {}`), jadi menjalankan seed pada database yang sudah terisi aman.

## 🧪 Perintah Lainnya
```bash
npm test             # jalankan seluruh tes (Vitest, tanpa menyentuh database)
npm run test:watch   # tes ulang otomatis saat file berubah
npm run type-check   # pemeriksaan tipe TypeScript
npm run lint         # ESLint
npm run build        # build produksi
```
Tes difokuskan ke jalur yang paling mahal kalau rusak: cegah *oversell* di *checkout*, aturan status pesanan, pembatas laju, dan keseimbangan kunci terjemahan ID/EN. Tes memakai *mock* Prisma sehingga tidak pernah menulis ke database.

CI (GitHub Actions) menjalankan `type-check`, `lint`, `test`, dan `next build` pada setiap *push* ke `main` dan setiap pull request. Build tidak butuh koneksi database: `/sitemap.xml` dibangkitkan saat permintaan, bukan saat *build*, dan seluruh halaman memang dinamis.

## 📁 Struktur Direktori Utama
- `app/` → Konfigurasi App Router Next.js (halaman publik & privat); rute dengan data disertai `loading.tsx`
- `app/admin/` → Dasbor dan manajemen khusus Admin (produk, kategori, pesanan, ekspor, kotak masuk kontak)
- `app/keranjang/` → Modul pemesanan dan formulir *checkout*
- `components/` → Komponen antarmuka yang dapat digunakan kembali (*reusable UI*)
- `hooks/` → Hook sisi klien (terjemahan, provider locale)
- `lib/actions/` → Server Actions untuk logika mutasi data (Create/Update/Delete)
- `lib/orderStatus.ts` → Satu-satunya sumber aturan status pesanan
- `messages/` → Teks antarmuka `id.json` dan `en.json`
- `prisma/` → Skema basis data dan skrip pengisian data (*seeder*)
- `tests/` → Tes Vitest
- `.github/workflows/` → Definisi CI

## 🌐 Deploy ke Vercel

**1. Impor repositori.** Di Vercel: *Add New → Project* → pilih repositori GitHub ini. *Framework Preset* biarkan **Next.js**, *Build Command* `npm run build`, *Output Directory* `.next`.

**2. Klien Prisma.** `package.json` punya skrip `"postinstall": "prisma generate"`, jadi klien database terbentuk otomatis saat Vercel menjalankan `npm install`. Tanpa baris ini build gagal dengan pesan *"Cannot find module '@prisma/client'"* atau *"query engine not found"*.

**3. Environment Variables** (isi di *Project → Settings → Environment Variables*, untuk *Production* — dan *Preview* bila perlu):

| Variabel | Nilai |
| --- | --- |
| `DATABASE_URL` | URL **pooler** Supabase (`...supabase.co:6543/...`), tambahkan `?pgbouncer=true&connection_limit=1` bila belum ada |
| `DIRECT_URL` | URL **langsung** Supabase (`...supabase.co:5432/...`), tanpa pooler |
| `NEXTAUTH_SECRET` | String acak baru, minimal 32 karakter — jangan pakai nilai dari lokal |
| `NEXTAUTH_URL` | `https://domain-final-anda` |
| `NEXT_PUBLIC_BASE_URL` | Sama persis dengan `NEXTAUTH_URL` (dipakai metadata, *open graph*, dan *sitemap*) |
| `NEXT_PUBLIC_SUPABASE_URL` | Proyek Supabase tempat gambar produk disimpan |
| `SUPABASE_SERVICE_ROLE_KEY` | Hanya di server; **jangan** dipindah ke variabel `NEXT_PUBLIC_*` |
| `NEXT_PUBLIC_ADMIN_PHONE` | Nomor WhatsApp, format internasional tanpa `+` |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Email yang tampil di kontak dan *footer* |
| `ADMIN_SEED_PASSWORD`, `BUYER_SEED_PASSWORD` | Wajib terisi bila menjalankan `npm run seed`; tidak ada nilai bawaan |

`DATABASE_URL` dan `DIRECT_URL` tetap dibutuhkan walau `npm run build` tidak lagi menyentuh database (halaman `/sitemap.xml` sudah dibangkitkan saat permintaan, bukan saat *build*).

**4. Region fungsi.** Di *Project → Settings → Function Region*, pilih region yang paling dekat dengan lokasi database Supabase-mu (untuk server di Singapura, biasanya Hong Kong atau Mumbai yang paling dekat; bawaan Vercel adalah `iad1` di Amerika Serikat). Setiap halaman memanggil database beberapa kali, jadi selisihnya terasa: 20 ms per panggilan vs 200 ms.

**5. Terapkan skema ke database produksi** dari mesin lokal:
```bash
npx prisma migrate deploy
```
Jangan `migrate dev` di database yang sudah berisi data pesanan.

**6. Kunci sandi akun demo.** `buyer@katalog.test` masih memakai sandi seed yang tertulis di dokumentasi ini, dan halaman login bisa diakses siapa pun. Ganti sandinya lewat **Admin → Pengguna → ikon kunci** sebelum situs diakses orang lain; untuk `admin@etiramushrooms.com` gunakan **Profil → Kata Sandi**. Seeder tidak akan memulihkan sandi lama karena akun yang sudah ada tidak pernah ditimpa.

**7. Deploy dan uji.** Setelah *deploy*, cek: masuk sebagai buyer, tambah ke keranjang, *checkout* tanpa mengirim pesanan, unggah gambar produk dari dasbor admin (butuh `SUPABASE_SERVICE_ROLE_KEY`), dan cetak faktur.

### Yang berubah perilakunya di serverless
- **Pembatas laju bersifat per-instance.** Hitungan login/daftar/kontak disimpan di memori proses, jadi di Vercel tiap instance hotungannya sendiri. Lapisan ini tetap menahan bot naif, tapi bukan pengganti pembatas laju di sisi database atau *edge*.
- **Cache `unstable_cache` juga per-instance.** Halaman pertama setelah instance dingin dibuat ulang; itu normal dan tidak mengubah data.
- **Waktu tunggu database.** Kalau Supabase-mu sedang *paused* (plan gratis), permintaan pertama bisa kena *cold start* beberapa detik.

---
*Proyek ini dikembangkan sebagai pemenuhan tugas Praktik Kerja Nyata (PKN) Program Studi Teknik Informatika.*
