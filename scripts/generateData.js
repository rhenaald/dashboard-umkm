const fs = require('fs');
const path = require('path');

const tawangPath = path.join(__dirname, '../data/Tawang.json');
const cihideungPath = path.join(__dirname, '../data/Cihideung.json');
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

function detectKecamatan(item, defaultKec) {
  const fullText = [
    item.address,
    item.neighborhood,
    item.street,
    item.title
  ].filter(Boolean).join(' ').toLowerCase();

  // Explicit kecamatan mentions in address
  if (fullText.includes('kec. cihideung') || fullText.includes('kecamatan cihideung')) return 'Cihideung';
  if (fullText.includes('kec. tawang') || fullText.includes('kecamatan tawang')) return 'Tawang';

  // Kelurahan & area keywords in Cihideung vs Tawang
  const cihideungKeywords = ['cihideung', 'tugujaya', 'tuguraja', 'cilembang', 'yudanagara', 'nagarawangi', 'argasari'];
  const tawangKeywords = ['tawang', 'kahuripan', 'lengkongsari', 'cikalang', 'tawangsari', 'empangsari'];

  const hasCihideung = cihideungKeywords.some(kw => fullText.includes(kw));
  const hasTawang = tawangKeywords.some(kw => fullText.includes(kw));

  if (hasCihideung && !hasTawang) return 'Cihideung';
  if (hasTawang && !hasCihideung) return 'Tawang';

  if (fullText.includes('cihideung')) return 'Cihideung';
  if (fullText.includes('tawang')) return 'Tawang';

  return defaultKec;
}

function processList(rawList, defaultKecamatan, startIdx) {
  return rawList.map((item, idx) => {
    const catName = item.categoryName || (item.categories && item.categories[0]) || '';
    const kategori = getKategori(catName, item.title);
    const alamatStr = item.street || item.address || '';
    const exactKecamatan = detectKecamatan(item, defaultKecamatan);

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
      kecamatan: exactKecamatan,
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

const totalTawang = combinedDataset.filter(i => i.kecamatan === 'Tawang').length;
const totalCihideung = combinedDataset.filter(i => i.kecamatan === 'Cihideung').length;

console.log(`Processed: Total ${combinedDataset.length} UMKM (Tawang: ${totalTawang}, Cihideung: ${totalCihideung})`);

// Write to prisma/seed.js
const seedContent = `const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const mockUmkmList = ${JSON.stringify(combinedDataset, null, 2)};

async function main() {
  console.log('Seeding Tawang & Cihideung UMKM dataset into PostgreSQL...');
  
  // Seed default admin user if not exists
  const defaultAdminUsername = 'admin';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync('admin123', salt, 64).toString('hex');
  const defaultAdminPassword = \`scrypt\$\${salt}\$\${hash}\`;

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
