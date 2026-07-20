# BAKUL PELAK

**BAKUL PELAK** (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif) merupakan platform digital yang menyediakan dashboard statistik, portal pelayanan publik, dan pemetaan interaktif untuk mendukung pengelolaan data UMKM di berbagai wilayah. Sistem ini dirancang untuk mempermudah pemerintah daerah, pelaku UMKM, dan masyarakat dalam mengakses informasi, mengelola data, serta mendukung pengambilan keputusan berbasis data secara terintegrasi dan kolaboratif.

---

## 🌟 Fitur Utama

1.  **Beranda Utama (`/`)**
    *   Profil administrasi singkat dan prestasi Kelurahan Kahuripan.
    *   SVG Peta Batas Administrasi kelurahan stensil dengan legenda pin sentra usaha.
    *   Analisis singkat legalitas (NIB) dan status kompetensi (Pelatihan) dalam diagram mini.
    *   *Live Search* global terintegrasi di Navbar untuk mencari dan menyorot UMKM secara langsung di beranda.

2.  **Dashboard Statistik (`/statistik`)**
    *   Kartu KPI Ringkasan: Total UMKM, kategori usaha terpopuler, jumlah kepemilikan NIB, dan jumlah peserta pelatihan.
    *   Visualisasi grafik interaktif menggunakan **Recharts**:
        *   *Bar Chart Horizontal*: Distribusi jumlah usaha per kategori industri.
        *   *Pie Chart*: Rasio kepemilikan berkas NIB.
        *   *Doughnut Chart*: Persentase keikutsertaan program pelatihan kelurahan.

3.  **Pemetaan Spasial Interaktif (`/peta`)**
    *   Integrasi peta geografis **Leaflet.js** (dikompilasi aman dari SSR Next.js).
    *   Pin lokasi spesifik dengan ikon khusus kategori usaha (Merah = Kuliner, Kuning = Sektor Lainnya) lengkap dengan balon info detail usaha saat pin diketuk.
    *   Tabel direktori terpaginasi (20 baris per halaman) yang terhubung langsung dengan peta. Mengetuk baris tabel akan mengarahkan fokus, melakukan zoom, dan menandai pin di peta secara otomatis.

4.  **Portal Layanan Publik (`/publik`)**
    *   Akses cepat link resmi eksternal pendaftaran NIB (OSS RBA) dan Sertifikasi Halal Gratis (SIHALAL).
    *   Pencarian Kode Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) terpopuler (seperti Kuliner, Bordir Tasik, Kelom Geulis, Pakaian).
    *   Formulir pengaduan perizinan, permodalan, dan kendala operasional bagi pelaku usaha.
    *   **Asisten Virtual BAKUL**: Chatbot simulasi interaktif yang responsif dengan tombol pintasan pertanyaan populer (Syarat NIB, Langkah NIB, Syarat Sertifikat Halal, Panduan KBLI, Program Bantuan Kelurahan).

5.  **Monitoring Kesejahteraan &amp; Desil (`/monitoring`)**
    *   Filter visual terpadu berdasarkan Kecamatan dan Tahun Laporan.
    *   Kartu rekapitulasi prioritas kesejahteraan: Desil 1–4 (Rendah/Prioritas Bantuan), Desil 1–5 (Menengah Bawah), Desil 6–10 (Mandiri), serta jumlah data yang memerlukan validasi lapangan.
    *   *Bar Chart* sebaran desil 1–10 dengan warna indikator dinamis (Merah = Prioritas, Oranye = Menengah, Hijau = Mandiri).
    *   Tabel verifikasi lapangan dengan tombol aksi *real-time* untuk mengubah status validasi ("Cek Lapangan" / "Perlu Cek").

6.  **Kelola Data - Admin CRUD Panel (`/admin`)**
    *   Panel administrasi internal kelurahan untuk manajemen direktori UMKM secara penuh.
    *   Melakukan operasi **Create** (tambah UMKM baru), **Read** (tabel direktori), **Update** (edit data detail melalui modal form), dan **Delete** (hapus data permanen).

---

## 🛠️ Teknologi &amp; Pustaka

Aplikasi ini dibangun menggunakan arsitektur modern Next.js yang kompatibel langsung untuk deployment Vercel + PostgreSQL:

