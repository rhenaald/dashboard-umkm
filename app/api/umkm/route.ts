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
      kecamatan, tahun_laporan, latitude, longitude 
    } = body;

    // Validate required fields
    if (!nama || !nama_usaha || !produk || !kategori || rt === undefined || rw === undefined || !status_nib || !status_pelatihan || desil === undefined || !status_validasi || !kecamatan || !tahun_laporan || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const created = await createUmkm({
      nama,
      nama_usaha,
      produk,
      kategori,
      alamat: alamat || '',
      rt: Number(rt),
      rw: Number(rw),
      status_nib,
      status_pelatihan,
      desil: Number(desil),
      status_validasi,
      kecamatan,
      tahun_laporan: Number(tahun_laporan),
      latitude: Number(latitude),
      longitude: Number(longitude)
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
