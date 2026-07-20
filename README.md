# BAKUL PELAK

**BAKUL PELAK** (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif) merupakan platform digital yang menyediakan dashboard statistik, portal pelayanan publik, dan pemetaan interaktif untuk mendukung pengelolaan data UMKM di berbagai wilayah. Sistem ini dirancang untuk mempermudah pemerintah daerah, pelaku UMKM, dan masyarakat dalam mengakses informasi, mengelola data, serta mendukung pengambilan keputusan berbasis data secara terintegrasi dan kolaboratif.

---

## 🌟 Fitur Utama

1. **Beranda Utama (`/`)**
   * Profil administrasi singkat dan statistik utama UMKM wilayah Tawang & Cihideung.
   * SVG Peta Batas Administrasi kelurahan dengan legenda pin sentra usaha.
   * Analisis singkat legalitas (NIB) dan status kompetensi (Pelatihan) dalam diagram mini.
   * *Live Search* global terintegrasi di Navbar untuk mencari dan menyorot UMKM secara langsung di beranda.

2. **Dashboard Statistik (`/statistik`)**
   * Kartu KPI Ringkasan: Total UMKM (2.500 Usaha), kategori usaha terpopuler, jumlah kepemilikan NIB, dan keikutsertaan pelatihan.
   * Visualisasi grafik interaktif menggunakan **Recharts**:
     * *Bar Chart Horizontal*: Distribusi jumlah usaha per kategori industri (Kuliner, Jasa, Fesyen, Kerajinan, Perdagangan).
     * *Pie Chart*: Rasio kepemilikan berkas NIB.
     * *Doughnut Chart*: Persentase keikutsertaan program pelatihan.

3. **Pemetaan Spasial Interaktif (`/peta`)**
   * Integrasi peta geografis **Leaflet.js** (OpenStreetMap) dengan koordinat GPS presisi asli (`lat` & `lng`).
   * Titik penanda (*pin markers*) dikelompokkan dengan **5 warna unik per kategori**:
     * 🔴 **Kuliner** (Pin Merah)
     * 🔵 **Jasa** (Pin Biru)
     * 🟣 **Fesyen** (Pin Ungu)
     * 🟢 **Kerajinan** (Pin Hijau)
     * 🟡 **Perdagangan** (Pin Kuning Emas)
   * Penyaringan dinamis berdasarkan **Kecamatan** (*Tawang*, *Cihideung*) dan **Kategori Usaha**.
   * Pop-up info detail usaha lengkap dengan tombol langsung **`📍 Buka di Google Maps`**.
   * Tabel direktori terpaginasi (20 baris per halaman) yang terhubung langsung dengan peta. Mengetuk baris tabel akan terbang (*smooth fly & zoom*) ke titik lokasi usaha.

4. **Portal Layanan Publik (`/publik`)**
   * Akses cepat link resmi eksternal pendaftaran NIB (OSS RBA) dan Sertifikasi Halal Gratis (SIHALAL).
   * Pencarian Kode Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) terpopuler.
   * Formulir pengaduan perizinan, permodalan, dan kendala operasional bagi pelaku usaha.
   * **Asisten Virtual BAKUL**: Chatbot simulasi interaktif yang responsif dengan tombol pintasan pertanyaan populer (Syarat NIB, Langkah NIB, Syarat Sertifikat Halal, Panduan KBLI, Program Bantuan).

5. **Monitoring Kesejahteraan & Desil (`/monitoring`)**
   * Filter visual terpadu berdasarkan Kecamatan (Tawang & Cihideung) dan Tahun Laporan.
   * Kartu rekapitulasi prioritas kesejahteraan: Desil 1–4 (Prioritas Bantuan), Desil 1–5 (Menengah Bawah), Desil 6–10 (Mandiri), serta data yang memerlukan validasi lapangan.
   * *Bar Chart* sebaran desil 1–10 dengan warna indikator dinamis.
   * Tabel verifikasi lapangan dengan tombol aksi *real-time* untuk mengubah status validasi ("Cek Lapangan" / "Perlu Cek").

