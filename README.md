# Katalog Pemesanan Produk

Starter project untuk tugas magang: sistem katalog produk & pemesanan berbasis web.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth

## Fitur yang sudah jalan

- Register & login (role `ADMIN` dan `BUYER`)
- Katalog produk dengan filter kategori & search
- Detail produk + tambah ke keranjang
- Keranjang (ubah qty, hapus item) + checkout jadi pesanan
- Riwayat & detail pesanan buyer, termasuk batalkan pesanan (status `PENDING`)
- Dashboard admin (statistik ringkas, produk terlaris, pesanan terbaru)
- CRUD produk & kategori (admin)
- Kelola pesanan & ubah status (admin)
- Proteksi halaman sesuai role (middleware)

## Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan database PostgreSQL

Paling gampang pakai database gratis dari [Neon](https://neon.tech) atau [Supabase](https://supabase.com) — tinggal daftar, buat project, copy connection string-nya.

Kalau mau lokal, install PostgreSQL lalu buat database baru:

```sql
CREATE DATABASE katalog_db;
```

### 3. Setup environment variables

Copy `.env.example` jadi `.env`, lalu isi:

```bash
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — connection string database kamu
- `NEXTAUTH_SECRET` — isi string acak (bisa generate dengan `openssl rand -base64 32`)
- `NEXTAUTH_URL` — biarkan `http://localhost:3000` untuk development

### 4. Migrasi database & isi data awal

```bash
npx prisma migrate dev --name init
npm run seed
```

Setelah seed berhasil, ada 2 akun contoh:
- **Admin:** admin@katalog.test / admin123
- **Buyer:** buyer@katalog.test / buyer123

Plus 3 kategori & 6 produk contoh (jamur kaleng, pouch, frozen — bisa diganti sesuai perusahaan magang kamu).

### 5. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder Penting

```
app/                  → halaman (App Router)
  admin/              → halaman khusus admin (dashboard, produk, kategori, pesanan)
  produk/[id]/        → detail produk
  keranjang/          → halaman keranjang & checkout
  pesanan/            → riwayat pesanan buyer
  login, register/    → autentikasi
lib/
  actions/            → server actions (logika create/update/delete)
  prisma.ts           → koneksi database
  auth.ts             → konfigurasi NextAuth
  session.ts          → helper cek user login & role
prisma/
  schema.prisma       → skema database
  seed.ts             → data awal
```

## Ide Pengembangan Lanjutan (buat laporan magang)

- Export laporan pesanan ke Excel/PDF
- Notifikasi email saat status pesanan berubah
- Upload gambar produk langsung (saat ini masih pakai URL gambar)
- Halaman kelola user (admin bisa lihat semua buyer)
- Grafik penjualan pakai chart library (mis. Recharts)
- Multi-harga per klien (kontrak khusus B2B)

## Catatan

- Harga disimpan sebagai bilangan bulat (Rupiah, tanpa desimal) untuk menyederhanakan perhitungan.
- Stok otomatis berkurang saat checkout dan dicek ulang saat checkout untuk mencegah overselling.
- Middleware melindungi halaman `/keranjang`, `/pesanan`, dan `/admin` — otomatis redirect ke halaman login kalau belum masuk.
