# Logbook Kegiatan Magang - Mahasiswa A

**Fokus Utama:** Frontend Development, UI/UX Design, Data Visualization (Recharts), dan AI/Rule-Based Virtual Assistant  
**Platform:** BAKUL PELAK *(Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif)*  
**Lokasi Wilayah & Pengumpulan Data:** Kecamatan Cihideung, Kota Tasikmalaya (Scraping Dataset Google Maps)  

---

## 📌 Identitas & Rekomendasi Judul Laporan Magang

### Rekomendasi Judul Laporan:
1. **Rancang Bangun Sistem Informasi Publik dan Visualisasi Statistik UMKM Berbasis Web pada Kecamatan Cihideung Kota Tasikmalaya**
2. **Implementasi Portal Layanan Publik Terpadu dan Virtual Assistant Chatbot berbasis React untuk Akselerasi Informasi Pelaku Usaha**

### Cakupan Modul & Route (Mahasiswa A):
*   **Pengumpulan Dataset UMKM** - Web Scraping data lokasi, profil, dan informasi pelaku usaha dari Google Maps khusus wilayah Kecamatan Cihideung.
*   **Halaman Beranda** (`/`) - Hero Section, Gambaran Umum BAKUL PELAK, Card Fitur Utama.
*   **Dashboard Statistik** (`/statistik`) - Visualisasi Grafik Recharts (Sebaran Modal, Kategori Usaha, NIB, Halal).
*   **Portal Layanan Publik & KBLI** (`/publik`) - Tool Pencarian Kode KBLI Interaktif & Informasi Perizinan.
*   **Tampilan Panel Admin CRUD** (`/admin`) - Tabel Data, Modal Form Tambah/Edit, & Modal View Detail 2-Kolom.
*   **Asisten Virtual Chatbot** (`VirtualAssistant.tsx`) - Chatbot Melayang (FAB) Berbasis Aturan NLP Lokal (NIB, Halal, KBLI, Permodalan, Peta).

---

## 📅 Logbook Progres Harian Magang (21 Hari Kerja)