*   **Framework**: Next.js 16.2.10 (App Router, TypeScript)
*   **React Runtime**: React 19.2.4
*   **Styling**: Tailwind CSS v4 (Tema kustom `warm-brown` terstruktur di [globals.css](file:///c:/Users/Ikhwan%20Kurniawan/Documents/GitHub/dashboard-umkm/app/globals.css))
*   **Visualisasi Grafik**: Recharts v3.9.2
*   **Peta Interaktif**: Leaflet.js v1.9.4 &amp; React-Leaflet v5.0.0
*   **Database**: PostgreSQL
*   **ORM**: Prisma v5.22.0
*   **Icons**: Lucide React v1.24.0

---

## 📁 Struktur Direktori Penting

```text
dashboard-umkm/
├── app/
│   ├── admin/             # Halaman panel CRUD Kelola Data
│   ├── api/
│   │   └── umkm/          # Route Handler API (GET, POST, PUT, DELETE)
│   ├── monitoring/        # Halaman Monitoring Desil Kesejahteraan
│   ├── peta/              # Halaman Pemetaan Spasial
│   ├── publik/            # Halaman Portal Layanan & Chatbot Asisten
│   ├── statistik/         # Halaman Dashboard Statistik Grafik
│   ├── utils/
│   │   ├── db.ts          # Integrator Prisma client & fallback data
│   │   └── mockData.ts    # Seed data & memori penyimpanan lokal fallback
│   ├── globals.css        # Konfigurasi Tailwind v4 & custom tema warm-brown
│   └── layout.tsx         # Struktur layout global, footer, & metadata SEO
├── components/
│   ├── AdminClient.tsx    # Logika CRUD client-side & Form Modal
│   ├── LeafletMap.tsx     # Komponen peta Leaflet & custom icon fix
│   ├── MonitoringClient.tsx # Logika dashboard monitoring & grafik desil
│   ├── Navbar.tsx         # Responsive navbar, menu, & Suspense search
│   ├── PemetaanClient.tsx # Sinkronisasi tabel paginasi dengan peta
│   └── StatsCharts.tsx    # Visualisasi Recharts (Bar, Pie, Doughnut)
├── prisma/
│   └── schema.prisma      # Definis skema tabel PostgreSQL
├── package.json           # Dependensi project & script build
└── README.md              # Dokumentasi teknis aplikasi
```

---

## 🔌 Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan komputer Anda sudah terpasang:
*   [Node.js](https://nodejs.org) (Versi LTS terbaru, disarankan v20.9+)
*   Pnpm (disarankan v11+) atau NPM

### 2. Kloning dan Instalasi
Kloning atau unduh project ke lokal, masuk ke direktori utama, lalu jalankan instalasi dependensi:
```bash
pnpm install
```

### 3. Konfigurasi Environment (Database)
Buat berkas `.env` di direktori utama (*root*) project:
```bash
touch .env
```
Tambahkan konfigurasi database PostgreSQL Anda:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nama_database?schema=public"
```

> **💡 Fitur Database Fallback (Tanpa Setup Database)**
> Jika Anda belum memiliki database PostgreSQL aktif, biarkan berkas `.env` kosong atau jangan buat berkas `.env`. Aplikasi ini memiliki sistem *fallback* pintar di dalam [db.ts](file:///c:/Users/Ikhwan%20Kurniawan/Documents/GitHub/dashboard-umkm/app/utils/db.ts) yang akan otomatis mengalihkan kueri ke **in-memory mock database** berisi 30 data UMKM realistik. Aplikasi tetap dapat dijalankan, dicari, ditambah, diedit, dan dihapus langsung di browser untuk tujuan demonstrasi.

### 4. Push Schema ke Database (Jika menggunakan PostgreSQL)
Jika Anda menggunakan PostgreSQL asli, buat struktur tabel secara otomatis menggunakan Prisma:
```bash
npx prisma db push
```

### 5. Jalankan Development Server
Mulai server lokal:
```bash
pnpm dev
```
Buka peramban (*browser*) Anda ke `http://localhost:3000`.

### 6. Build Produksi
Untuk melakukan kompilasi build produksi teroptimasi:
```bash
pnpm build
```
atau
```bash
npx next build
```
.
