# Logbook Kegiatan Magang - Mahasiswa B

**Fokus Utama:** Backend Development, Geolocation / GIS (Leaflet.js), Database Prisma ORM (Cloud PostgreSQL Neon DB), dan Sistem Monitoring Desil  
**Platform:** BAKUL PELAK *(Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif)*  
**Lokasi Wilayah & Pengumpulan Data:** Kecamatan Tawang, Kota Tasikmalaya (Scraping Dataset Google Maps)  

---

## 📌 Identitas & Rekomendasi Judul Laporan Magang

### Judul Laporan:
**RANCANG BANGUN SISTEM INFORMASI PEMETAAN SPASIAL DAN MANAJEMEN DATA PELAKU USAHA LOKAL BERBASIS KOORDINAT GEOLOCATION KECAMATAN TAWANG**

### Cakupan Modul & Route (Mahasiswa B):
*   **Pengumpulan Dataset UMKM** - Web Scraping data koordinat GPS (latitude/longitude) & profil UMKM dari Google Maps khusus wilayah Kecamatan Tawang.
*   **Peta Interaktif GIS** (`/peta`) - Pemetaan Geospasial Leaflet.js dengan Marker Warna Kategori & Pop-up Detail.
*   **Sistem Monitoring Desil** (`/monitoring`) - Pemantauan Desil Kesejahteraan Sosial-Ekonomi (Desil 1 s.d. 10) & Filter Wilayah.
*   **Integrasi Backend Admin CRUD** (`/admin` & API) - REST API Handler (`GET`, `POST`, `PUT`, `DELETE`).
*   **Skema Prisma ORM & Database Cloud** (`prisma/schema.prisma`) - Konfigurasi Neon DB PostgreSQL & Seeding 2.500 Data UMKM Hasil Scraping Google Maps.
*   **Sistem Autentikasi API** (`/api/auth`) - Manajemen Akses Login & Keamanan Admin.

---

## 📅 Logbook Progres Harian Magang (21 Hari Kerja)