| Hari | Deskripsi Kegiatan & Fitur yang Dikembangkan | Hasil / Luaran Kerja | Sesi Bimbingan |
| :--- | :--- | :--- | :--- |
| **Hari 1** | • Pembahasan ide program kerja magang<br>• Penyepakatan target luaran sistem aplikasi BAKUL PELAK<br>• Pembagian peran anggota tim | • Menghasilkan dokumen perencanaan kerja magang<br>• Menghasilkan matriks pembagian tugas Frontend vs Backend | **Bimbingan 1:** Penyamaan persepsi sistem & pembagian tugas. |
| **Hari 2** | • Analisis kebutuhan data UMKM Kecamatan Cihideung<br>• Perancangan strategi ekstraksi data pelaku usaha | • Menghasilkan dokumen spesifikasi kebutuhan data UMKM<br>• Menghasilkan alur & mekanisme ekstraksi data Google Maps | - |
| **Hari 3** | • Pelaksanaan *web scraping* data profil & kategori UMKM dari Google Maps<br>• Ekstraksi data kontak & alamat usaha khusus Kecamatan Cihideung | • Menghasilkan dataset mentah 1.250 UMKM Kecamatan Cihideung<br>• Menghasilkan berkas ekstraksi kontak dan alamat lokasi usaha | - |
| **Hari 4** | • *Cleansing* & pemrosesan dataset hasil scraping Google Maps<br>• Reformat data ke struktur JSON/CSV siap pakai<br>• Setup repositori proyek Next.js | • Menghasilkan dataset UMKM Cihideung terstruktur (JSON/CSV)<br>• Terwujudnya repositori proyek Next.js yang siap dikembangkan | - |
| **Hari 5** | • Perancangan sketsa wireframe & mockup visual UI halaman publik (Figma)<br>• Penentuan tema warna *warm brown* dan elemen tata letak | • Menghasilkan rancangan mockup UI Halaman Beranda & Statistik<br>• Menghasilkan mockup visual Halaman Portal Layanan Publik | - |
| **Hari 6** | • Implementasi komponen tata letak utama (Root Layout)<br>• Pembuatan Navbar responsif dengan navigasi menu<br>• Integrasi Footer aplikasi | • Terwujudnya komponen `Navbar.tsx` & `Footer.tsx` responsif<br>• Terwujudnya tata letak utama aplikasi pada `layout.tsx` | - |
| **Hari 7** | • Penyusunan struktur Halaman Beranda (`/`)<br>• Pembuatan Hero Section bertema UMKM Kota Tasikmalaya<br>• Integrasi banner pengenalan BAKUL PELAK | • Terwujudnya Halaman Beranda (`app/page.tsx`) dengan UI modern<br>• Menghasilkan banner Hero Section interaktif bertema UMKM | **Bimbingan 2:** Evaluasi UI Beranda & dataset hasil scraping. |
| **Hari 8** | • Perancangan struktur Halaman Statistik (`/statistik`)<br>• Eksplorasi pustaka grafik visualisasi Recharts | • Terwujudnya kerangka Halaman Statistik (`app/statistik/page.tsx`)<br>• Menghasilkan integrasi awal pustaka Recharts | - |
| **Hari 9** | • Integrasi pustaka Recharts ke Halaman Statistik<br>• Pembuatan grafik dasar sebaran UMKM per kelurahan di Cihideung | • Terwujudnya komponen grafik `StatsCharts.tsx`<br>• Menghasilkan visualisasi sebaran UMKM per kelurahan | - |
| **Hari 10** | • Pengembangan diagram lingkaran (kategori usaha)<br>• Pembuatan diagram batang (sebaran modal & status NIB/Halal) | • Menghasilkan diagram lingkaran sebaran kategori usaha<br>• Menghasilkan diagram batang status NIB, Halal, dan modal | - |
| **Hari 11** | • Penyusunan kerangka Halaman Layanan Publik (`/publik`)<br>• Desain pusat informasi administrasi perizinan warga/UMKM | • Terwujudnya Halaman Layanan Publik (`app/publik/page.tsx`)<br>• Menghasilkan struktur pusat informasi perizinan UMKM | - |
| **Hari 12** | • Pembangunan fitur pencarian kode KBLI pada Halaman Layanan Publik<br>• Integrasi pencarian kata kunci bidang usaha | • Terwujudnya fitur *Search Tool* KBLI interaktif<br>• Menghasilkan input pencarian kata kunci bidang usaha | - |
| **Hari 13** | • Optimasi logika filter & *autocomplete* pencarian KBLI di sisi klien<br>• Pemetaan korelasi kode usaha UMKM Cihideung | • Menghasilkan fitur pencarian KBLI dengan *autocomplete* cepat<br>• Menghasilkan pemetaan kode perizinan UMKM Cihideung | - |
| **Hari 14** | • Desain antarmuka awal panel obrolan Asisten Virtual BAKUL<br>• Pembuatan jendela obrolan *popup* melayang di pojok kanan bawah | • Terwujudnya komponen obrolan melayang `VirtualAssistant.tsx`<br>• Menghasilkan antarmuka jendela chat *popup* yang interaktif | - |
| **Hari 15** | • Pengembangan *Rule-Based NLP Engine* untuk Asisten Virtual<br>• Penyusunan pengetahuan seputar NIB, Halal, KBLI, dan info wilayah | • Menghasilkan *engine* NLP rule-based cerdas berbasis kata kunci<br>• Menghasilkan respons otomatis seputar NIB, Halal, & KBLI | **Bimbingan 3:** Demo awal Virtual Assistant & integrasi UI. |
| **Hari 16** | • Refaktorisasi Chatbot menjadi Floating Action Button (FAB) melayang<br>• Penambahan *quick prompt pills* & tombol navigasi cepat | • Terwujudnya Floating Action Button (FAB) chatbot global<br>• Menghasilkan tombol navigasi cepat *quick prompt pills* | - |
| **Hari 17** | • Pembangunan antarmuka panel administrasi CRUD (`/admin`)<br>• Pembuatan tabel data UMKM dengan filter & tombol aksi | • Terwujudnya antarmuka Admin (`AdminClient.tsx`)<br>• Menghasilkan tabel data UMKM responsif lengkap dengan filter | - |
| **Hari 18** | • Pembuatan komponen Modal Form Tambah data UMKM<br>• Pembuatan komponen Modal Form Edit data UMKM pada panel Admin | • Menghasilkan Modal Form Tambah Data UMKM<br>• Menghasilkan Modal Form Edit Data UMKM | - |
| **Hari 19** | • Penerapan validasi formulir input data admin<br>• Penambahan Modal View Detail Usaha 2-Kolom (profil & peta lokasi) | • Terwujudnya Modal Detail Usaha 2-Kolom (`👁️ Lihat Detail`)<br>• Menghasilkan validasi input & pratinjau peta Google Maps | - |
| **Hari 20** | • Penyesuaian antarmuka Halaman Monitoring (`/monitoring`)<br>• Pembuatan ringkasan visual desil kesejahteraan UMKM | • Terwujudnya Halaman Monitoring (`/monitoring`) visual<br>• Menghasilkan ringkasan grafik desil kesejahteraan UMKM | **Bimbingan 4:** Demo akhir fungsionalitas UI & sistem. |
| **Hari 21** | • Pengujian fungsionalitas UI (Quality Assurance) & responsivitas mobile<br>• Optimasi Lighthouse (SEO & Performansi)<br>• Finalisasi *build* produksi Next.js & dokumentasi frontend | • Menghasilkan aplikasi Next.js *build* produksi bebas *bug*<br>• Menghasilkan skor Lighthouse (SEO & Performansi) optimal<br>• Menghasilkan dokumentasi modul frontend lengkap | - |

---

## 🛠️ Catatan Pembaruan Modul Frontend & AI

1. **Pengenalan Branding BAKUL PELAK**: Penyesuaian penuh nama platform menjadi *BAKUL PELAK (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif)*.
2. **Dataset Scraping Google Maps (Kecamatan Cihideung)**: Pengumpulan data UMKM asli secara langsung melalui web scraping Google Maps khusus wilayah Kecamatan Cihideung untuk diolah ke dalam grafik visualisasi dan tabel data.
3. **Virtual Assistant (Rule-Based NLP)**: Asisten cerdas 100% lokal tanpa ketergantungan API luar, menjawab pertanyaan NIB, Halal, KBLI, BJB Mesra, KUR, P-IRT, BPOM, HAKI, dan Peta UMKM secara instan.
4. **Modal View Detail Admin 2-Kolom**: Fitur pratinjau data pelaku usaha pada tabel admin yang menampilkan data profil di kiri dan peta lokasi Google Maps di kanan.
5. **Visualisasi Data Recharts**: Grafik statistik interaktif untuk sebaran kategori usaha, sebaran modal, dan persentase kepemilikan NIB/Halal.
