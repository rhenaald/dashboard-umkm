# Logbook Progres Magang 14 Hari (BAKUL KAHURIPAN)

## Rekomendasi Judul Laporan Magang

### Mahasiswa A (Fokus: Frontend, Visualisasi Data, dan Asistensi AI)
*   **Judul 1:** Rancang Bangun Sistem Informasi Publik dan Visualisasi Statistik UMKM Berbasis Web pada Kelurahan Kahuripan
*   **Judul 2:** Implementasi Portal Layanan Publik Terpadu dan Virtual Assistant Chatbot berbasis React untuk Akselerasi Informasi Pelaku Usaha
*   **Cakupan Fitur:** Landing Page, Dashboard Statistik (Grafik Recharts), KBLI Search Tool, Floating Virtual Assistant Chatbot.

### Mahasiswa B (Fokus: Geolocation/GIS, Backend, dan Sistem Monitoring)
*   **Judul 1:** Pengembangan Sistem Informasi Geografis (SIG) Pemetaan Interaktif UMKM Kelurahan Kahuripan Berbasis Leaflet.js
*   **Judul 2:** Implementasi Sistem Monitoring Kesejahteraan Pelaku UMKM dan Panel CRUD Administrator Kelurahan Kahuripan Berbasis Next.js
*   **Cakupan Fitur:** Pemetaan Interaktif Leaflet.js, Panel CRUD Admin Data UMKM, Monitoring Desil Prioritas Kesejahteraan, Skema Prisma DB & API.

---

Tabel berikut menunjukkan logbook progres harian selama 14 hari kerja untuk **Mahasiswa A (Frontend, Visualisasi & AI)** dan **Mahasiswa B (Backend, GIS & Monitoring)**, dilengkapi dengan 3 kali sesi bimbingan bersama Dosen Pembimbing / Pembimbing Lapangan.

