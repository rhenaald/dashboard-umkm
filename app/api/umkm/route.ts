import { NextRequest, NextResponse } from 'next/server';
import { getAllUmkm, createUmkm, deleteUmkm, updateUmkm } from '@/app/utils/db';
import { verifySession } from '@/app/utils/auth';
import { z } from 'zod';

// Input Validation Schemas
const createUmkmSchema = z.object({
  nama: z.string().max(100).optional().default(''),
  nama_usaha: z.string().min(1, 'Nama usaha wajib diisi').max(255),
  produk: z.string().max(255).optional().default(''),
  kategori: z.string().max(100).optional().default('Perdagangan'),
  alamat: z.string().max(255).optional().default(''),
  rt: z.coerce.number().int().min(0).max(999).optional().default(0),
  rw: z.coerce.number().int().min(0).max(999).optional().default(0),
  status_nib: z.string().max(50).optional().default(''),
  status_pelatihan: z.string().max(50).optional().default(''),
  desil: z.coerce.number().int().min(0).max(10).optional().default(0),
  status_validasi: z.string().max(50).optional().default(''),
  kecamatan: z.string().max(100).optional().default('Tawang'),
  tahun_laporan: z.coerce.number().int().min(1900).max(2100).optional().default(2026),
  latitude: z.coerce.number().min(-90).max(90).optional().default(-7.335),
  longitude: z.coerce.number().min(-180).max(180).optional().default(108.222),
  url: z.string().max(500).optional().default(''),
});

const updateValidationSchema = z.object({
  id: z.coerce.number().int().positive('ID harus berupa angka bulat positif'),
  type: z.literal('validasi'),
  status: z.enum(['Cek Lapangan', 'Perlu Cek']),
});

const updateNibSchema = z.object({
  id: z.coerce.number().int().positive('ID harus berupa angka bulat positif'),
  type: z.literal('nib'),
  status: z.enum(['Sudah NIB', 'Belum NIB']),
});

const updateGeneralSchema = createUmkmSchema.partial().extend({
  id: z.coerce.number().int().positive('ID harus berupa angka bulat positif'),
});

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
  const session = request.cookies.get('admin_session')?.value;
  if (!session || !verifySession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = createUmkmSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Data tidak valid', details: result.error.flatten().fieldErrors }, { status: 400 });
    }

    const created = await createUmkm(result.data);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// Update existing (PUT)
export async function PUT(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  if (!session || !verifySession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    let updated = null;
    if (type === 'validasi') {
      const result = updateValidationSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: 'Data tidak valid', details: result.error.flatten().fieldErrors }, { status: 400 });
      }
      updated = await updateUmkm(result.data.id, { status_validasi: result.data.status });
    } else if (type === 'nib') {
      const result = updateNibSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: 'Data tidak valid', details: result.error.flatten().fieldErrors }, { status: 400 });
      }
      updated = await updateUmkm(result.data.id, { status_nib: result.data.status });
    } else {
      const result = updateGeneralSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: 'Data tidak valid', details: result.error.flatten().fieldErrors }, { status: 400 });
      }
      const { id: validatedId, ...fields } = result.data;
      updated = await updateUmkm(validatedId, fields);
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
  const session = request.cookies.get('admin_session')?.value;
  if (!session || !verifySession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const idResult = z.coerce.number().int().positive().safeParse(id);
    if (!idResult.success) {
      return NextResponse.json({ error: 'Missing or invalid id parameter' }, { status: 400 });
    }

    const success = await deleteUmkm(idResult.data);
    if (!success) {
      return NextResponse.json({ error: 'UMKM not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
