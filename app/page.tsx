import React from 'react';
import Link from 'next/link';
import { getAllUmkm } from '@/app/utils/db';
import {
  Award, Users, Map, HelpCircle, ArrowRight, ShieldCheck,
  GraduationCap, TrendingUp, SearchX, X, Briefcase, FileText, CheckCircle, Store, Landmark
} from 'lucide-react';

// Highlight search matching text helper
function highlightText(text: string, query: string) {
  if (!query) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-amber-250 text-amber-950 font-semibold rounded px-0.5">{part}</mark>
          : part
      )}
    </span>
  );
}

// Next.js 16 dynamic search params types
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';

  const allUmkmList = await getAllUmkm();

  // Filter for search
  const filteredUmkm = query
    ? allUmkmList.filter(item =>
      item.nama.toLowerCase().includes(query.toLowerCase()) ||
      item.nama_usaha.toLowerCase().includes(query.toLowerCase()) ||
      item.produk.toLowerCase().includes(query.toLowerCase()) ||
      item.alamat.toLowerCase().includes(query.toLowerCase()) ||
      item.kategori.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  // Summary statistics for mini charts
  const totalCount = allUmkmList.length;
  const nibCount = allUmkmList.filter(item => item.status_nib === 'Sudah NIB').length;
  const trainingCount = allUmkmList.filter(item => item.status_pelatihan === 'Pernah').length;
  const nibPercentage = Math.round((nibCount / totalCount) * 100);
  const trainingPercentage = Math.round((trainingCount / totalCount) * 100);

  return (
    <div className="flex-1 bg-warm-brown-50 dark:bg-warm-brown-950 transition-colors duration-300">

      {/* Search Mode View */}
      {query ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-warm-brown-200 pb-5 dark:border-warm-brown-850">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-warm-brown-900 dark:text-warm-brown-100">
                Hasil Pencarian
              </h1>
              <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
                Menampilkan {filteredUmkm.length} UMKM yang cocok dengan kata kunci <span className="font-semibold text-warm-brown-800 dark:text-warm-brown-200">"{query}"</span>
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-warm-brown-300 bg-white px-3 py-1.5 text-xs font-semibold text-warm-brown-700 shadow-sm hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800"
            >
              <X size={14} />
              Reset Pencarian
            </Link>
          </div>

          {filteredUmkm.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUmkm.map((umkm) => (
                <div
                  key={umkm.id}
                  className="rounded-2xl border border-warm-brown-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-full bg-warm-brown-100 px-2.5 py-0.5 text-xs font-medium text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200">
                        {highlightText(umkm.kategori, query)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${umkm.status_nib === 'Sudah NIB'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                        {umkm.status_nib}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-warm-brown-900 dark:text-warm-brown-150">
                      {highlightText(umkm.nama_usaha, query)}
                    </h3>
                    <p className="mt-1 text-sm text-warm-brown-600 dark:text-warm-brown-400 font-medium">
                      Pemilik: {highlightText(umkm.nama, query)}
                    </p>
                    <p className="mt-2 text-sm text-warm-brown-700 dark:text-warm-brown-300">
                      Produk: {highlightText(umkm.produk, query)}
                    </p>
                    <p className="mt-3 text-xs text-warm-brown-500 dark:text-warm-brown-400 border-t border-warm-brown-100 pt-3 dark:border-warm-brown-850">
                      Alamat: {highlightText(umkm.alamat, query)} (RT {umkm.rt} / RW {umkm.rw})
                    </p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/peta?id=${umkm.id}`}
                      className="flex-1 text-center items-center justify-center rounded-xl bg-warm-brown-700 py-2 text-xs font-semibold text-white hover:bg-warm-brown-800 transition-colors shadow-sm"
                    >
                      Lihat di Peta
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-brown-100 text-warm-brown-600 dark:bg-warm-brown-900 dark:text-warm-brown-400 shadow-inner">
                <SearchX size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
                Tidak Ada Hasil Cocok
              </h3>
              <p className="mt-2 max-w-sm text-sm text-warm-brown-600 dark:text-warm-brown-400">
                Kami tidak menemukan UMKM atau produk yang cocok dengan pencarian Anda. Coba ganti kata kunci atau lihat pemetaan lengkap.
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/"
                  className="rounded-xl border border-warm-brown-300 bg-white px-4 py-2 text-sm font-semibold text-warm-brown-700 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800 shadow-sm"
                >
                  Ulangi Pencarian
                </Link>
                <Link
                  href="/peta"
                  className="rounded-xl bg-warm-brown-700 px-4 py-2 text-sm font-semibold text-white hover:bg-warm-brown-800 shadow-sm"
                >
                  Buka Peta Interaktif
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Standard Landing Page View */
        <div>
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-warm-brown-900 to-warm-brown-950 text-warm-brown-50 py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 opacity-15">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-warm-brown-850 px-3.5 py-1 text-xs font-semibold tracking-wide text-warm-brown-200 border border-warm-brown-800">
                  <Award size={14} className="text-amber-500" />
                  Digitalisasi UMKM Mandiri Kelurahan Kahuripan
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  BAKUL KAHURIPAN
                </h1>
                <p className="text-lg text-warm-brown-200/90 leading-relaxed max-w-xl">
                  Bantu Kelola Usaha Lokal (BAKUL KAHURIPAN) adalah dashboard statistik, portal pelayanan publik, dan pemetaan interaktif digital bagi pelaku UMKM di wilayah Kelurahan Kahuripan, Kecamatan Tawang, Kota Tasikmalaya.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/statistik"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white hover:bg-amber-700 shadow-md transition-all hover:-translate-y-0.5"
                  >
                    Statistik Usaha
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/peta"
                    className="inline-flex items-center gap-2 rounded-xl border border-warm-brown-700 bg-warm-brown-900/60 px-5 py-3 text-sm font-bold hover:bg-warm-brown-900 shadow-md transition-all hover:-translate-y-0.5"
                  >
                    Pemetaan Lokasi
                  </Link>
                </div>
              </div>

              {/* Graphic Profile Card */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-warm-brown-500 opacity-30 blur-2xl"></div>
                <div className="relative rounded-3xl border border-warm-brown-800 bg-warm-brown-900/80 p-8 backdrop-blur-md shadow-2xl">
                  <h3 className="text-xl font-bold border-b border-warm-brown-800 pb-4 text-warm-brown-100 flex items-center gap-2">
                    <Map size={20} className="text-amber-500" />
                    Profil Singkat Kelurahan
                  </h3>
                  <div className="mt-6 space-y-4 text-sm text-warm-brown-300">
                    <div className="flex justify-between items-center py-2 border-b border-warm-brown-800/40">
                      <span className="font-medium">Kecamatan:</span>
                      <span className="text-warm-brown-100 font-semibold">Tawang</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-warm-brown-800/40">
                      <span className="font-medium">Kota:</span>
                      <span className="text-warm-brown-100 font-semibold">Tasikmalaya</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-warm-brown-800/40">
                      <span className="font-medium">Penduduk:</span>
                      <span className="text-warm-brown-100 font-semibold">~15.420 Jiwa (2025)</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">Peta Wilayah Admin:</span>
                      <span className="text-amber-400 font-semibold">Telah Terpetakan (100%)</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex-1 bg-warm-brown-950/60 p-3 rounded-2xl text-center border border-warm-brown-800/60">
                      <span className="block text-2xl font-black text-amber-500">{totalCount}</span>
                      <span className="text-[10px] text-warm-brown-400 uppercase tracking-wide font-bold">Total UMKM</span>
                    </div>
                    <div className="flex-1 bg-warm-brown-950/60 p-3 rounded-2xl text-center border border-warm-brown-800/60">
                      <span className="block text-2xl font-black text-amber-500">{nibPercentage}%</span>
                      <span className="text-[10px] text-warm-brown-400 uppercase tracking-wide font-bold">Memiliki NIB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Administrative Map Preview */}
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-start">

              {/* Left Column: Administrative Bounds (Custom styled SVG) & Achievements */}
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-500 dark:text-warm-brown-400">
                    Administrasi Wilayah
                  </span>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
                    Peta Batas Administrasi Kelurahan
                  </h2>
                  <p className="mt-4 text-sm text-warm-brown-700 dark:text-warm-brown-300 leading-relaxed">
                    Kelurahan Kahuripan berbatasan langsung dengan Kelurahan Cikalang di sebelah timur dan Kelurahan Lengkong di sebelah utara. Wilayah ini terbagi dalam 12 Rukun Warga (RW) yang merupakan sentra pergerakan ekonomi mikro Kota Tasikmalaya.
                  </p>
                </div>

                {/* Stenciled Administrative SVG Map */}
                <div className="relative h-64 rounded-3xl bg-warm-brown-100/50 border border-warm-brown-200 flex items-center justify-center p-4 overflow-hidden dark:bg-warm-brown-900/20 dark:border-warm-brown-850">
                  <div className="absolute top-4 left-4 text-xs font-bold bg-warm-brown-750 text-warm-brown-100 rounded px-2.5 py-1 z-10 shadow-sm">
                    KAHURIPAN ADMINISTRATIVE MAP
                  </div>

                  <svg className="w-full h-full max-w-[280px] text-warm-brown-300 dark:text-warm-brown-850 filter drop-shadow-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Kelurahan shape */}
                    <path d="M10 25 L35 15 L75 10 L90 45 L80 85 L45 90 L20 80 Z" fill="currentColor" className="fill-warm-brown-200/40 dark:fill-warm-brown-800/10" stroke="var(--warm-brown-500)" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* RW Divisions inside */}
                    <path d="M35 15 L45 45 L20 80" stroke="var(--warm-brown-300)" strokeWidth="0.8" />
                    <path d="M45 45 L80 85" stroke="var(--warm-brown-300)" strokeWidth="0.8" />
                    <path d="M45 45 L75 10" stroke="var(--warm-brown-300)" strokeWidth="0.8" />

                    {/* Sentra Pins */}
                    <circle cx="28" cy="30" r="3" fill="#d97706" className="animate-ping" />
                    <circle cx="28" cy="30" r="2.5" fill="#d97706" />
                    <text x="33" y="32" className="text-[5px] font-bold fill-warm-brown-700 dark:fill-warm-brown-300">Sentra Kuliner</text>

                    <circle cx="60" cy="55" r="3" fill="#834f30" />
                    <circle cx="60" cy="55" r="2.5" fill="#834f30" />
                    <text x="65" y="57" className="text-[5px] font-bold fill-warm-brown-700 dark:fill-warm-brown-300">Sentra Kelom</text>

                    <circle cx="45" cy="75" r="3" fill="#d97706" />
                    <circle cx="45" cy="75" r="2.5" fill="#d97706" />
                    <text x="50" y="77" className="text-[5px] font-bold fill-warm-brown-700 dark:fill-warm-brown-300">Bordir & Kebaya</text>
                  </svg>

                  <div className="absolute bottom-4 right-4 text-[10px] text-warm-brown-500 dark:text-warm-brown-400 italic">
                    Skala 1:12.500
                  </div>
                </div>

                {/* Achievements list */}
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-warm-brown-850 dark:text-warm-brown-200">
                    Prestasi Kelurahan
                  </h4>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-warm-brown-200 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
                    <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl dark:bg-yellow-950/20 dark:text-yellow-400">
                      <Award size={20} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100">
                        Kelurahan Terbaik Digitalisasi UMKM 2025
                      </h5>
                      <p className="mt-1 text-xs text-warm-brown-600 dark:text-warm-brown-400">
                        Dianugerahkan oleh Walikota Tasikmalaya atas pencapaian integrasi perizinan NIB dan portal statis UMKM.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Stats / Grafik Summary & Photo Gallery */}
              <div className="lg:col-span-6 space-y-12">

                {/* Mini Stats Summary Box */}
                <div className="bg-white rounded-3xl border border-warm-brown-200 p-8 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
                  <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-500 dark:text-warm-brown-400">
                    Analisis Kilat Usaha
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-warm-brown-900 dark:text-warm-brown-100">
                    Status Legalitas & Kompetensi
                  </h3>

                  <div className="mt-8 space-y-8">
                    {/* NIB Ownership Mini Progress Chart */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="flex items-center gap-1.5 text-warm-brown-800 dark:text-warm-brown-200">
                          <ShieldCheck size={16} className="text-green-600 dark:text-green-450" />
                          Kepemilikan Nomor Induk Berusaha (NIB)
                        </span>
                        <span className="text-warm-brown-900 dark:text-warm-brown-150 font-bold">{nibPercentage}%</span>
                      </div>
                      <div className="relative h-4 w-full rounded-full bg-warm-brown-100 dark:bg-warm-brown-800 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-warm-brown-500 to-green-600 transition-all duration-1000"
                          style={{ width: `${nibPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-warm-brown-500 dark:text-warm-brown-400">
                        <span>{nibCount} Usaha Terdaftar NIB</span>
                        <span>{totalCount - nibCount} Belum NIB</span>
                      </div>
                    </div>

                    {/* Training Mini Progress Chart */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="flex items-center gap-1.5 text-warm-brown-800 dark:text-warm-brown-200">
                          <GraduationCap size={16} className="text-amber-600 dark:text-amber-500" />
                          Peserta Pelatihan Digitalisasi & Keuangan
                        </span>
                        <span className="text-warm-brown-900 dark:text-warm-brown-150 font-bold">{trainingPercentage}%</span>
                      </div>
                      <div className="relative h-4 w-full rounded-full bg-warm-brown-100 dark:bg-warm-brown-800 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-warm-brown-550 to-amber-600 transition-all duration-1000"
                          style={{ width: `${trainingPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-warm-brown-500 dark:text-warm-brown-400">
                        <span>{trainingCount} Pelaku Usaha Pernah Pelatihan</span>
                        <span>{totalCount - trainingCount} Belum Mengikuti</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-warm-brown-100 dark:border-warm-brown-850 flex justify-end">
                    <Link
                      href="/statistik"
                      className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 flex items-center gap-1 group"
                    >
                      Buka Dashboard Statistik Lengkap
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Stenciled Image Gallery of local UMKM */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-warm-brown-500 dark:text-warm-brown-400">
                    Galeri Kegiatan UMKM
                  </h4>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {/* Simulated premium image tiles with gradients and icons */}
                    <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-warm-brown-600 to-warm-brown-800 flex flex-col justify-end p-3 text-white overflow-hidden shadow-sm group hover:-translate-y-0.5 transition-transform duration-300">
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
                      <Store size={18} className="absolute top-3 right-3 text-warm-brown-200" />
                      <span className="relative text-[10px] font-bold tracking-wide uppercase">Kuliner</span>
                    </div>

                    <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-warm-brown-500 to-amber-700 flex flex-col justify-end p-3 text-white overflow-hidden shadow-sm group hover:-translate-y-0.5 transition-transform duration-300">
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
                      <Briefcase size={18} className="absolute top-3 right-3 text-warm-brown-200" />
                      <span className="relative text-[10px] font-bold tracking-wide uppercase">Kerajinan</span>
                    </div>

                    <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-warm-brown-750 to-warm-brown-950 flex flex-col justify-end p-3 text-white overflow-hidden shadow-sm group hover:-translate-y-0.5 transition-transform duration-300">
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
                      <Award size={18} className="absolute top-3 right-3 text-warm-brown-200" />
                      <span className="relative text-[10px] font-bold tracking-wide uppercase">Bordir Tasik</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Module Nav Grid Section */}
          <div className="bg-warm-brown-100 border-t border-b border-warm-brown-200/50 py-16 dark:bg-warm-brown-900/20 dark:border-warm-brown-850">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-extrabold text-warm-brown-900 dark:text-warm-brown-100">
                  Modul & Fitur Aplikasi
                </h2>
                <p className="mt-3 text-sm text-warm-brown-600 dark:text-warm-brown-400">
                  Akses langsung berbagai instrumen kelola data, layanan publik, dan kesejahteraan pelaku usaha lokal.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Card 1: Statistik */}
                <Link
                  href="/statistik"
                  className="group rounded-2xl border border-warm-brown-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-warm-brown-800 dark:bg-warm-brown-900/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors dark:bg-amber-950/20 dark:text-amber-400">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    Dashboard Statistik
                  </h3>
                  <p className="mt-2 text-xs text-warm-brown-600 dark:text-warm-brown-400 leading-relaxed">
                    Sajian grafik sebaran kategori usaha, kepemilikan NIB, dan persentase pelatihan terintegrasi.
                  </p>
                </Link>

                {/* Card 2: Pemetaan */}
                <Link
                  href="/peta"
                  className="group rounded-2xl border border-warm-brown-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-warm-brown-800 dark:bg-warm-brown-900/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400">
                    <Map size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                    Pemetaan Wilayah
                  </h3>
                  <p className="mt-2 text-xs text-warm-brown-600 dark:text-warm-brown-400 leading-relaxed">
                    Peta interaktif sebaran pelaku usaha, lengkap dengan pop-up detail dan tabel terintegrasi.
                  </p>
                </Link>

                {/* Card 3: Layanan Publik */}
                <Link
                  href="/publik"
                  className="group rounded-2xl border border-warm-brown-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-warm-brown-800 dark:bg-warm-brown-900/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors dark:bg-amber-950/20 dark:text-amber-400">
                    <Landmark size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    Portal Layanan Publik
                  </h3>
                  <p className="mt-2 text-xs text-warm-brown-600 dark:text-warm-brown-400 leading-relaxed">
                    Akses cepat pendaftaran NIB, Sertifikasi Halal MUI, panduan KBLI, dan chatbot asisten virtual.
                  </p>
                </Link>

                {/* Card 4: Monitoring */}
                <Link
                  href="/monitoring"
                  className="group rounded-2xl border border-warm-brown-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:border-warm-brown-800 dark:bg-warm-brown-900/80"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                    Monitoring Kesejahteraan
                  </h3>
                  <p className="mt-2 text-xs text-warm-brown-600 dark:text-warm-brown-400 leading-relaxed">
                    Filter desil prioritas bantuan (Desil 1–4) dan tabel validasi status cek lapangan UMKM.
                  </p>
                </Link>

              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
