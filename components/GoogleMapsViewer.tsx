'use client';

import React from 'react';
import { MapPin, ExternalLink, RefreshCw, Navigation, Building2 } from 'lucide-react';
import { Umkm } from '@/app/types/umkm';

interface GoogleMapsViewerProps {
  selectedUmkm: Umkm | null;
  onReset: () => void;
}

export default function GoogleMapsViewer({ selectedUmkm, onReset }: GoogleMapsViewerProps) {
  // Determine embed search query
  const query = selectedUmkm
    ? `${selectedUmkm.nama_usaha} ${selectedUmkm.alamat || 'Tawang Tasikmalaya'}`
    : 'Kecamatan Tawang, Kota Tasikmalaya';

  // Embed URL for Google Maps
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // External direct URL
  const externalUrl = selectedUmkm?.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="h-full w-full flex flex-col rounded-3xl overflow-hidden border border-warm-brown-200 dark:border-warm-brown-850 shadow-lg bg-white dark:bg-warm-brown-900 transition-all duration-300">
      
      {/* Top Bar Status / Info */}
      <div className="bg-warm-brown-900 text-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-warm-brown-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-warm-brown-750 flex items-center justify-center text-warm-brown-200 border border-warm-brown-700">
            <MapPin size={18} className="text-warm-brown-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-warm-brown-300">
              Peta Lokasi Usaha (Google Maps)
            </h3>
            <p className="text-sm font-extrabold text-white truncate max-w-xs sm:max-w-sm">
              {selectedUmkm ? selectedUmkm.nama_usaha : 'Peta Wilayah Kec. Tawang'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedUmkm && (
            <button
              onClick={onReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-warm-brown-800 hover:bg-warm-brown-700 px-3 py-1.5 text-xs font-bold text-warm-brown-200 border border-warm-brown-700 transition-all shadow-sm"
              title="Reset Peta ke Tawang"
            >
              <RefreshCw size={13} />
              Reset Fokus
            </button>
          )}

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-warm-brown-700 hover:bg-warm-brown-600 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-md"
          >
            <span>Buka Google Maps</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Embedded Google Maps Frame */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-[420px] bg-warm-brown-100 dark:bg-warm-brown-950">
        <iframe
          title="Google Maps Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
          className="w-full h-full filter saturate-[1.05]"
        ></iframe>

        {/* Floating Instruction Overlay when no store is selected */}
        {!selectedUmkm && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md border border-warm-brown-200 p-3 rounded-2xl shadow-lg dark:bg-warm-brown-900/95 dark:border-warm-brown-800 text-xs text-warm-brown-800 dark:text-warm-brown-200 flex items-center gap-2">
            <Navigation size={16} className="text-warm-brown-600 dark:text-warm-brown-400 shrink-0" />
            <span className="font-semibold">Ketuk baris usaha pada tabel di sebelah kanan untuk meninjau petanya di Google Maps!</span>
          </div>
        )}
      </div>

      {/* Bottom Selected Store Card Details */}
      {selectedUmkm && (
        <div className="p-4 bg-warm-brown-50 border-t border-warm-brown-200 dark:bg-warm-brown-950 dark:border-warm-brown-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-warm-brown-900 dark:text-warm-brown-100 text-sm">
                {selectedUmkm.nama_usaha}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-warm-brown-200 text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200 font-extrabold text-[10px] uppercase">
                {selectedUmkm.kategori || 'Usaha'}
              </span>
            </div>
            {selectedUmkm.produk && (
              <p className="text-warm-brown-650 dark:text-warm-brown-350 font-medium">
                Produk: {selectedUmkm.produk}
              </p>
            )}
            {selectedUmkm.alamat && (
              <p className="text-warm-brown-500 dark:text-warm-brown-450 text-[11px]">
                {selectedUmkm.alamat}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
