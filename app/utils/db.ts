import { PrismaClient } from '@prisma/client';
import { Umkm } from '../types/umkm';
import crypto from 'crypto';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient | null = null;

if (typeof window === 'undefined') {
  if (process.env.DATABASE_URL) {
    try {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient();
      }
      prisma = globalForPrisma.prisma;
    } catch (e) {
      console.error("Failed to initialize Prisma Client:", e);
    }
  } else {
    console.error("DATABASE_URL is not set in environment variables.");
  }
}

function getPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error("Database client is not initialized. Please ensure DATABASE_URL is set.");
  }
  return prisma;
}

export async function getAllUmkm(): Promise<Umkm[]> {
  const client = getPrismaClient();
  const data = await client.umkm.findMany({
    orderBy: { id: 'asc' }
  });
  return data as unknown as Umkm[];
}

export async function createUmkm(data: Omit<Umkm, 'id'>): Promise<Umkm> {
  const client = getPrismaClient();
  const created = await client.umkm.create({
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
      longitude: Number(data.longitude),
      url: data.url
    }
  });
  return created as unknown as Umkm;
}

export async function deleteUmkm(id: number): Promise<boolean> {
  const client = getPrismaClient();
  await client.umkm.delete({
    where: { id }
  });
  return true;
}

export async function updateUmkm(id: number, data: Partial<Umkm>): Promise<Umkm | null> {
  const client = getPrismaClient();
  const updated = await client.umkm.update({
    where: { id },
    data: {
      ...data,
      rt: data.rt !== undefined ? Number(data.rt) : undefined,
      rw: data.rw !== undefined ? Number(data.rw) : undefined,
      desil: data.desil !== undefined ? Number(data.desil) : undefined,
      tahun_laporan: data.tahun_laporan !== undefined ? Number(data.tahun_laporan) : undefined,
      latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
      longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
    }
  });
  return updated as unknown as Umkm;
}

// Deprecated in favor of generic updateUmkm
export async function updateValidasiStatus(id: number, status: 'Cek Lapangan' | 'Perlu Cek'): Promise<Umkm | null> {
  return updateUmkm(id, { status_validasi: status });
}

export async function updateNibStatus(id: number, status: 'Sudah NIB' | 'Belum NIB'): Promise<Umkm | null> {
  return updateUmkm(id, { status_nib: status });
}

export async function getAdminByUsername(username: string): Promise<any> {
  const client = getPrismaClient();
  const dbAdmin = await (client as any).admin.findUnique({
    where: { username }
  });
  return dbAdmin;
}
