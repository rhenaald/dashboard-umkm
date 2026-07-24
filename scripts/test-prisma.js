const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Attempting to write a test UMKM to Neon database...");
  try {
    const testUmkm = {
      nama: "Test Owner",
      nama_usaha: "Toko Test Prisma",
      produk: "Makanan Ringan",
      kategori: "Kuliner",
      alamat: "Jl. Test No. 123",
      rt: 1,
      rw: 2,
      status_nib: "Belum NIB",
      status_pelatihan: "Belum",
      desil: 3,
      status_validasi: "Perlu Cek",
      kecamatan: "Tawang",
      tahun_laporan: 2026,
      latitude: -7.335,
      longitude: 108.222,
      url: "https://maps.google.com/?q=test"
    };

    const created = await prisma.umkm.create({
      data: testUmkm
    });
    console.log("SUCCESS! Test UMKM created with ID:", created.id);

    // Clean it up immediately to keep DB clean
    await prisma.umkm.delete({
      where: { id: created.id }
    });
    console.log("Test UMKM cleaned up successfully.");
  } catch (err) {
    console.error("ERROR DURING WRITE OPERATION:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
