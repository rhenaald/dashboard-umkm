'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Umkm } from '@/app/utils/mockData';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, UserCheck,
  Filter, Calendar, MapPin, RefreshCw
} from 'lucide-react';

interface MonitoringClientProps {
  initialUmkmList: Umkm[];
}

export default function MonitoringClient({ initialUmkmList }: MonitoringClientProps) {
  // Local state for interactive updates
  const [umkmList, setUmkmList] = useState<Umkm[]>(initialUmkmList);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial list when database or server-render changes
  useEffect(() => {
    setUmkmList(initialUmkmList);
  }, [initialUmkmList]);

  // Extract unique kecamatan and years for dropdown filters
  const kecamatans = Array.from(new Set(initialUmkmList.map(item => item.kecamatan)));
  const years = Array.from(new Set(initialUmkmList.map(item => item.tahun_laporan))).sort();

  // Apply filters
  const filteredList = umkmList.filter(item => {
    const matchesKecamatan = !selectedKecamatan ||
      item.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase();
    const matchesYear = !selectedYear ||
      item.tahun_laporan === parseInt(selectedYear);
    return matchesKecamatan && matchesYear;
  });

  // Calculate Welfare Stats
  const desil1to4Count = filteredList.filter(item => item.desil >= 1 && item.desil <= 4).length;
  const desil1to5Count = filteredList.filter(item => item.desil >= 1 && item.desil <= 5).length;
  const desil6to10Count = filteredList.filter(item => item.desil >= 6 && item.desil <= 10).length;
  const pendingValidationCount = filteredList.filter(item => item.status_validasi === 'Perlu Cek').length;

  // Build Desil 1-10 Chart Data
  const desilDistribution = Array.from({ length: 10 }, (_, i) => {
    const desilNumber = i + 1;
    const count = filteredList.filter(item => item.desil === desilNumber).length;
    return {
      name: `Desil ${desilNumber}`,
      value: count,
      desil: desilNumber
    };
  });

  // Handle Validasi Status Update (Real-time dynamic call)
  const handleToggleValidasi = async (id: number, currentStatus: 'Cek Lapangan' | 'Perlu Cek') => {
    const newStatus = currentStatus === 'Perlu Cek' ? 'Cek Lapangan' : 'Perlu Cek';
    setUpdatingId(id);

    try {
      const response = await fetch('/api/umkm', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          type: 'validasi',
          status: newStatus
        })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        // Update local state instantly
        setUmkmList(prev => prev.map(item => item.id === id ? { ...item, status_validasi: updatedItem.status_validasi } : item));
      } else {
        alert('Gagal memperbarui status validasi.');
      }
    } catch (e) {
      console.error('Error updating status:', e);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Recharts color mapper: merah (desil 1-4), jingga (desil 5-7), hijau (desil 8-10)
  const getBarColor = (desil: number) => {
    if (desil <= 4) return '#ef4444'; // Red
    if (desil <= 7) return '#f97316'; // Orange/Jingga
    return '#22c55e'; // Green
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let desilStatus = 'Mandiri (Kesejahteraan Tinggi)';
      let statusColor = 'text-green-600 dark:text-green-400';
      if (data.desil <= 4) {
        desilStatus = 'Prioritas Bantuan (Kesejahteraan Rendah)';
        statusColor = 'text-red-650 dark:text-red-400';
      } else if (data.desil <= 7) {
        desilStatus = 'Menengah Bawah (Kesejahteraan Sedang)';
        statusColor = 'text-orange-600 dark:text-orange-400';
      }

      return (
        <div className="bg-white border border-warm-brown-200 rounded-xl p-3 shadow-md dark:bg-warm-brown-900 dark:border-warm-brown-850">
          <p className="text-sm font-extrabold text-warm-brown-900 dark:text-warm-brown-100">{data.name}</p>
          <p className={`text-[10px] font-bold ${statusColor} mt-0.5`}>{desilStatus}</p>
          <p className="text-xs font-bold text-warm-brown-750 dark:text-warm-brown-300 mt-1.5 border-t pt-1.5 dark:border-warm-brown-800">
            Jumlah: <span className="font-black text-warm-brown-700 dark:text-warm-brown-400">{data.value} UMKM</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">

      {/* Filtering Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-warm-brown-200 rounded-3xl p-5 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
        <div className="flex flex-wrap items-center gap-4">

          {/* Kecamatan filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-warm-brown-600 dark:text-warm-brown-400" />
            <span className="text-xs font-bold text-warm-brown-650 dark:text-warm-brown-400 uppercase tracking-wider">Kecamatan:</span>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250"
            >
              <option value="">Semua Kecamatan ({kecamatans.length})</option>
              {kecamatans.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>

          {/* Year filter */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-warm-brown-600 dark:text-warm-brown-400" />
            <span className="text-xs font-bold text-warm-brown-650 dark:text-warm-brown-400 uppercase tracking-wider">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250"
            >
              <option value="">Semua Laporan ({years.length})</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

        </div>

        <button
          onClick={() => { setSelectedKecamatan(''); setSelectedYear(''); }}
          className="text-xs font-bold text-warm-brown-700 dark:text-warm-brown-400 hover:underline self-end md:self-center"
        >
          Reset Filter Laporan
        </button>
      </div>

      {/* Welfare Status Grid Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Card 1: Desil 1-4 */}
        <div className="rounded-3xl bg-red-50/50 border border-red-200 p-6 dark:bg-red-950/10 dark:border-red-900/40 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-red-100 text-red-650 dark:bg-red-950/40 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-wide">Desil 1–4 (Rendah)</p>
            <p className="text-3xl font-black mt-1 text-red-700 dark:text-red-400 leading-none">{desil1to4Count}</p>
            <p className="text-[10px] mt-2 text-red-600 dark:text-red-450 leading-relaxed font-semibold">Prioritas utama penyaluran dana bantuan sosial kelurahan.</p>
          </div>
        </div>

        {/* Card 2: Desil 1-5 */}
        <div className="rounded-3xl bg-orange-50/50 border border-orange-200 p-6 dark:bg-orange-950/10 dark:border-orange-900/40 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-orange-100 text-orange-650 dark:bg-orange-950/40 dark:text-orange-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-650 dark:text-orange-400 uppercase tracking-wide">Desil 1–5 (Menengah Bawah)</p>
            <p className="text-3xl font-black mt-1 text-orange-700 dark:text-orange-450 leading-none">{desil1to5Count}</p>
            <p className="text-[10px] mt-2 text-orange-600 dark:text-orange-450 leading-relaxed font-semibold">Kelompok rentan miskin, butuh program pelatihan mandiri.</p>
          </div>
        </div>

        {/* Card 3: Desil 6-10 */}
        <div className="rounded-3xl bg-green-50/50 border border-green-200 p-6 dark:bg-green-950/10 dark:border-green-900/40 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Desil 6–10 (Mandiri)</p>
            <p className="text-3xl font-black mt-1 text-green-700 dark:text-green-450 leading-none">{desil6to10Count}</p>
            <p className="text-[10px] mt-2 text-green-600 dark:text-green-450 leading-relaxed font-semibold">Tingkat kesejahteraan tinggi. Fokus pengembangan pasar ekspor.</p>
          </div>
        </div>

        {/* Card 4: Pending Validation */}
        <div className="rounded-3xl bg-warm-brown-100 border border-warm-brown-200 p-6 dark:bg-warm-brown-900 dark:border-warm-brown-850 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-warm-brown-250 text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-300">
            <RefreshCw size={24} className={pendingValidationCount > 0 ? "animate-spin-slow" : ""} />
          </div>
          <div>
            <p className="text-xs font-bold text-warm-brown-750 dark:text-warm-brown-350 uppercase tracking-wide">Perlu Cek Lapangan</p>
            <p className="text-3xl font-black mt-1 text-warm-brown-900 dark:text-warm-brown-150 leading-none">{pendingValidationCount}</p>
            <p className="text-[10px] mt-2 text-warm-brown-600 dark:text-warm-brown-400 leading-relaxed font-semibold">Data validasi kesejahteraan lapangan yang belum diverifikasi.</p>
          </div>
        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">

        {/* Desil Distribution Recharts Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
          <div>
            <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
              Grafik Distribusi Desil Usaha (1–10)
            </h3>
            <p className="text-xs text-warm-brown-650 dark:text-warm-brown-400 mt-1">
              Distribusi visual desil kesejahteraan keluarga UMKM dengan pengodean warna standar.
            </p>
          </div>

          <div className="h-80 mt-6 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={desilDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(238, 222, 200, 0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                    {desilDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.desil)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-warm-brown-500">
                Loading Chart...
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-center items-center gap-6 border-t border-warm-brown-100 pt-4 text-[10px] font-bold text-warm-brown-600 dark:border-warm-brown-800 dark:text-warm-brown-400">
            <div className="flex items-center gap-1.5">
              <span className="block h-3 w-3 rounded bg-red-500"></span>
              <span>Desil 1-4 (Rendah)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-3 w-3 rounded bg-orange-500"></span>
              <span>Desil 5-7 (Sedang)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-3 w-3 rounded bg-green-500"></span>
              <span>Desil 8-10 (Tinggi)</span>
            </div>
          </div>
        </div>

        {/* Validation Table Column (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
          <div>
            <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
              Tabel Validasi Lapangan Kesejahteraan
            </h3>
            <p className="text-xs text-warm-brown-650 dark:text-warm-brown-400 mt-1">
              Verifikasi status kesejahteraan desil UMKM terdata melalui pengecekan lapangan langsung.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto border border-warm-brown-100 rounded-2xl max-h-[350px] overflow-y-auto dark:border-warm-brown-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-brown-50 border-b border-warm-brown-100 text-warm-brown-800 uppercase tracking-wider font-extrabold dark:bg-warm-brown-950/40 dark:border-warm-brown-850 dark:text-warm-brown-300">
                  <th className="px-4 py-2.5">Nama Usaha / Pemilik</th>
                  <th className="px-4 py-2.5 text-center">Desil</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-brown-100 dark:divide-warm-brown-850/60 font-medium">
                {filteredList.length > 0 ? (
                  filteredList.map((umkm) => (
                    <tr
                      key={umkm.id}
                      className="hover:bg-warm-brown-50/50 text-warm-brown-750 dark:text-warm-brown-300 dark:hover:bg-warm-brown-950/20"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold">{umkm.nama_usaha}</div>
                        <div className="text-[10px] text-warm-brown-500 mt-0.5">{umkm.nama} ({umkm.alamat})</div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        <span className={`inline-flex rounded h-6 w-6 items-center justify-center font-black ${umkm.desil <= 4
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                            : umkm.desil <= 7
                              ? 'bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-350'
                              : 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                          }`}>
                          {umkm.desil}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${umkm.status_validasi === 'Cek Lapangan'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300'
                          }`}>
                          {umkm.status_validasi}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleValidasi(umkm.id, umkm.status_validasi)}
                          disabled={updatingId === umkm.id}
                          className={`rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold border shadow-sm transition-colors ${umkm.status_validasi === 'Cek Lapangan'
                              ? 'bg-white border-warm-brown-300 text-warm-brown-800 hover:bg-warm-brown-100 dark:bg-warm-brown-900 dark:border-warm-brown-800 dark:text-warm-brown-200 dark:hover:bg-warm-brown-850'
                              : 'bg-warm-brown-700 border-warm-brown-800 text-white hover:bg-warm-brown-800 dark:bg-warm-brown-800 dark:border-warm-brown-900 dark:hover:bg-warm-brown-750'
                            }`}
                        >
                          {updatingId === umkm.id ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mx-auto"></div>
                          ) : umkm.status_validasi === 'Cek Lapangan' ? (
                            'Set Perlu Cek'
                          ) : (
                            'Set Cek Lapangan'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-warm-brown-500 font-bold">
                      Tidak ada data UMKM yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
