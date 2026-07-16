'use client';

import React, { useState, useEffect } from 'react';
import { Umkm } from '@/app/utils/mockData';
import {
  Plus, Edit, Trash2, Search, Filter,
  X, Check, AlertTriangle, ShieldCheck,
  GraduationCap, Sliders, ChevronLeft, ChevronRight
} from 'lucide-react';

interface AdminClientProps {
  initialUmkmList: Umkm[];
}

export default function AdminClient({ initialUmkmList }: AdminClientProps) {
  const [umkmList, setUmkmList] = useState<Umkm[]>(initialUmkmList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Form State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [nama, setNama] = useState('');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [produk, setProduk] = useState('');
  const [kategori, setKategori] = useState('Kuliner');
  const [alamat, setAlamat] = useState('');
  const [rt, setRt] = useState(1);
  const [rw, setRw] = useState(1);
  const [statusNib, setStatusNib] = useState<'Sudah NIB' | 'Belum NIB'>('Belum NIB');
  const [statusPelatihan, setStatusPelatihan] = useState<'Pernah' | 'Belum'>('Belum');
  const [desil, setDesil] = useState(1);
  const [statusValidasi, setStatusValidasi] = useState<'Cek Lapangan' | 'Perlu Cek'>('Perlu Cek');
  const [kecamatan, setKecamatan] = useState('Tawang');
  const [tahunLaporan, setTahunLaporan] = useState(new Date().getFullYear());
  const [latitude, setLatitude] = useState(-7.335);
  const [longitude, setLongitude] = useState(108.222);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUmkmList(initialUmkmList);
  }, [initialUmkmList]);

  // Unique categories list
  const categories = ['Kuliner', 'Fesyen', 'Kerajinan', 'Jasa', 'Pertanian'];

  // Filter list
  const filteredList = umkmList.filter(item => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_usaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Open modal for Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setNama('');
    setNamaUsaha('');
    setProduk('');
    setKategori('Kuliner');
    setAlamat('');
    setRt(1);
    setRw(1);
    setStatusNib('Belum NIB');
    setStatusPelatihan('Belum');
    setDesil(1);
    setStatusValidasi('Perlu Cek');
    setKecamatan('Tawang');
    setTahunLaporan(new Date().getFullYear());
    setLatitude(-7.335);
    setLongitude(108.222);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (umkm: Umkm) => {
    setModalMode('edit');
    setEditingId(umkm.id);
    setNama(umkm.nama);
    setNamaUsaha(umkm.nama_usaha);
    setProduk(umkm.produk);
    setKategori(umkm.kategori);
    setAlamat(umkm.alamat || '');
    setRt(umkm.rt);
    setRw(umkm.rw);
    setStatusNib(umkm.status_nib);
    setStatusPelatihan(umkm.status_pelatihan);
    setDesil(umkm.desil);
    setStatusValidasi(umkm.status_validasi);
    setKecamatan(umkm.kecamatan);
    setTahunLaporan(umkm.tahun_laporan);
    setLatitude(umkm.latitude);
    setLongitude(umkm.longitude);
    setIsModalOpen(true);
  };

  // Handle Create or Update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      nama,
      nama_usaha: namaUsaha,
      produk,
      kategori,
      alamat,
      rt: Number(rt),
      rw: Number(rw),
      status_nib: statusNib,
      status_pelatihan: statusPelatihan,
      desil: Number(desil),
      status_validasi: statusValidasi,
      kecamatan,
      tahun_laporan: Number(tahunLaporan),
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/umkm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setUmkmList(prev => [...prev, created]);
          setIsModalOpen(false);
          alert('UMKM baru berhasil didaftarkan!');
        } else {
          const err = await res.json();
          alert(`Gagal menambah UMKM: ${err.error}`);
        }
      } else {
        const res = await fetch('/api/umkm', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload })
        });
        if (res.ok) {
          const updated = await res.json();
          setUmkmList(prev => prev.map(item => item.id === editingId ? updated : item));
          setIsModalOpen(false);
          alert('Data UMKM berhasil diperbarui!');
        } else {
          const err = await res.json();
          alert(`Gagal memperbarui UMKM: ${err.error}`);
        }
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data usaha "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/umkm?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUmkmList(prev => prev.filter(item => item.id !== id));
        alert('Data UMKM berhasil dihapus.');
      } else {
        alert('Gagal menghapus data UMKM.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-warm-brown-200 rounded-3xl p-5 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
        <div className="flex flex-wrap items-center gap-4 flex-1 max-w-2xl">

          {/* Text search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-warm-brown-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama pemilik, usaha, produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-warm-brown-200 bg-white py-1.5 pl-9 pr-4 text-xs font-medium text-warm-brown-900 focus:border-warm-brown-650 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-warm-brown-600 dark:text-warm-brown-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-warm-brown-200 bg-white px-3 py-1.5 text-xs font-bold text-warm-brown-800 focus:border-warm-brown-650 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Add Record Trigger */}
        <button
          onClick={handleOpenCreate}
          className="rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 px-4 py-2 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors self-end md:self-center"
        >
          <Plus size={16} />
          Tambah UMKM
        </button>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto border border-warm-brown-200/80 rounded-2xl shadow-inner bg-white dark:border-warm-brown-850 dark:bg-warm-brown-900/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-warm-brown-100 border-b border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 text-warm-brown-850 dark:text-warm-brown-150 uppercase tracking-wider font-extrabold">
              <th className="px-4 py-3 text-center">ID</th>
              <th className="px-4 py-3">Nama Usaha / Produk</th>
              <th className="px-4 py-3">Pemilik</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">RT/RW</th>
              <th className="px-4 py-3">Desil</th>
              <th className="px-4 py-3">NIB</th>
              <th className="px-4 py-3">Pelatihan</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-brown-100 dark:divide-warm-brown-850/60 font-medium">
            {paginatedList.length > 0 ? (
              paginatedList.map((umkm) => (
                <tr
                  key={umkm.id}
                  className="hover:bg-warm-brown-50/50 text-warm-brown-750 dark:text-warm-brown-300 dark:hover:bg-warm-brown-950/20"
                >
                  <td className="px-4 py-3 text-center font-bold">{umkm.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-sm text-warm-brown-900 dark:text-warm-brown-100">{umkm.nama_usaha}</div>
                    <div className="text-[10px] text-warm-brown-500 mt-0.5">{umkm.produk}</div>
                  </td>
                  <td className="px-4 py-3 font-bold">{umkm.nama}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-warm-brown-100 px-2 py-0.5 text-[10px] font-bold text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200">
                      {umkm.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">RT {umkm.rt} / RW {umkm.rw}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded h-5 w-5 items-center justify-center text-[10px] font-black ${umkm.desil <= 4
                        ? 'bg-red-100 text-red-800'
                        : umkm.desil <= 7
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                      {umkm.desil}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${umkm.status_nib === 'Sudah NIB' ? 'bg-green-100 text-green-800' : 'bg-warm-brown-100 text-warm-brown-800'
                      }`}>
                      {umkm.status_nib}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${umkm.status_pelatihan === 'Pernah' ? 'bg-warm-brown-100 text-warm-brown-800' : 'bg-warm-brown-100 text-warm-brown-850'
                      }`}>
                      {umkm.status_pelatihan} Pelatihan
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(umkm)}
                        className="rounded-lg p-1.5 border border-warm-brown-200 hover:bg-warm-brown-100 text-warm-brown-700 dark:border-warm-brown-800 dark:hover:bg-warm-brown-850"
                        title="Edit Data"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(umkm.id, umkm.nama_usaha)}
                        className="rounded-lg p-1.5 border border-red-200 hover:bg-red-50 text-red-650 dark:border-red-950 dark:hover:bg-red-950/20"
                        title="Hapus Usaha"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-warm-brown-500 font-bold">
                  Data UMKM Tidak Ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination control */}
      <div className="flex items-center justify-between border-t border-warm-brown-200 pt-4 dark:border-warm-brown-850">
        <div className="text-xs text-warm-brown-600 dark:text-warm-brown-400 font-semibold">
          Halaman <span className="font-extrabold text-warm-brown-900 dark:text-warm-brown-200">{currentPage}</span> dari <span className="font-extrabold text-warm-brown-900 dark:text-warm-brown-200">{totalPages}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 hover:bg-warm-brown-50 disabled:opacity-40 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-warm-brown-200 bg-white text-warm-brown-700 hover:bg-warm-brown-50 disabled:opacity-40 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Create / Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-warm-brown-200 max-w-2xl w-full shadow-2xl overflow-hidden dark:bg-warm-brown-900 dark:border-warm-brown-850 animate-fadeIn">

            {/* Modal Header */}
            <div className="bg-warm-brown-100 p-5 text-warm-brown-900 border-b border-warm-brown-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm tracking-wide uppercase flex items-center gap-1.5 text-warm-brown-800">
                <Sliders size={16} />
                {modalMode === 'create' ? 'Daftarkan UMKM Baru' : 'Perbarui Data UMKM'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-warm-brown-500 hover:text-warm-brown-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama lengkap pemilik usaha"
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Nama Usaha</label>
                  <input
                    type="text"
                    required
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    placeholder="Nama brand/toko"
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Produk Utama</label>
                  <input
                    type="text"
                    required
                    value={produk}
                    onChange={(e) => setProduk(e.target.value)}
                    placeholder="Jenis produk yang dijual"
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Kategori Usaha</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-250 font-bold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Alamat Usaha</label>
                <input
                  type="text"
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Nama jalan, nomor rumah"
                  className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">RT</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={rt}
                    onChange={(e) => setRt(Number(e.target.value))}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">RW</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={rw}
                    onChange={(e) => setRw(Number(e.target.value))}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={kecamatan}
                    onChange={(e) => setKecamatan(e.target.value)}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Tahun Laporan</label>
                  <input
                    type="number"
                    required
                    min={2000}
                    value={tahunLaporan}
                    onChange={(e) => setTahunLaporan(Number(e.target.value))}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Desil</label>
                  <select
                    value={desil}
                    onChange={(e) => setDesil(Number(e.target.value))}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-250 font-bold"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Desil {num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Legalitas NIB</label>
                  <select
                    value={statusNib}
                    onChange={(e) => setStatusNib(e.target.value as any)}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-250 font-bold"
                  >
                    <option value="Belum NIB">Belum NIB</option>
                    <option value="Sudah NIB">Sudah NIB</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Pelatihan</label>
                  <select
                    value={statusPelatihan}
                    onChange={(e) => setStatusPelatihan(e.target.value as any)}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-250 font-bold"
                  >
                    <option value="Belum">Belum Pelatihan</option>
                    <option value="Pernah">Pernah Pelatihan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Validasi Lapangan</label>
                  <select
                    value={statusValidasi}
                    onChange={(e) => setStatusValidasi(e.target.value as any)}
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-250 font-bold"
                  >
                    <option value="Perlu Cek">Perlu Cek</option>
                    <option value="Cek Lapangan">Selesai Cek (Lapangan)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Garis Lintang (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    placeholder="e.g., -7.3345"
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warm-brown-650 mb-1 dark:text-warm-brown-400 uppercase tracking-wide">Garis Bujur (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    placeholder="e.g., 108.2215"
                    className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200"
                  />
                </div>
              </div>

              {/* Modal Footer / Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-warm-brown-100 dark:border-warm-brown-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-warm-brown-300 px-5 py-2 hover:bg-warm-brown-50 text-warm-brown-700 dark:border-warm-brown-800 dark:text-warm-brown-350 dark:hover:bg-warm-brown-850"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 text-white px-6 py-2 shadow-sm font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
