import { NextRequest, NextResponse } from 'next/server';
import { getAllUmkm, createUmkm, deleteUmkm, updateUmkm } from '@/app/utils/db';

// Read all (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const kategori = searchParams.get('kategori') || '';
  const kecamatan = searchParams.get('kecamatan') || '';
  const tahun = searchParams.get('tahun') || '';

  let list = await getAllUmkm();

  if (q) {
    list = list.filter(item => 
      item.nama.toLowerCase().includes(q) ||
      item.nama_usaha.toLowerCase().includes(q) ||
      item.produk.toLowerCase().includes(q) ||
      item.alamat.toLowerCase().includes(q)
    );
  }

  if (kategori) {
    list = list.filter(item => item.kategori.toLowerCase() === kategori.toLowerCase());
  }

  if (kecamatan) {
    list = list.filter(item => item.kecamatan.toLowerCase() === kecamatan.toLowerCase());
  }

  if (tahun) {
    const parsedTahun = parseInt(tahun);
    if (!isNaN(parsedTahun)) {
      list = list.filter(item => item.tahun_laporan === parsedTahun);
    }
  }

  return NextResponse.json(list);
}

// Create new (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nama, nama_usaha, produk, kategori, alamat, rt, rw, 
      status_nib, status_pelatihan, desil, status_validasi, 
      kecamatan, tahun_laporan, latitude, longitude, url
    } = body;

    // Only nama_usaha is strictly required
    if (!nama_usaha) {
      return NextResponse.json({ error: 'Nama usaha wajib diisi' }, { status: 400 });
    }

    const created = await createUmkm({
      nama: nama || '',
      nama_usaha,
      produk: produk || '',
      kategori: kategori || 'Perdagangan',
      alamat: alamat || '',
      rt: rt !== undefined && rt !== null ? Number(rt) : 0,
      rw: rw !== undefined && rw !== null ? Number(rw) : 0,
      status_nib: status_nib || '',
      status_pelatihan: status_pelatihan || '',
      desil: desil !== undefined && desil !== null ? Number(desil) : 0,
      status_validasi: status_validasi || '',
      kecamatan: kecamatan || 'Tawang',
      tahun_laporan: tahun_laporan !== undefined && tahun_laporan !== null ? Number(tahun_laporan) : 2026,
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : -7.335,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : 108.222,
      url: url || ''
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// Update existing (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, status, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    let updated = null;
    if (type === 'validasi') {
      if (status !== 'Cek Lapangan' && status !== 'Perlu Cek') {
        return NextResponse.json({ error: 'Invalid validation status' }, { status: 400 });
      }
      updated = await updateUmkm(Number(id), { status_validasi: status });
    } else if (type === 'nib') {
      if (status !== 'Sudah NIB' && status !== 'Belum NIB') {
        return NextResponse.json({ error: 'Invalid NIB status' }, { status: 400 });
      }
      updated = await updateUmkm(Number(id), { status_nib: status });
    } else {
      // General updates
      updated = await updateUmkm(Number(id), fields);
    }

    if (!updated) {
      return NextResponse.json({ error: 'UMKM not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Delete existing (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const success = await deleteUmkm(Number(id));
    if (!success) {
      return NextResponse.json({ error: 'UMKM not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