| Hari | Deskripsi Kegiatan & Fitur yang Dikembangkan | Hasil / Luaran Kerja | Sesi Bimbingan |
| :--- | :--- | :--- | :--- |
| **Hari 1** | • Pembahasan ide program kerja magang<br>• Penyepakatan target luaran sistem aplikasi BAKUL PELAK<br>• Pembagian peran anggota tim | • Menghasilkan dokumen perencanaan kerja magang<br>• Menghasilkan matriks pembagian tugas Frontend vs Backend | **Bimbingan 1:** Penyamaan persepsi sistem & pembagian tugas. |
| **Hari 2** | • Analisis kebutuhan data geospasial UMKM<br>• Perancangan strategi ekstraksi titik koordinat wilayah Kecamatan Tawang | • Menghasilkan dokumen perancangan struktur data geospasial<br>• Menghasilkan skema ekstraksi koordinat GPS Kecamatan Tawang | - |
| **Hari 3** | • Pelaksanaan *web scraping* data pelaku usaha dari Google Maps<br>• Ekstraksi titik koordinat desimal GPS (latitude & longitude) Kecamatan Tawang | • Menghasilkan dataset mentah 1.250 UMKM Kecamatan Tawang<br>• Menghasilkan berkas titik koordinat desimal GPS (lat & lng) | - |
| **Hari 4** | • *Cleansing* data koordinat GPS hasil scraping Google Maps Tawang<br>• Penggabungan dataset dengan Kecamatan Cihideung (Mhs A)<br>• Perancangan ERD (Entity Relationship Diagram) basis data | • Menghasilkan ERD (Entity Relationship Diagram) basis data<br>• Menghasilkan dataset terintegrasi 2.500 UMKM Kota Tasikmalaya | - |
| **Hari 5** | • Inisialisasi basis data PostgreSQL<br>• Pembuatan skema tabel `Umkm` menggunakan Prisma ORM (`prisma/schema.prisma`) | • Terwujudnya koneksi basis data PostgreSQL<br>• Menghasilkan skema Prisma (`schema.prisma`) untuk tabel `Umkm` | - |
| **Hari 6** | • Penambahan atribut data desil kesejahteraan sosial-ekonomi (Desil 1-10)<br>• Penambahan koordinat lokasi GPS (`lat`, `lng`) pada skema DB | • Menghasilkan struktur atribut desil kesejahteraan (Desil 1-10)<br>• Menghasilkan atribut koordinat presisi GPS (`lat` & `lng`) | - |
| **Hari 7** | • Penyusunan skrip migrasi database Prisma<br>• Pembuatan skrip `prisma/seed.js` untuk *seeding* 2.500 data UMKM hasil scraping Google Maps | • Menghasilkan skrip migrasi Prisma DB terkonfigurasi<br>• Menghasilkan skrip *seeding* `prisma/seed.js` 2.500 data UMKM | **Bimbingan 2:** Evaluasi skema database & dataset hasil scraping. |
| **Hari 8** | • Pembuatan skema REST API endpoint awal (`/api/umkm`)<br>• Penanganan query pembacaan data pelaku usaha | • Terwujudnya REST API Endpoint `GET /api/umkm`<br>• Menghasilkan handler query pembacaan data UMKM dari DB | - |
| **Hari 9** | • Implementasi handler API `GET` dengan filter kelurahan & kategori usaha<br>• Penambahan fitur pencarian kata kunci & pagination | • Menghasilkan handler filter API per kelurahan & kategori usaha<br>• Menghasilkan fitur pencarian kata kunci & *pagination* API | - |
| **Hari 10** | • Penambahan API endpoint `POST` (tambah data UMKM baru)<br>• Penambahan API endpoint `PUT` (pembaruan data pelaku usaha)<br>• Penerapan validasi data backend | • Terwujudnya REST API Endpoint `POST /api/umkm`<br>• Terwujudnya REST API Endpoint `PUT /api/umkm`<br>• Menghasilkan validasi skema data backend yang aman | - |
| **Hari 11** | • Konfigurasi pustaka Leaflet.js pada Next.js<br>• Penanganan *dynamic import* (SSR-friendly) untuk Halaman Peta (`/peta`) | • Menghasilkan konfigurasi pustaka Leaflet.js pada Next.js<br>• Terwujudnya komponen *dynamic import* peta yang bebas error SSR | - |
| **Hari 12** | • Pembuatan komponen `LeafletMap.tsx`<br>• Pemuatan *tile layer* peta geografis wilayah Kecamatan Tawang & Cihideung | • Terwujudnya komponen peta interaktif `LeafletMap.tsx`<br>• Menghasilkan pemuatan *tile layer* geografis Kota Tasikmalaya | - |
| **Hari 13** | • Pemetaan titik koordinat presisi pelaku usaha (marker) pada peta<br>• Plotting latitude & longitude dari database ke komponen Leaflet.js | • Menghasilkan *plotting* titik koordinat marker UMKM pada peta<br>• Terwujudnya pemetaan lokasi presisi berdasarkan GPS asli | - |
| **Hari 14** | • Kustomisasi ikon marker berdasarkan kategori usaha (Kuliner, Jasa, Fesyen, Kerajinan, Retail)<br>• Pembuatan modal pop-up detail profil UMKM pada peta | • Menghasilkan ikon marker warna-warni per kategori usaha<br>• Terwujudnya modal *pop-up* detail profil UMKM pada peta | - |
| **Hari 15** | • Pembangunan fitur filter interaktif pada Peta GIS (kategori, kelurahan, desil)<br>• Integrasi filter dinamis di sisi peta pengguna | • Menghasilkan fitur filter peta berdasarkan bidang usaha & desil<br>• Terwujudnya panel kontrol filter interaktif pada Peta GIS | **Bimbingan 3:** Evaluasi Peta GIS Leaflet.js & filter lokasi. |
| **Hari 16** | • Optimasi performa query peta geospasial<br>• Pengujian *rendering* ribuan titik koordinat UMKM secara responsif | • Menghasilkan optimasi performa query peta geospasial<br>• Terwujudnya *rendering* responsif 2.500 marker lokasi UMKM | - |
| **Hari 17** | • Pembuatan fungsionalitas API endpoint `DELETE /api/umkm`<br>• Pengujian fitur penghapusan data oleh administrator | • Terwujudnya REST API Endpoint `DELETE /api/umkm`<br>• Menghasilkan fungsionalitas hapus data admin yang teruji | - |
| **Hari 18** | • Integrasi penuh antarmuka Admin (`/admin`) dengan REST API Backend<br>• Sinkronisasi operasi CRUD data UMKM secara *real-time* | • Terwujudnya integrasi *full-stack* panel admin & REST API<br>• Menghasilkan sinkronisasi operasi CRUD data secara *real-time* | - |
| **Hari 19** | • Perancangan & penyusunan logika pengelompokan data desil kesejahteraan (Desil 1-10)<br>• Integrasi Halaman Monitoring (`/monitoring`) dengan API backend | • Menghasilkan algoritma kalkulasi sebaran desil 1 s.d. 10<br>• Terwujudnya integrasi Halaman Monitoring (`/monitoring`) | - |
| **Hari 20** | • Migrasi basis data dari lokal ke Cloud PostgreSQL (**Neon DB**)<br>• Pengujian koneksi & performa query terdistribusi (*connection pooling*) | • Terwujudnya migrasi database ke Cloud Neon DB PostgreSQL<br>• Menghasilkan konfigurasi *connection pooling* cloud DB yang stabil | **Bimbingan 4:** Demo akhir fungsionalitas SIG, API, Cloud DB & sistem. |
| **Hari 21** | • Penyusunan dokumentasi skema database Prisma & REST API<br>• Finalisasi skrip seeding 2.500 data UMKM & penyerahan berkas backend | • Menghasilkan dokumentasi REST API & skema Prisma lengkap<br>• Menghasilkan berkas penyerahan magang & skrip DB siap pakai | - |

---

## 🛠️ Catatan Pembaruan Modul Backend & GIS

1. **Dataset Hasil Scraping Google Maps (2.500 UMKM)**: Pengambilan dan ekstraksi data pelaku usaha secara presisi dari Google Maps yang terbagi atas Kecamatan Cihideung (Mahasiswa A) dan Kecamatan Tawang (Mahasiswa B) untuk seeding database cloud Neon DB.
2. **Presisi Geolocation GPS**: Penggunaan titik koordinat desimal asli (`latitude` & `longitude`) meggunakan marker warna unik per sektor usaha.
3. **Database Cloud Neon DB**: Migrasi skema Prisma ORM ke PostgreSQL Serverless Cloud (Neon DB) untuk akses data kolaboratif yang cepat dan stabil.
4. **Sistem Monitoring Desil**: Pengelompokan data desil 1-10 secara terstruktur untuk membantu penentuan prioritas bantuan permohonan usaha.
