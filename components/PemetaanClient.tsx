'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Umkm } from '@/app/utils/mockData';
import { MapPin, Search, ChevronLeft, ChevronRight, RefreshCw, Layers } from 'lucide-react';

// Dynamic import of LeafletMap to prevent SSR window reference crashes
const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-3xl bg-warm-brown-100/50 flex flex-col items-center justify-center border border-warm-brown-200 dark:bg-warm-brown-900/10 dark:border-warm-brown-850">
        <MapPin size={32} className="text-warm-brown-400 animate-bounce" />
        <span className="text-sm font-semibold text-warm-brown-600 mt-2">Memuat Peta Interaktif...</span>
      </div>
    )
  }
);

interface PemetaanClientProps {
  initialUmkmList: Umkm[];
}

function MapContent({ initialUmkmList }: PemetaanClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Local state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-7.335, 108.222]); // Kahuripan Center
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 20;

  // Filter list of categories
  const categories = Array.from(new Set(initialUmkmList.map(item => item.kategori)));

  // Filter list of UMKM based on Search (Navbar) + Category (Local dropdown)
  const filteredList = initialUmkmList.filter(item => {
    const matchesSearch = !query ||
      item.nama.toLowerCase().includes(query.toLowerCase()) ||
      item.nama_usaha.toLowerCase().includes(query.toLowerCase()) ||
      item.produk.toLowerCase().includes(query.toLowerCase()) ||
      item.alamat.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = !selectedCategory ||
      item.kategori.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Reset page to 1 when filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory]);

  // Paginated elements
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (umkm: Umkm) => {
    setMapCenter([umkm.latitude, umkm.longitude]);
    setMapZoom(17); // Zoom close
    setSelectedId(umkm.id);

    // Smooth scroll map into view on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('interactive-map-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetMap = () => {
    setMapCenter([-7.335, 108.222]);
    setMapZoom(14);
    setSelectedId(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">

      {/* Map Display Column (5 cols on Desktop) */}
      <div id="interactive-map-container" className="lg:col-span-5 h-[350px] lg:h-[620px] relative">
        <LeafletMap
          umkmList={filteredList}
          activeCenter={mapCenter}
          activeZoom={mapZoom}
          selectedId={selectedId}
        />

        {/* Floating Reset View Control */}
        <button
          onClick={handleResetMap}
          className="absolute bottom-4 left-4 z-[400] flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-warm-brown-800 shadow-lg border border-warm-brown-100 hover:bg-warm-brown-50 dark:bg-warm-brown-900 dark:border-warm-brown-800 dark:text-warm-brown-200 dark:hover:bg-warm-brown-850"
        >
          <RefreshCw size={12} />
          Reset Fokus Peta
        </button>

        {/* Floating Map Legend */}
        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm border border-warm-brown-150 rounded-2xl p-3 shadow-md text-[11px] font-bold text-warm-brown-800 space-y-1.5 dark:bg-warm-brown-900/90 dark:border-warm-brown-800 dark:text-warm-brown-200">
          <p className="flex items-center gap-1.5 font-extrabold text-[10px] text-warm-brown-900 dark:text-warm-brown-150 border-b pb-1 mb-1">
            <Layers size={12} />
            LEGENDA KATEGORI
          </p>
          <div className="flex items-center gap-2">
            <span className="block h-3.5 w-3.5 rounded-full bg-red-600 border border-white"></span>
            <span>Kuliner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-3.5 w-3.5 rounded-full bg-warm-brown-500 border border-white"></span>
            <span>Sektor Lainnya</span>
          </div>
        </div>
      </div>

      {/* Table & Controls Column (7 cols on Desktop) */}
      <div className="lg:col-span-7 flex flex-col justify-between">

        {/* Filtering Options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-warm-brown-600 dark:text-warm-brown-400 uppercase tracking-wide">
              Kategori:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-200"
            >
              <option value="">Semua Kategori ({initialUmkmList.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({initialUmkmList.filter(i => i.kategori === cat).length})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-warm-brown-500 dark:text-warm-brown-450 font-semibold">
            Menampilkan <span className="font-extrabold text-warm-brown-800 dark:text-warm-brown-200">{filteredList.length}</span> dari {initialUmkmList.length} total UMKM
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="flex-1 overflow-x-auto border border-warm-brown-200/80 rounded-2xl shadow-inner bg-white dark:border-warm-brown-850 dark:bg-warm-brown-900/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-warm-brown-100 border-b border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 text-warm-brown-850 dark:text-warm-brown-150 uppercase tracking-wider font-extrabold">
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Usaha / Produk</th>
                <th className="px-4 py-3">Pemilik</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">RT / RW</th>
                <th className="px-4 py-3">Legalitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-brown-100 dark:divide-warm-brown-850/60 font-medium">
              {paginatedList.length > 0 ? (
                paginatedList.map((umkm, idx) => {
                  const isSelected = umkm.id === selectedId;
                  return (
                    <tr
                      key={umkm.id}
                      onClick={() => handleRowClick(umkm)}
                      className={`cursor-pointer transition-colors ${isSelected
                          ? 'bg-warm-brown-100 text-warm-brown-950 dark:bg-warm-brown-950/40 dark:text-warm-brown-250 font-bold border-l-4 border-l-warm-brown-700'
                          : 'hover:bg-warm-brown-50 dark:hover:bg-warm-brown-900/60 text-warm-brown-750 dark:text-warm-brown-300'
                        }`}
                    >
                      <td className="px-4 py-3.5 text-center font-bold">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-sm">{umkm.nama_usaha}</div>
                        <div className="text-[10px] text-warm-brown-500 dark:text-warm-brown-400 mt-0.5">{umkm.produk}</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold">{umkm.nama}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-full bg-warm-brown-100 px-2 py-0.5 text-[10px] font-bold text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200">
                          {umkm.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold">
                        RT {umkm.rt} / RW {umkm.rw}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${umkm.status_nib === 'Sudah NIB'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                            : 'bg-warm-brown-100 text-warm-brown-800 dark:bg-warm-brown-950/40 dark:text-warm-brown-300'
                          }`}>
                          {umkm.status_nib}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-warm-brown-500 dark:text-warm-brown-450 font-bold">
                    <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    Data UMKM Tidak Ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-warm-brown-200 pt-4 mt-4 dark:border-warm-brown-850">
          <div className="text-xs text-warm-brown-600 dark:text-warm-brown-400 font-semibold">
            Halaman <span className="font-extrabold text-warm-brown-900 dark:text-warm-brown-200">{currentPage}</span> dari <span className="font-extrabold text-warm-brown-900 dark:text-warm-brown-200">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 shadow-sm hover:bg-warm-brown-50 disabled:opacity-40 disabled:pointer-events-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 shadow-sm hover:bg-warm-brown-50 disabled:opacity-40 disabled:pointer-events-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PemetaanClient({ initialUmkmList }: PemetaanClientProps) {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-warm-brown-700 border-t-transparent"></div>
          <span className="text-sm font-semibold text-warm-brown-600">Sinkronisasi Parameter...</span>
        </div>
      </div>
    }>
      <MapContent initialUmkmList={initialUmkmList} />
    </Suspense>
  );
}