6. **Kelola Data - Admin CRUD Panel (`/admin`)**
   * Panel administrasi internal untuk manajemen direktori 2.500 UMKM secara penuh.
   * Operasi **Create** (tambah UMKM baru + input link Google Maps URL), **Read** (tabel direktori), **Update** (edit data detail melalui modal form responsif), dan **Delete** (hapus data permanen).
   * **Aksi Show / Detail Usaha 👁️**: Modal pop-up 2-kolom responsif (*side-by-side split view*) menampilkan ringkasan informasi usaha di sebelah kiri dan pratinjau peta Google Maps Embed & navigasi langsung di sebelah kanan.

---

## 🛠️ Teknologi & Pustaka

Aplikasi ini dibangun menggunakan arsitektur modern Next.js yang terhubung ke Cloud PostgreSQL (Neon DB):

* **Framework**: Next.js 16.2.10 (App Router, TypeScript)
* **React Runtime**: React 19.2.4
* **Styling**: Tailwind CSS v4 (Tema kustom `warm-brown` terstruktur di `app/globals.css`)
* **Visualisasi Grafik**: Recharts v3.9.2
* **Peta Interaktif**: Leaflet.js v1.9.4 & React-Leaflet v5.0.0
* **Database**: Neon Cloud PostgreSQL (`neondb`)
* **ORM**: Prisma v5.22.0
* **Icons**: Lucide React v1.24.0

---

## 📁 Struktur Direktori Penting

```text
dashboard-umkm/
├── app/
│   ├── admin/             # Halaman panel CRUD Kelola Data
│   ├── api/
│   │   └── umkm/          # Route Handler API (GET, POST, PUT, DELETE)
│   ├── monitoring/        # Halaman Monitoring Desil Kesejahteraan
│   ├── peta/              # Halaman Pemetaan Spasial Leaflet
│   ├── publik/            # Halaman Portal Layanan & Chatbot Asisten
│   ├── statistik/         # Halaman Dashboard Statistik Grafik
│   ├── utils/
│   │   ├── db.ts          # Integrator Prisma client & fallback data
│   │   └── mockData.ts    # Seed data 2.500 UMKM (Tawang & Cihideung)
│   ├── globals.css        # Konfigurasi Tailwind v4 & custom tema warm-brown
│   └── layout.tsx         # Struktur layout global, footer, & metadata SEO
├── components/
│   ├── AdminClient.tsx    # Logika CRUD client-side, Detail Modal 👁️, & Form Modal
│   ├── GoogleMapsViewer.tsx # View embedded Google Maps interaktif
│   ├── LeafletMap.tsx     # Komponen peta Leaflet & 5 icon penanda warna
│   ├── MonitoringClient.tsx # Logika dashboard monitoring & grafik desil
│   ├── Navbar.tsx         # Responsive navbar, menu, & Suspense search
│   ├── PemetaanClient.tsx # Sinkronisasi tabel paginasi dengan peta Leaflet
│   └── StatsCharts.tsx    # Visualisasi Recharts (Bar, Pie, Doughnut)
├── data/
│   ├── Tawang.json        # Dataset asli 1.250 UMKM Kec. Tawang
│   └── Cihideung.json     # Dataset asli 1.250 UMKM Kec. Cihideung
├── prisma/
│   ├── schema.prisma      # Skema tabel PostgreSQL Prisma
│   └── seed.js            # Script seeding 2.500 UMKM & Admin ke PostgreSQL
├── scripts/
│   └── generateData.js    # Script generator otomatis dataset Tawang & Cihideung
├── package.json           # Dependensi project & script build
└── README.md              # Dokumentasi teknis aplikasi
```

---

## 🔌 Cara Sinkronisasi & Menjalankan Aplikasi

### 1. Kloning & Pull Update
```bash
git pull origin main
```

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Setup Basis Data (Cloud Neon PostgreSQL)
Variabel `DATABASE_URL` di file `.env` sudah terhubung ke **Neon Cloud PostgreSQL**:
```env
DATABASE_URL="postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require"
```

Jika memerlukan setup/seeding ulang database:
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Jalankan Development Server
```bash
pnpm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

> 🔑 **Kredensial Login Admin Default (`/login`)**:
> * **Username**: `admin`
> * **Password**: `admin123`
