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
        <span className="text-sm font-semibold text-warm-brown-600 mt-2">Memuat Peta Interaktif Leaflet...</span>
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
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-7.335, 108.218]); // Tasikmalaya Center (Tawang & Cihideung)
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 20;

  // Filter list of categories & kecamatans
  const categories = Array.from(new Set(initialUmkmList.map(item => item.kategori).filter(Boolean)));
  const kecamatans = Array.from(new Set(initialUmkmList.map(item => item.kecamatan).filter(Boolean)));

  // Filter list of UMKM based on Search (Navbar) + Category + Kecamatan
  const filteredList = initialUmkmList.filter(item => {
    const matchesSearch = !query ||
      (item.nama || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.nama_usaha || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.produk || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.alamat || '').toLowerCase().includes(query.toLowerCase());

    const matchesCategory = !selectedCategory ||
      (item.kategori || '').toLowerCase() === selectedCategory.toLowerCase();

    const matchesKecamatan = !selectedKecamatan ||
      (item.kecamatan || '').toLowerCase() === selectedKecamatan.toLowerCase();

    return matchesSearch && matchesCategory && matchesKecamatan;
  });

  // Reset page to 1 when filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedKecamatan]);

  // Paginated elements
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (umkm: Umkm) => {
    if (typeof umkm.latitude === 'number' && typeof umkm.longitude === 'number') {
      setMapCenter([umkm.latitude, umkm.longitude]);
      setMapZoom(18); // Zoom in on exact place pin
      setSelectedId(umkm.id);
    }

    // Smooth scroll map into view on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('interactive-map-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetMap = () => {
    setMapCenter([-7.335, 108.218]);
    setMapZoom(14);
    setSelectedId(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">

      {/* Map Display Column (5 cols on Desktop) */}
      <div id="interactive-map-container" className="lg:col-span-5 h-[450px] lg:h-[calc(100vh-140px)] lg:max-h-[600px] relative lg:sticky lg:top-20 self-start">
        <LeafletMap
          umkmList={filteredList}
          activeCenter={mapCenter}
          activeZoom={mapZoom}
          selectedId={selectedId}
        />

        {/* Floating Reset View Control */}
        <button
          onClick={handleResetMap}
          className="absolute bottom-4 left-4 z-[400] flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3 py-2 text-xs font-bold text-warm-brown-800 shadow-lg border border-warm-brown-150 hover:bg-warm-brown-50 dark:bg-warm-brown-900/95 dark:border-warm-brown-800 dark:text-warm-brown-200 dark:hover:bg-warm-brown-850"
        >
          <RefreshCw size={12} />
          Reset Fokus Peta
        </button>

        {/* Floating Map Legend */}
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md border border-warm-brown-150 rounded-2xl p-3 shadow-md text-[11px] font-bold text-warm-brown-800 space-y-1.5 dark:bg-warm-brown-900/95 dark:border-warm-brown-800 dark:text-warm-brown-200">
          <p className="flex items-center gap-1.5 font-extrabold text-[10px] text-warm-brown-900 dark:text-warm-brown-150 border-b pb-1 mb-1.5 uppercase tracking-wider">
            <Layers size={12} />
            Warna Kategori Usaha
          </p>
          <div className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full bg-red-600 border border-white shadow-sm shrink-0"></span>
            <span>Kuliner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full bg-blue-600 border border-white shadow-sm shrink-0"></span>
            <span>Jasa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full bg-purple-600 border border-white shadow-sm shrink-0"></span>
            <span>Fesyen</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full bg-emerald-600 border border-white shadow-sm shrink-0"></span>
            <span>Kerajinan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full bg-amber-500 border border-white shadow-sm shrink-0"></span>
            <span>Perdagangan</span>
          </div>
        </div>
      </div>

      {/* Table & Controls Column (7 cols on Desktop) */}
      <div className="lg:col-span-7 flex flex-col justify-between">

        {/* Filtering Options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-warm-brown-600 dark:text-warm-brown-400 uppercase tracking-wide">
                Kecamatan:
              </label>
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-200"
              >
                <option value="">Semua Kecamatan ({kecamatans.length})</option>
                {kecamatans.map((kec) => (
                  <option key={kec} value={kec}>
                    {kec} ({initialUmkmList.filter(i => i.kecamatan === kec).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-warm-brown-600 dark:text-warm-brown-400 uppercase tracking-wide">
                Kategori:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-200"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-warm-brown-500 dark:text-warm-brown-450 font-semibold text-right">
            Menampilkan <span className="font-extrabold text-warm-brown-800 dark:text-warm-brown-200">{filteredList.length}</span> dari {initialUmkmList.length} UMKM
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="flex-1 overflow-x-auto border border-warm-brown-200/80 rounded-2xl shadow-inner bg-white dark:border-warm-brown-850 dark:bg-warm-brown-900/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-warm-brown-100 border-b border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 text-warm-brown-850 dark:text-warm-brown-150 uppercase tracking-wider font-extrabold">
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Usaha / Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Kecamatan</th>
                <th className="px-4 py-3">Legalitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-brown-100 dark:divide-warm-brown-850/60 font-medium">
              {paginatedList.length > 0 ? (
                paginatedList.map((umkm, idx) => {
                  const isSelected = selectedId === umkm.id;
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
                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-full bg-warm-brown-100 px-2 py-0.5 text-[10px] font-bold text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200">
                          {umkm.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold">
                        {umkm.kecamatan || 'Tawang'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${umkm.status_nib === 'Sudah NIB'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                          : 'bg-warm-brown-100 text-warm-brown-800 dark:bg-warm-brown-950/40 dark:text-warm-brown-300'
                          }`}>
                          {umkm.status_nib || '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-warm-brown-500 dark:text-warm-brown-450 italic">
                    Tidak ada data UMKM yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-brown-100 dark:border-warm-brown-850">
            <div className="text-xs text-warm-brown-500 dark:text-warm-brown-450 font-semibold">
              Halaman <span className="font-extrabold text-warm-brown-800 dark:text-warm-brown-200">{currentPage}</span> dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-8 w-8 rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 disabled:opacity-40 hover:bg-warm-brown-50 transition-colors shadow-sm dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-8 w-8 rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 disabled:opacity-40 hover:bg-warm-brown-50 transition-colors shadow-sm dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default function PemetaanClient({ initialUmkmList }: PemetaanClientProps) {
  return (
    <Suspense fallback={
      <div className="h-96 w-full rounded-3xl bg-warm-brown-50 flex items-center justify-center border border-warm-brown-200 animate-pulse">
        <MapPin size={32} className="text-warm-brown-400" />
      </div>
    }>
      <MapContent initialUmkmList={initialUmkmList} />
    </Suspense>
  );
}