| Hari | Mahasiswa A (Frontend, Visualisasi & AI) | Mahasiswa B (Backend, GIS & Monitoring) | Kegiatan Bersama Pembimbing (Bimbingan) |
| :--- | :--- | :--- | :--- |
| **Hari 1** | **Progres:** Analisis kebutuhan sistem informasi umum, pengumpulan data perizinan KBLI Kelurahan Kahuripan, dan instalasi repositori project.<br><br>**Bimbingan:** Pembahasan ide program kerja magang dan penyepakatan target sistem aplikasi. | **Progres:** Analisis kebutuhan basis data UMKM kelurahan Kahuripan, perancangan skema relasional, dan inisialisasi framework Next.js.<br><br>**Bimbingan:** Pembahasan ide program kerja magang dan penyepakatan target sistem aplikasi. | **Bimbingan 1:**<br>Penyamaan persepsi rancangan sistem, penentuan target luaran aplikasi, pembagian tugas mahasiswa, serta diskusi jadwal bimbingan. |
| **Hari 2** | Pembuatan kerangka desain UI halaman publik dan implementasi komponen navigasi header (Navbar) dan Footer aplikasi. | Konfigurasi Prisma ORM dengan basis data (PostgreSQL/SQLite) dan pembuatan skema tabel data UMKM. | - |
| **Hari 3** | Penyusunan layout utama halaman Beranda (Landing Page) dan visualisasi ringkasan informasi UMKM. | Pembuatan dan eksekusi skrip migrasi database Prisma serta pengisian data dummy (*seeding data* UMKM awal). | - |
| **Hari 4** | Pembuatan halaman statistik (`/statistik`) dan integrasi pustaka grafik (Recharts) untuk kerangka dasar chart. | Pembuatan REST API endpoint awal (`/api/umkm`) untuk membaca data dari database (*GET data* pelaku usaha). | - |
| **Hari 5** | Pemrosesan data mentah statistik untuk ditampilkan dalam bentuk diagram lingkaran (kategori UMKM) dan diagram batang (sebaran modal). | Pembuatan REST API endpoint lanjutan untuk proses penambahan (*POST*) dan pengeditan (*PUT*) data UMKM. | - |
| **Hari 6** | Pembuatan kerangka layout halaman Layanan Publik (`/publik`) dan integrasi tautan layanan mandiri eksternal. | Integrasi Leaflet.js pada Next.js (konfigurasi library peta digital agar ramah proses SSR/Server-Side Rendering). | - |
| **Hari 7** | Implementasi fitur pencarian klasifikasi kode bidang usaha KBLI secara dinamis (sisi klien) pada halaman Layanan Publik. | Pemetaan titik koordinat lokasi pelaku usaha (marker) ke dalam peta interaktif berdasarkan data latitude dan longitude di database. | - |
| **Hari 8** | **Progres:** Merancang UI awal untuk panel obrolan (Chatbot) Asisten Virtual BAKUL secara statis di halaman Publik.<br><br>**Bimbingan:** Demonstrasi purwarupa visual peta interaktif UMKM dan demo awal bot asistensi perizinan NIB. | **Progres:** Optimalisasi fitur pop-up peta interaktif dengan menambahkan informasi detail UMKM (nama, tipe, produk unggulan).<br><br>**Bimbingan:** Demonstrasi purwarupa visual peta interaktif UMKM dan demo awal bot asistensi perizinan NIB. | **Bimbingan 2:**<br>Evaluasi fungsionalitas peta interaktif dan pemetaan lokasi. Penilaian responsivitas UI dan masukan terkait alur percakapan chatbot. |
| **Hari 9** | Pengembangan logika *keyword matching* (kata kunci) di sisi klien agar chatbot dapat merespons pertanyaan seputar NIB, Halal, KBLI secara otomatis. | Pembuatan modul filter pencarian interaktif pada halaman peta berdasarkan jenis usaha, kelurahan, dan kisaran modal. | - |
| **Hari 10** | Pembuatan halaman administrasi CRUD (`/admin`) bagian antarmuka pengguna (tabel data, modal form tambah dan edit usaha). | Pembuatan fungsionalitas hapus data (*DELETE*) pada API dan integrasi backend dengan antarmuka tabel admin. | - |
| **Hari 11** | Penerapan validasi input formulir tambah/edit data usaha pelaku UMKM pada panel administrator untuk menjaga konsistensi data. | Pembuatan halaman Monitoring Kesejahteraan (`/monitoring`) dan penataan struktur desil kemiskinan (Desil 1–4) UMKM. | - |
| **Hari 12** | Refaktorisasi komponen chatbot statis menjadi tombol melayang (*Floating Action Button / FAB*) yang aktif secara global di semua halaman. | Implementasi fitur validasi status survei lapangan (belum survei, proses, selesai) dan integrasi filter status pada halaman monitoring. | - |
| **Hari 13** | **Progres:** Pengujian lintas peramban (*cross-browser*) untuk memastikan tombol melayang chatbot berjalan responsif di mobile & desktop.<br><br>**Bimbingan:** Demo akhir seluruh fitur aplikasi (Statistik, Peta, Layanan Publik, Monitoring Desil, Admin CRUD) dan validasi kelayakan aplikasi. | **Progres:** Melakukan *stress testing* pada proses CRUD data UMKM dalam database serta pengecekan relasi data desil kesejahteraan.<br><br>**Bimbingan:** Demo akhir seluruh fitur aplikasi (Statistik, Peta, Layanan Publik, Monitoring Desil, Admin CRUD) dan validasi kelayakan aplikasi. | **Bimbingan 3:**<br>Pemeriksaan hasil akhir fungsionalitas aplikasi secara keseluruhan, persetujuan proyek selesai, dan konsultasi draft kerangka laporan magang. |
| **Hari 14** | Perbaikan *bug* visual minor (dark mode styling, warna aksen) dan finalisasi *build project* produksi Next.js. | Penyusunan dokumentasi kode program (README, panduan API endpoint) dan perapian database relasional untuk keperluan *handover*. | - |
