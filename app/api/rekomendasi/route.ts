import { NextRequest, NextResponse } from 'next/server';
import { getAllUmkm } from '@/app/utils/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const kategori = searchParams.get('kategori') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 10);

  if (!q && !kategori) {
    return NextResponse.json({ error: 'Parameter q atau kategori wajib diisi' }, { status: 400 });
  }

  try {
    let list = await getAllUmkm();

    if (kategori) {
      list = list.filter(item =>
        item.kategori.toLowerCase().includes(kategori.toLowerCase())
      );
    }

    if (q) {
      list = list.filter(item =>
        item.nama?.toLowerCase().includes(q) ||
        item.nama_usaha.toLowerCase().includes(q) ||
        item.produk?.toLowerCase().includes(q) ||
        item.alamat?.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q)
      );
    }

    const results = list.slice(0, limit).map(item => ({
      id: item.id,
      nama: item.nama,
      nama_usaha: item.nama_usaha,
      produk: item.produk,
      kategori: item.kategori,
      alamat: item.alamat,
      kecamatan: item.kecamatan,
      url: item.url || null,
    }));

    return NextResponse.json({ count: results.length, data: results });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data UMKM' }, { status: 500 });
  }
}
