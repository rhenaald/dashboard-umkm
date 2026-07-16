import React from 'react';
import { getAllUmkm } from '@/app/utils/db';
import PemetaanClient from '@/components/PemetaanClient';

export const metadata = {
  title: 'Pemetaan Interaktif UMKM - BAKUL KAHURIPAN',
  description: 'Peta sebaran lokasi usaha mikro di Kelurahan Kahuripan, Kecamatan Tawang, lengkap dengan koordinat spasial dan visualisasi detail.',
};

export default async function PetaPage() {
  const allUmkm = await getAllUmkm();

  return (
    <div className="flex-1 bg-white py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 mb-8 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Sistem Informasi Geografis (SIG)
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Pemetaan Usaha Mikro Terintegrasi
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Pemetaan spasial sebaran lokasi UMKM di wilayah administratif Kelurahan Kahuripan. Gunakan filter kategori dan ketuk baris tabel untuk menyorot koordinat usaha pada peta.
          </p>
        </div>

        {/* Interactive Mapping Client Workspace */}
        <PemetaanClient initialUmkmList={allUmkm} />

      </div>
    </div>
  );
}
