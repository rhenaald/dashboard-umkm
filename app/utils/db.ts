import { PrismaClient } from '@prisma/client';
import { mockUmkmList, Umkm } from './mockData';

let prisma: PrismaClient | null = null;

if (typeof window === 'undefined' && process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient();
  } catch (e) {
    console.warn("Failed to initialize Prisma Client, using mock data fallback:", e);
  }
}

export async function getAllUmkm(): Promise<Umkm[]> {
  if (prisma) {
    try {
      const data = await prisma.umkm.findMany({
        orderBy: { id: 'asc' }
      });
      return data as unknown as Umkm[];
    } catch (e) {
      console.error("Prisma query failed, falling back to mock data:", e);
    }
  }
  return mockUmkmList;
}

export async function createUmkm(data: Omit<Umkm, 'id'>): Promise<Umkm> {
  if (prisma) {
    try {
      const created = await prisma.umkm.create({
        data: {
          nama: data.nama,
          nama_usaha: data.nama_usaha,
          produk: data.produk,
          kategori: data.kategori,
          alamat: data.alamat,
          rt: Number(data.rt),
          rw: Number(data.rw),
          status_nib: data.status_nib,
          status_pelatihan: data.status_pelatihan,
          desil: Number(data.desil),
          status_validasi: data.status_validasi,
          kecamatan: data.kecamatan,
          tahun_laporan: Number(data.tahun_laporan),
          latitude: Number(data.latitude),
          longitude: Number(data.longitude)
        }
      });
      return created as unknown as Umkm;
    } catch (e) {
      console.error("Prisma create failed, falling back to mock data:", e);
    }
  }

  // Fallback to local in-memory
  const nextId = mockUmkmList.length > 0 ? Math.max(...mockUmkmList.map(item => item.id)) + 1 : 1;
  const newUmkm: Umkm = {
    ...data,
    id: nextId
  };
  mockUmkmList.push(newUmkm);
  return newUmkm;
}

export async function deleteUmkm(id: number): Promise<boolean> {
  if (prisma) {
    try {
      await prisma.umkm.delete({
        where: { id }
      });
      return true;
    } catch (e) {
      console.error("Prisma delete failed, falling back to mock data:", e);
    }
  }

  // Fallback
  const index = mockUmkmList.findIndex(item => item.id === id);
  if (index > -1) {
    mockUmkmList.splice(index, 1);
    return true;
  }
  return false;
}

export async function updateUmkm(id: number, data: Partial<Umkm>): Promise<Umkm | null> {
  if (prisma) {
    try {
      const updated = await prisma.umkm.update({
        where: { id },
        data: {
          ...data,
          // Guarantee type conversions for number inputs
          rt: data.rt !== undefined ? Number(data.rt) : undefined,
          rw: data.rw !== undefined ? Number(data.rw) : undefined,
          desil: data.desil !== undefined ? Number(data.desil) : undefined,
          tahun_laporan: data.tahun_laporan !== undefined ? Number(data.tahun_laporan) : undefined,
          latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
          longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
        }
      });
      return updated as unknown as Umkm;
    } catch (e) {
      console.error("Prisma update failed, falling back to mock data:", e);
    }
  }

  // Fallback
  const index = mockUmkmList.findIndex(item => item.id === id);
  if (index > -1) {
    mockUmkmList[index] = {
      ...mockUmkmList[index],
      ...data
    } as Umkm;
    return mockUmkmList[index];
  }
  return null;
}

// Deprecated in favor of generic updateUmkm
export async function updateValidasiStatus(id: number, status: 'Cek Lapangan' | 'Perlu Cek'): Promise<Umkm | null> {
  return updateUmkm(id, { status_validasi: status });
}

export async function updateNibStatus(id: number, status: 'Sudah NIB' | 'Belum NIB'): Promise<Umkm | null> {
  return updateUmkm(id, { status_nib: status });
}
