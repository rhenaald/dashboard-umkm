const fs = require('fs');
const path = require('path');

const tawangPath = path.join(__dirname, '../data/Tawang.json');
const cihideungPath = path.join(__dirname, '../data/Cihideung.json');
const mockDataPath = path.join(__dirname, '../app/utils/mockData.ts');
const seedJsPath = path.join(__dirname, '../prisma/seed.js');

const rawTawang = fs.existsSync(tawangPath) ? JSON.parse(fs.readFileSync(tawangPath, 'utf8')) : [];
const rawCihideung = fs.existsSync(cihideungPath) ? JSON.parse(fs.readFileSync(cihideungPath, 'utf8')) : [];

function getKategori(catName, title) {
  const text = ((catName || '') + ' ' + (title || '')).toLowerCase();
  if (text.match(/foto|studio|salon|cukur|laundry|binatu|optik|service|reparasi|las|percetakan|fotokopi|bengkel|servis|cuci|pangkas|jahit|klinik|praktek|dokter|panti|spa|pijat/i)) return 'Jasa';
  if (text.match(/restoran|kopi|kafe|makanan|bakso|jus|kuliner|warung|kue|roti|dapur|daging|seblak|nasi|soto|mie|kedai|catering|katering|gorengan|martabak|bakery/i)) return 'Kuliner';
  if (text.match(/pakaian|baju|sepatu|tas|busana|fashion|fesyen|distro|boutique|hijab|jilbab|kemeja|jaket|kerudung|konveksi|gamis|aksesoris/i)) return 'Fesyen';
  if (text.match(/mebel|kerajinan|bunga|souvenir|kayu|ukiran|furnitur|bambu|hiasan|bordir|kelom|anyaman/i)) return 'Kerajinan';
  return 'Perdagangan';
}

function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}

function processList(rawList, defaultKecamatan, startIdx) {
  return rawList.map((item, idx) => {
    const catName = item.categoryName || (item.categories && item.categories[0]) || '';
    const kategori = getKategori(catName, item.title);
    const alamatStr = item.street || item.address || '';
    
    // Extract exact lat and lng from location object if available
    let lat = -7.3350;
    let lng = 108.2220;

    if (item.location && typeof item.location.lat === 'number' && typeof item.location.lng === 'number') {
      lat = Number(item.location.lat.toFixed(7));
      lng = Number(item.location.lng.toFixed(7));
    }

    return {
      id: startIdx + idx + 1,
      nama: '',
      nama_usaha: truncate(item.title, 240) || '',
      produk: truncate(catName, 240) || '',
      kategori: truncate(kategori, 90) || 'Perdagangan',
      alamat: truncate(alamatStr, 240) || '',
      rt: 0,
      rw: 0,
      status_nib: '',
      status_pelatihan: '',
      desil: 0,
      status_validasi: '',
      kecamatan: defaultKecamatan,
      tahun_laporan: 0,
      latitude: lat,
      longitude: lng,
      url: item.url || ''
    };
  });
}

const datasetTawang = processList(rawTawang, 'Tawang', 0);
const datasetCihideung = processList(rawCihideung, 'Cihideung', datasetTawang.length);
const combinedDataset = [...datasetTawang, ...datasetCihideung];

console.log(`Processed: ${datasetTawang.length} Tawang entries, ${datasetCihideung.length} Cihideung entries. Total: ${combinedDataset.length}`);

// Write to app/utils/mockData.ts
const tsContent = `export interface Umkm {
  id: number;
  nama: string;
  nama_usaha: string;
  produk: string;
  kategori: string;
  alamat: string;
  rt: number;
  rw: number;
  status_nib: string;
  status_pelatihan: string;
  desil: number;
  status_validasi: string;
  kecamatan: string;
  tahun_laporan: number;
  latitude: number;
  longitude: number;
  url?: string;
}

// Memory database loaded directly from Tawang.json and Cihideung.json datasets
export let mockUmkmList: Umkm[] = ${JSON.stringify(combinedDataset, null, 2)};
`;

fs.writeFileSync(mockDataPath, tsContent, 'utf8');
console.log(`Successfully written ${combinedDataset.length} items to ${mockDataPath}`);

// Write to prisma/seed.js
const seedContent = `const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const mockUmkmList = ${JSON.stringify(combinedDataset, null, 2)};

async function main() {
  console.log('Seeding Tawang & Cihideung UMKM dataset into PostgreSQL...');
  
  // Seed default admin user if not exists
  const defaultAdminUsername = 'admin';
  const defaultAdminPassword = crypto.createHash('sha256').update('admin123').digest('hex');

  await prisma.admin.upsert({
    where: { username: defaultAdminUsername },
    update: {},
    create: {
      username: defaultAdminUsername,
      password: defaultAdminPassword,
      nama: 'Administrator Kelurahan',
    },
  });

  // Clear existing UMKM data and batch insert
  await prisma.umkm.deleteMany();

  await prisma.umkm.createMany({
    data: mockUmkmList,
    skipDuplicates: true
  });

  console.log(\`Successfully seeded \${mockUmkmList.length} UMKM entries!\`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync(seedJsPath, seedContent, 'utf8');
console.log(`Successfully written ${combinedDataset.length} items to ${seedJsPath}`);
