const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/Tawang.json');
const mockDataPath = path.join(__dirname, '../app/utils/mockData.ts');
const seedJsPath = path.join(__dirname, '../prisma/seed.js');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Expanded high-precision landmark & street geocoding dictionary for Tawang, Tasikmalaya
const locationMap = [
  { match: /asia\s*plaza|mall\s*asia/i, lat: -7.3465, lng: 108.2210 },
  { match: /tasik\s*indah\s*plaza/i, lat: -7.3325, lng: 108.2220 },
  { match: /universitas\s*perjuangan|unper/i, lat: -7.3478, lng: 108.2235 },
  { match: /universitas\s*siliwangi|unsil/i, lat: -7.3425, lng: 108.2248 },
  { match: /mentari\s*batara/i, lat: -7.3485, lng: 108.2242 },
  { match: /bening\s*regency/i, lat: -7.3392, lng: 108.2025 },
  { match: /padayungan/i, lat: -7.3462, lng: 108.2175 },
  { match: /dadaha/i, lat: -7.3345, lng: 108.2222 },
  { match: /rumah\s*sakit/i, lat: -7.3338, lng: 108.2215 },
  { match: /panututan/i, lat: -7.3375, lng: 108.2255 },
  { match: /terusan\s*bca/i, lat: -7.3337, lng: 108.2222 },
  { match: /hz\.?\s*mustofa/i, lat: -7.3320, lng: 108.2215 },
  { match: /siliwangi/i, lat: -7.3410, lng: 108.2245 },
  { match: /peta/i, lat: -7.3480, lng: 108.2230 },
  { match: /bkr/i, lat: -7.3400, lng: 108.2200 },
  { match: /noenoeng|tisnasaputra/i, lat: -7.3435, lng: 108.2270 },
  { match: /sewaka/i, lat: -7.3510, lng: 108.2050 },
  { match: /tobing/i, lat: -7.3380, lng: 108.2050 },
  { match: /perintis\s*kemerdekaan/i, lat: -7.3520, lng: 108.2100 },
  { match: /paseh/i, lat: -7.3330, lng: 108.2140 },
  { match: /cikunten/i, lat: -7.3390, lng: 108.2020 },
  { match: /cihideung/i, lat: -7.3290, lng: 108.2210 },
  { match: /sambong/i, lat: -7.3490, lng: 108.2030 },
];

function getCoordinates(streetStr, titleStr, idx) {
  let baseLat = -7.3350;
  let baseLng = 108.2220;
  const fullText = `${streetStr} ${titleStr}`;

  for (const loc of locationMap) {
    if (loc.match.test(fullText)) {
      baseLat = loc.lat;
      baseLng = loc.lng;
      break;
    }
  }

  // Micro jitter so markers on the same street spread naturally along the road
  const rng1 = ((idx * 9301 + 49297) % 233280) / 233280 - 0.5;
  const rng2 = ((idx * 49297 + 9301) % 233280) / 233280 - 0.5;

  const lat = Number((baseLat + rng1 * 0.0025).toFixed(6));
  const lng = Number((baseLng + rng2 * 0.0025).toFixed(6));

  return { lat, lng };
}

function getKategori(catName, title) {
  const text = (catName + ' ' + title).toLowerCase();
  if (text.match(/foto|studio|salon|cukur|laundry|binatu|optik|service|reparasi|las|percetakan|fotokopi|bengkel|servis|cuci|pangkas|jahit|klinik|praktek|dokter|panti|spa|pijat/i)) return 'Jasa';
  if (text.match(/restoran|kopi|kafe|makanan|bakso|jus|kuliner|warung|kue|roti|dapur|daging|seblak|nasi|soto|mie|kedai|catering|katering|gorengan|martabak/i)) return 'Kuliner';
  if (text.match(/pakaian|baju|sepatu|tas|busana|fashion|fesyen|distro|boutique|hijab|jilbab|kemeja|jaket|kerudung|konveksi|gamis|aksesoris/i)) return 'Fesyen';
  if (text.match(/mebel|kerajinan|bunga|souvenir|kayu|ukiran|furnitur|bambu|hiasan|bordir|kelom|anyaman/i)) return 'Kerajinan';
  return 'Perdagangan';
}

function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}

const dataset = raw.map((item, idx) => {
  const catName = item.categoryName || (item.categories && item.categories[0]) || '';
  const kategori = getKategori(catName, item.title);
  const alamatStr = item.street || '';
  const coords = getCoordinates(alamatStr, item.title, idx);

  return {
    id: idx + 1,
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
    kecamatan: 'Tawang',
    tahun_laporan: 0,
    latitude: coords.lat,
    longitude: coords.lng,
    url: item.url || ''
  };
});

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

// Memory database loaded directly from Tawang.json dataset
export let mockUmkmList: Umkm[] = ${JSON.stringify(dataset, null, 2)};
`;

fs.writeFileSync(mockDataPath, tsContent, 'utf8');
console.log(`Successfully written ${dataset.length} items to ${mockDataPath}`);

// Write to prisma/seed.js
const seedContent = `const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const mockUmkmList = ${JSON.stringify(dataset, null, 2)};

async function main() {
  console.log('Seeding Tawang UMKM dataset into PostgreSQL...');
  
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
console.log(`Successfully written ${dataset.length} items to ${seedJsPath}`);
