import React from 'react';
import { getAllUmkm } from '@/app/utils/db';
import MonitoringClient from '@/components/MonitoringClient';

export const metadata = {
  title: 'Monitoring Kesejahteraan & Desil UMKM - BAKUL KAHURIPAN',
  description: 'Sistem monitoring kesejahteraan desil pelaku usaha di Kelurahan Kahuripan, dilengkapi filter laporan, diagram sebaran desil, dan form validasi.',
};

export default async function MonitoringPage() {
  const allUmkm = await getAllUmkm();

  return (
    <div className="flex-1 bg-warm-brown-50 py-10 dark:bg-warm-brown-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 mb-8 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Kesejahteraan &amp; Bantuan Sosial
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Monitoring Desil Pelaku Usaha
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Pemantauan tingkat kesejahteraan ekonomi keluarga pelaku usaha mikro berdasarkan pengelompokan desil (Desil 1–10). Verifikasi data secara langsung melalui status Cek Lapangan di bawah ini.
          </p>
        </div>

        {/* Monitoring Client Workspace */}
        <MonitoringClient initialUmkmList={allUmkm} />

      </div>
    </div>
  );
}
