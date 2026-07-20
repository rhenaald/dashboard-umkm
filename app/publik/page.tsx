'use client';

import React, { useState } from 'react';
import { Building2, ShieldCheck, HeartHandshake, Search, Landmark, ExternalLink } from 'lucide-react';

const KBLI_DATA = [
  { code: '56101', name: 'Restoran / Rumah Makan', desc: 'Penyediaan jasa makanan bagi konsumen dengan penyajian langsung, seperti warung nasi, kedai bakso, rumah makan sunda.' },
  { code: '13921', name: 'Industri Barang Jadi Tekstil (Bordir)', desc: 'Pembuatan produk bordir, sulaman kebaya, mukena bordir khas Tasikmalaya.' },
  { code: '16292', name: 'Industri Kelom Geulis & Kerajinan Kayu', desc: 'Pembuatan alas kaki kayu tradisional kelom geulis, ukiran kayu, kerajinan berbahan dasar bambu/kayu.' },
  { code: '47711', name: 'Perdagangan Eceran Pakaian', desc: 'Penjualan eceran pakaian jadi, jilbab, hijab anak/dewasa, busana muslim.' },
  { code: '56303', name: 'Kedai Minuman / Kopi', desc: 'Penyediaan jasa minuman kopi, jus, susu, teh dengan atau tanpa makanan ringan.' },
  { code: '10710', name: 'Industri Produk Roti & Kue', desc: 'Pembuatan roti manis, kue kering, nastar, kastengel, rengginang, keripik tempe, makanan ringan.' },
  { code: '96020', name: 'Aktivitas Salon Kecantikan & Rias', desc: 'Jasa pemotongan rambut, rias pengantin, perawatan wajah, persewaan baju pengantin.' },
  { code: '95290', name: 'Reparasi Barang Keperluan Pribadi', desc: 'Jasa reparasi sepatu, sol sepatu, reparasi tas rajut, perawatan barang kulit.' },
  { code: '01461', name: 'Budidaya Jamur / Pertanian Mikro', desc: 'Budidaya jamur tiram, sayuran hidroponik, peternakan lele skala rumah tangga.' },
  { code: '25920', name: 'Jasa Las & Pengerjaan Logam', desc: 'Pengelasan pagar besi, pembuatan kanopi, teralis jendela, pengerjaan plat seng.' }
];

export default function LayananPublikPage() {
  // KBLI State
  const [kbliQuery, setKbliQuery] = useState('');

  // Filter KBLI guide
  const filteredKbli = KBLI_DATA.filter(item =>
    item.code.includes(kbliQuery) ||
    item.name.toLowerCase().includes(kbliQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(kbliQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white py-10 transition-colors duration-300 dark:bg-warm-brown-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 mb-10 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Pelayanan Administrasi Digital
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Portal Layanan Publik &amp; Asistensi
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Akses perizinan mandiri, pencarian klasifikasi usaha KBLI, serta konsultasi perizinan instan dengan Asisten Virtual BAKUL.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">

          {/* OSS Card */}
          <a
            href="https://oss.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4 flex-col justify-between"
          >
            <div className="flex items-start gap-4 w-full">
              <div className="p-3 rounded-2xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400 flex-shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                  Pendaftaran NIB (OSS RBA)
                </h3>
                <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                  Buat Nomor Induk Berusaha (NIB) secara gratis dan resmi melalui portal Lembaga OSS Kementerian Investasi.
                </p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-brown-700 group-hover:bg-warm-brown-800 text-white text-[11px] font-bold shadow-sm transition-all self-end dark:bg-warm-brown-800 dark:group-hover:bg-warm-brown-700">
              Kunjungi OSS <ExternalLink size={12} />
            </div>
          </a>

          {/* Halal Card */}
          <a
            href="https://ptsp.halal.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4 flex-col justify-between"
          >
            <div className="flex items-start gap-4 w-full">
              <div className="p-3 rounded-2xl bg-green-50 text-green-700 group-hover:bg-green-100 transition-colors dark:bg-green-950/20 dark:text-green-400 flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                  Sertifikasi Halal (SIHALAL)
                </h3>
                <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                  Ajukan sertifikasi produk halal secara online (SEHATI) terintegrasi dengan BPJPH Kementerian Agama RI.
                </p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-700 group-hover:bg-green-800 text-white text-[11px] font-bold shadow-sm transition-all self-end dark:bg-green-800/80 dark:group-hover:bg-green-700">
              Ajukan Halal <ExternalLink size={12} />
            </div>
          </a>

          {/* Help Card */}
          <a
            href="http://www.laporinaja.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4 flex-col justify-between"
          >
            <div className="flex items-start gap-4 w-full">
              <div className="p-3 rounded-2xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400 flex-shrink-0">
                <HeartHandshake size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                  Layanan Pengaduan UMKM
                </h3>
                <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                  Ajukan kendala teknis usaha, kesulitan permodalan, perizinan, atau sampaikan masukan secara online.
                </p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-warm-brown-700 group-hover:bg-warm-brown-800 text-white text-[11px] font-bold shadow-sm transition-all self-end dark:bg-warm-brown-800 dark:group-hover:bg-warm-brown-700">
              Laporkan Masalah <ExternalLink size={12} />
            </div>
          </a>

        </div>

        <div className="max-w-4xl mx-auto">
          {/* KBLI Guide Search Tool */}
          <div className="bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
            <div className="flex items-center gap-2 border-b border-warm-brown-100 pb-4 mb-5 dark:border-warm-brown-800">
              <Landmark size={20} className="text-warm-brown-700 dark:text-warm-brown-400" />
              <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
                Panduan KBLI Terpopuler
              </h3>
            </div>

            <p className="text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed mb-4">
              KBLI adalah klasifikasi standar kegiatan usaha. Pelaku usaha di Wilayah Tawang & Cihideung wajib mengisi kode KBLI yang cocok saat membuat NIB. Cari kode di bawah ini:
            </p>

            {/* Search input */}
            <div className="relative mb-5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4.5 w-4.5 text-warm-brown-450 dark:text-warm-brown-500" />
              </div>
              <input
                type="text"
                placeholder="Cari kata kunci (e.g., 'bordir', 'makanan', 'kayu')..."
                value={kbliQuery}
                onChange={(e) => setKbliQuery(e.target.value)}
                className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 pl-9 pr-4 text-xs font-medium text-warm-brown-900 focus:border-warm-brown-600 focus:bg-white focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors shadow-inner"
              />
            </div>

            {/* KBLI results list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {filteredKbli.length > 0 ? (
                filteredKbli.map((kbli) => (
                  <div
                    key={kbli.code}
                    className="border border-warm-brown-100 rounded-2xl p-4 bg-warm-brown-50/50 hover:bg-warm-brown-50 transition-colors dark:border-warm-brown-800 dark:bg-warm-brown-950/30 dark:hover:bg-warm-brown-900/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-warm-brown-700 dark:text-warm-brown-300 uppercase tracking-wide bg-warm-brown-100 dark:bg-warm-brown-950 px-2 py-0.5 rounded-md">
                        KBLI {kbli.code}
                      </span>
                      <span className="text-[10px] font-bold text-warm-brown-500 dark:text-warm-brown-400">Mikro &amp; Kecil</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-warm-brown-900 dark:text-warm-brown-150 mt-2">
                      {kbli.name}
                    </h4>
                    <p className="text-[11px] text-warm-brown-650 dark:text-warm-brown-400 mt-1 leading-normal font-medium">
                      {kbli.desc}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-warm-brown-500 dark:text-warm-brown-450 font-bold">
                  Tidak ada kode KBLI yang cocok.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
