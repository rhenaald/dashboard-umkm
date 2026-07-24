const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Fixing PostgreSQL autoincrement sequences...");
  try {
    // Reset sequence for 'umkm' table
    const umkmResult = await prisma.$queryRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('umkm', 'id'), coalesce(max(id), 1)) FROM umkm;`
    );
    console.log("SUCCESS! Reset sequence for 'umkm' table:", umkmResult);

    // Reset sequence for 'admin' table as well
    const adminResult = await prisma.$queryRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('admin', 'id'), coalesce(max(id), 1)) FROM admin;`
    );
    console.log("SUCCESS! Reset sequence for 'admin' table:", adminResult);

  } catch (err) {
    console.error("ERROR FIXING SEQUENCE:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
