import React from 'react';
import { getAllUmkm } from '@/app/utils/db';
import AdminClient from '@/components/AdminClient';

export const metadata = {
  title: 'Kelola Data UMKM - BAKUL KAHURIPAN',
  description: 'Panel administrator untuk mengelola database UMKM, mendaftarkan usaha baru, memperbarui berkas legalitas NIB, pelatihan, desil, dan menghapus data usaha.',
};

export default async function AdminPage() {
  const allUmkm = await getAllUmkm();

  return (
    <div className="flex-1 bg-warm-brown-50 py-10 dark:bg-warm-brown-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 mb-8 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Sistem Database Administrasi Kelurahan
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Kelola Data Direktori UMKM
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Halaman administrasi internal Kelurahan Kahuripan. Anda dapat melakukan pengelolaan penuh (Create, Read, Update, Delete) data direktori pelaku usaha lokal di bawah ini.
          </p>
        </div>

        {/* Interactive Admin Client Workspace */}
        <AdminClient initialUmkmList={allUmkm} />

      </div>
    </div>
  );
}
