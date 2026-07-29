'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, User, Bot, CheckCircle2, RotateCcw, ExternalLink, Store, Utensils, Shirt, Scissors, Wrench } from 'lucide-react';

interface UmkmRecommendation {
  id: number;
  nama_usaha: string;
  produk: string | null;
  kategori: string;
  alamat: string | null;
  kecamatan: string;
  url: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  links?: { label: string; url: string }[];
  followups?: { label: string; query: string }[];
  recommendations?: UmkmRecommendation[];
}

interface KnowledgeRule {
  keywords: string[];
  text: string;
  links?: { label: string; url: string }[];
  followups?: { label: string; query: string }[];
}

const QUICK_PROMPTS = [
  { label: 'Syarat NIB', query: 'persyaratan NIB' },
  { label: 'Sertifikat Halal', query: 'persyaratan halal' },
  { label: 'Panduan KBLI', query: 'panduan kbli' },
  { label: 'Pinjaman BJB Mesra', query: 'bjb mesra' },
  { label: 'Peta UMKM', query: 'peta umkm' }
];

const RULE_DATABASE: KnowledgeRule[] = [
  {
    keywords: ['hi', 'hallo', 'halo', 'hello', 'pagi', 'siang', 'sore', 'malam', 'sampurasun', 'assalamualaikum', 'ping', 'tes'],
    text: 'Sampurasun! 👋 Saya Asisten Virtual BAKUL PELAK. Ada yang bisa saya bantu terkait perizinan NIB, Sertifikat Halal, KBLI, permodalan KUR/BJB Mesra, atau peta UMKM Tasikmalaya?',
    followups: QUICK_PROMPTS
  },
  {
    keywords: ['siapa kamu', 'siapa anda', 'kamu siapa', 'bot apa ini', 'siapa bot', 'apa itu bakul pelak'],
    text: 'Saya adalah Asisten Virtual BAKUL PELAK (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif).\n\nTugas saya membantu pelaku UMKM dan warga Kota Tasikmalaya (khususnya Kecamatan Tawang & Cihideung) mencari informasi perizinan, legalitas, permodalan, dan lokasi UMKM.',
    followups: [
      { label: '📜 Syarat NIB', query: 'persyaratan NIB' },
      { label: '📍 Peta UMKM', query: 'peta umkm' }
    ]
  },
  {
    keywords: ['persyaratan nib', 'syarat nib', 'dokumen nib', 'berkas nib', 'butuh apa buat nib', 'nib'],
    text: 'Untuk mendaftar NIB (Nomor Induk Berusaha) Mikro & Kecil secara online, siapkan:\n\n1. 🆔 NIK KTP Pemilik Usaha\n2. 📱 Nomor HP / WhatsApp Aktif\n3. ✉️ Alamat Email Aktif\n4. 🏠 Data Usaha (Nama usaha, alamat, modal, tenaga kerja, kode KBLI)\n\n📌 Pendaftaran 100% GRATIS di portal resmi OSS RBA (oss.go.id)!',
    links: [{ label: 'Daftar NIB di OSS RBA', url: 'https://oss.go.id' }],
    followups: [
      { label: '🚀 Langkah Buat NIB', query: 'langkah buat NIB' },
      { label: '🏷️ Cari Kode KBLI', query: 'panduan kbli' }
    ]
  },
  {
    keywords: ['langkah buat nib', 'cara buat nib', 'langkah nib', 'cara daftar nib', 'bikin nib', 'proses nib', 'tutorial nib', 'langkah-langkah nib'],
    text: 'Langkah pembuatan NIB mandiri di oss.go.id:\n\n1. Buat akun hak akses menggunakan NIK KTP, email & HP.\n2. Login ke Dashboard OSS ➔ pilih "Perizinan Berusaha" ➔ "Permohonan Baru".\n3. Isi data diri & pilih kode KBLI sesuai bidang usaha Anda.\n4. Klik "Terbitkan NIB" dan unduh berkas perizinan PDF Anda.',
    links: [{ label: 'Kunjungi OSS.go.id', url: 'https://oss.go.id' }],
    followups: [
      { label: '📋 Syarat NIB', query: 'persyaratan NIB' },
      { label: '🏷️ Kode KBLI', query: 'panduan kbli' }
    ]
  },
  {
    keywords: ['persyaratan halal', 'syarat halal', 'dokumen halal', 'sertifikat halal', 'halal gratis', 'sehati', 'sihalal', 'halal'],
    text: 'Persyaratan Sertifikasi Halal Gratis (Program SEHATI BPJPH Kemenag):\n\n1. 🆔 Memiliki NIB aktif\n2. 🥩 Bahan baku terjamin halal & aman\n3. 🧼 Proses olahan bersih & higienis\n4. 📝 Menyiapkan daftar bahan baku & alur produksi sederhana\n\nPendaftaran dapat dilakukan melalui portal SIHALAL (ptsp.halal.go.id).',
    links: [{ label: 'Portal SIHALAL Kemenag', url: 'https://ptsp.halal.go.id' }],
    followups: [
      { label: '📜 Syarat NIB Dulu', query: 'persyaratan NIB' },
      { label: '💰 Bantuan Pemkot', query: 'bantuan umkm' }
    ]
  },
  {
    keywords: ['panduan kbli', 'kbli', 'kode kbli', 'cari kbli', 'kbli bakso', 'kbli bordir', 'kbli kelom'],
    text: 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) menentukan kode aktivitas usaha Anda.\n\nContoh Kode KBLI Populer di Tasikmalaya:\n• 🍜 56101: Kedai / Warung Makan (Bakso, Kupat Tahu)\n• 🧵 13921: Industri Barang Jadi Tekstil / Bordir Tasik\n• 👡 16292: Kerajinan Kelom Geulis & Kerajinan Kayu\n• 👗 47711: Toko Pakaian / Busana Muslim\n• ☕ 56303: Kedai Kopi / Coffee Shop',
    links: [{ label: 'Katalog KBLI OSS RBA', url: 'https://oss.go.id/informasi/kbli-berbasis-risiko' }],
    followups: [
      { label: '🚀 Cara Buat NIB', query: 'langkah buat NIB' }
    ]
  },
  {
    keywords: ['bjb mesra', 'kredit mesra', 'pinjaman bjb', 'tanpa bunga', 'tanpa jaminan', 'pinjaman tanpa jaminan'],
    text: 'Kredit BJB Mesra (Masyarakat Sejahtera) dari Bank BJB & Pemprov Jabar:\n\n✨ Keunggulan:\n• TANPA Agunan / Jaminan\n• TANPA Bunga (Bebas Riba, hanya biaya admin sangat ringan)\n• Plafon: Rp 500.000 s/d Rp 5.000.000 per orang\n• Berbasis kelompok usaha / tempat ibadah.\n\nSyarat: KTP Tasikmalaya, NIB / Surat Keterangan Usaha, rekomendasi pengurus tempat ibadah/RT/RW.',
    links: [{ label: 'Info Resmi BJB Mesra', url: 'https://bankbjb.co.id/personal/kredit-mesra' }],
    followups: [
      { label: '💰 Pinjaman KUR', query: 'kur' },
      { label: '📜 Syarat NIB', query: 'persyaratan NIB' }
    ]
  },
  {
    keywords: ['kur', 'kredit usaha rakyat', 'pinjaman kur', 'kur bri', 'kur bsi', 'modal usaha', 'pinjam modal'],
    text: 'Pinjaman KUR (Kredit Usaha Rakyat) didukung subsidi bunga pemerintah:\n\n• KUR Super Mikro: s.d. Rp 10 Juta (Bunga 3%/tahun)\n• KUR Mikro: Rp 10 Juta s.d. Rp 100 Juta (Bunga 6%/tahun, tanpa jaminan tambahan)\n• KUR Kecil: Rp 100 Juta s.d. Rp 500 Juta\n\nSyarat: Usaha berjalan min. 6 bulan, KTP, KK, NIB / Surat Keterangan Usaha.',
    followups: [
      { label: '🏦 Kredit BJB Mesra (Tanpa Bunga)', query: 'bjb mesra' }
    ]
  },
  {
    keywords: ['peta umkm', 'peta', 'pemetaan', 'lokasi umkm', 'tawang', 'cihideung', 'daftarkan usaha'],
    text: '📍 Peta Interaktif BAKUL PELAK menampilkan titik lokasi UMKM di Kecamatan Tawang & Cihideung Kota Tasikmalaya.\n\nFitur Peta:\n• Filter Bidang Usaha (Kuliner, Fashion/Bordir, Kelom, Jasa, Retail)\n• Filter Desil Kesejahteraan\n• Pop-up kontak WA pemilik usaha & status NIB/Halal.\n\nAnda dapat memasukkan data usaha Anda melalui menu Peta Interaktif atau kontak admin pendataan kelurahan!',
    followups: [
      { label: '📜 Syarat NIB', query: 'persyaratan NIB' }
    ]
  },
  {
    keywords: ['p-irt', 'pirt', 'izin pirt', 'dinkes'],
    text: 'P-IRT (Pangan Industri Rumah Tangga) dari Dinas Kesehatan Kota Tasikmalaya untuk produk olahan makanan/minuman kering tahan > 7 hari.\n\nSyarat: Memiliki NIB aktif, sertifikat Penyuluhan Keamanan Pangan (PKP), dan label kemasan sesuai aturan. Pengajuan dilakukan via sistem OSS RBA!',
    links: [{ label: 'Pengajuan P-IRT via OSS', url: 'https://oss.go.id' }],
    followups: [{ label: '🛡️ Syarat Halal', query: 'persyaratan halal' }]
  },
  {
    keywords: ['bpom', 'izin bpom', 'beda pirt dan bpom'],
    text: 'Izin BPOM wajib untuk makanan olahan daging/berisiko tinggi (frozen food, sosis, olahan susu) serta kosmetik & skincare.\n\nPerbedaan: P-IRT dikelola Dinkes Kota untuk produk rumah tangga risiko rendah, sedangkan BPOM diawasi BPOM RI untuk produk skala industri/risiko tinggi.',
    links: [{ label: 'Situs Resmi BPOM', url: 'https://www.pom.go.id' }],
    followups: [{ label: '📜 Syarat P-IRT', query: 'p-irt' }]
  },
  {
    keywords: ['haki', 'merek', 'daftar merek', 'logo usaha', 'paten'],
    text: 'Pendaftaran Merek Usaha di DJKI Kemenkumham melegalkan brand & logo usaha Anda.\n\nSyarat Pendaftaran UMKM: NIB / Surat Keterangan UMKM (dapat diskon biaya dari Rp 1.800.000 menjadi Rp 500.000!), File Logo Usaha, KTP Pemilik.',
    links: [{ label: 'Portal DJKI Hak Merek', url: 'https://dgip.go.id' }]
  },
  {
    keywords: ['pajak', 'pajak umkm', 'pph final', '0.5', 'bebas pajak'],
    text: 'Ketentuan Pajak UMKM (PP No. 55 Tahun 2022):\n\n1. 🆓 BEBAS PAJAK untuk Omzet < Rp 500 Juta / Tahun bagi UMKM Perorangan. Jika omzet tahunan belum mencapai Rp 500 juta, Anda TIDAK perlu membayar PPh!\n2. 📊 PPh Final 0,5%: Jika omzet melebihi Rp 500 juta/tahun, pajak hanya 0,5% dari omzet penjualan.',
    links: [{ label: 'Portal Pajak DJP Online', url: 'https://djponline.pajak.go.id' }]
  },
  {
    keywords: ['terima kasih', 'makasih', 'hatur nuhun', 'thanks', 'trims'],
    text: 'Sami-sami! 😊 Senang bisa membantu Anda. Jangan ragu bertanya kembali jika membutuhkan bantuan seputar usaha dan perizinan UMKM di Tasikmalaya.',
    followups: QUICK_PROMPTS
  }
];

function findMatchingRule(queryText: string): KnowledgeRule | null {
  const norm = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  if (!norm) return null;

  let best: KnowledgeRule | null = null;
  let maxScore = 0;

  for (const rule of RULE_DATABASE) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (norm === kw) {
        score += 20;
      } else if (norm.includes(kw) || kw.includes(norm)) {
        score += 10;
      } else {
        const words = norm.split(' ');
        for (const w of words) {
          if (w.length > 2 && kw.includes(w)) {
            score += 3;
          }
        }
      }
    }
    if (score > maxScore) {
      maxScore = score;
      best = rule;
    }
  }

  return maxScore >= 3 ? best : null;
}

interface CategoryRule {
  kategoriDB: string;
  label: string;
  keywords: string[];
  queryTerms: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    kategoriDB: 'Kuliner',
    label: 'Kuliner & Makanan',
    keywords: ['kuliner', 'makanan', 'makan', 'enak', 'lezat', 'sedap', 'nikmat', 'warung', 'rumah makan', 'kedai', 'jajanan', 'snack', 'cemilan', 'kue', 'jajanan pasar'],
    queryTerms: ['makanan']
  },
  {
    kategoriDB: 'Kuliner',
    label: 'Minuman',
    keywords: ['minuman', 'minum', 'kopi', 'teh', 'es', 'jus', 'es campur', 'es doger', 'wedang', 'bandrek', 'bajigur', 'kopi susu', 'coffee'],
    queryTerms: ['minuman']
  },
  {
    kategoriDB: 'Kuliner',
    label: 'Kuliner Khas (Soto, Baso, dll)',
    keywords: ['soto', 'baso', 'bakso', 'mie ayam', 'mi ayam', 'nasi goreng', 'mie goreng', 'nasi uduk', 'nasi kuning', 'sate', 'sate ayam', 'sate kambing', 'nasi campur', 'kupat tahu', 'lotek', 'siomay', 'batagor', 'cilok', 'cireng', 'seblak', 'otel', 'emporan'],
    queryTerms: ['soto', 'bakso', 'mie ayam']
  },
  {
    kategoriDB: 'Fesyen',
    label: 'Fashion & Busana',
    keywords: ['fashion', 'fesyen', 'busana', 'pakaian', 'baju', 'kaos', 'kemeja', 'gamis', 'hijab', 'kerudung', 'jilbab', 'dress', 'rok', 'celana', 'konveksi', 'garmen', 'jahit', 'penjahit', 'butik', 'sarung', 'sablon'],
    queryTerms: ['fashion', 'baju']
  },
  {
    kategoriDB: 'Fesyen',
    label: 'Bordir Tasik',
    keywords: ['bordir', 'bordir tasik', 'sulam', 'sulaman', 'kebaya bordir', 'mukena bordir', 'tas bordir', 'baju bordir'],
    queryTerms: ['bordir']
  },
  {
    kategoriDB: 'Kerajinan',
    label: 'Kerajinan & Handmade',
    keywords: ['kerajinan', 'handmade', 'kerajinan tangan', 'souvenir', 'oleh-oleh', 'aksesoris', 'perhiasan', 'cenderamata', 'gift', 'kado'],
    queryTerms: ['kerajinan']
  },
  {
    kategoriDB: 'Kerajinan',
    label: 'Kelom Geulis & Kayu',
    keywords: ['kelom', 'kelom geulis', 'alas kaki kayu', 'ukir', 'ukiran', 'kayu', 'meubel', 'furniture', 'perabot', 'rak', 'lemari', 'kursi', 'meja'],
    queryTerms: ['kelom', 'kayu']
  },
  {
    kategoriDB: 'Jasa',
    label: 'Jasa & Servis',
    keywords: ['jasa', 'servis', 'service', 'reparasi', 'perbaikan', 'las', 'bengkel', 'potong rambut', 'salon', 'barbershop', 'cuci', 'laundry', 'sewa', 'rental', 'fotografi', 'foto', 'video', 'desain', 'percetakan', 'cetak'],
    queryTerms: ['jasa']
  },
  {
    kategoriDB: 'Jasa',
    label: 'Foto & Dokumentasi',
    keywords: ['foto', 'fotografi', 'fotographer', 'video', 'videografi', 'dokumentasi', 'prewedding', 'wedding', 'peluang', 'cetak foto', 'cetak', 'photo booth', 'studio foto'],
    queryTerms: ['foto']
  },
  {
    kategoriDB: 'Pertanian',
    label: 'Pertanian & Pangan',
    keywords: ['pertanian', 'pangan', 'olahan pangan', 'hasill tani', 'sayur', 'buah', 'pupuk', 'ternak', 'peternakan', 'ikan', 'lele', 'ayam', 'bebek', 'telur', 'madu', 'ikan asin', 'kerupuk', 'tepung', 'bumbu', 'rempah'],
    queryTerms: ['pertanian', 'pangan']
  }
];

function findCategoryFromQuery(queryText: string): { category?: CategoryRule; searchTerm: string } | null {
  const norm = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  if (!norm) return null;

  // Extract keyword after "rekomendasi", "cari", "tunjukkan", dsb.
  const extractRegex = /(?:rekomendasi|rekomendasikan|cari|tunjukkan|temukan|daftar|list|info|recomended|recommendation|mana)\s+(?:untuk\s+|tentang\s+|di\s+|daerah\s+)?([a-z0-9\s-]+)/i;
  const match = queryText.match(extractRegex);
  let extractedTerm = '';
  if (match && match[1]) {
    extractedTerm = match[1].trim();
  }

  // If no pattern but the query is short (1-3 words), use the whole query
  let searchTerm = extractedTerm;
  if (!searchTerm) {
    const words = norm.split(/\s+/);
    if (words.length <= 3) {
      searchTerm = norm;
    }
  }

  if (!searchTerm) return null;

  // Remove common filler words
  searchTerm = searchTerm.replace(/^(di|pada|ke|yang|ada|dengan|dan|atau|umkm|usaha|bisnis)\s+/gi, '').trim();
  if (searchTerm.length < 2) return null;

  let bestMatch: CategoryRule | null = null;
  let bestScore = 0;
  let matchedTerm = '';

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      let score = 0;
      if (searchTerm === kw || norm === kw) {
        score = 20;
      } else if (searchTerm.includes(kw) || norm.includes(kw)) {
        score = 15;
      } else if ((kw.includes(searchTerm) || kw.includes(norm)) && (searchTerm.length >= 3 || norm.length >= 3)) {
        score = 10;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = rule;
        matchedTerm = kw;
      }
    }
  }

  // If we matched a category, return it with the dynamic searchTerm
  if (bestScore >= 5 && bestMatch) {
    return { category: bestMatch, searchTerm };
  }

  // If no category matched but we explicitly wanted to recommend/find something, or the query is very short
  if (extractedTerm || norm.split(/\s+/).length <= 2) {
    return { searchTerm };
  }

  return null;
}

async function fetchRecommendations(searchTerm: string, kategori: string, limit = 5): Promise<UmkmRecommendation[]> {
  try {
    const params = new URLSearchParams();
    if (kategori) params.set('kategori', kategori);
    if (searchTerm) params.set('q', searchTerm);
    params.set('limit', String(limit));

    const res = await fetch(`/api/rekomendasi?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const getCategoryIcon = (kategori: string) => {
  const kat = (kategori || '').toLowerCase();
  if (kat.includes('kuliner')) return <Utensils size={15} className="text-amber-600 dark:text-amber-400" />;
  if (kat.includes('fesyen')) return <Shirt size={15} className="text-blue-600 dark:text-blue-400" />;
  if (kat.includes('kerajinan')) return <Scissors size={15} className="text-purple-600 dark:text-purple-400" />;
  if (kat.includes('jasa')) return <Wrench size={15} className="text-emerald-600 dark:text-emerald-400" />;
  return <Store size={15} className="text-warm-brown-600 dark:text-warm-brown-400" />;
};

const getCategoryIconBg = (kategori: string) => {
  const kat = (kategori || '').toLowerCase();
  if (kat.includes('kuliner')) return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50';
  if (kat.includes('fesyen')) return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50';
  if (kat.includes('kerajinan')) return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50';
  if (kat.includes('jasa')) return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50';
  return 'bg-warm-brown-50 dark:bg-warm-brown-800 border-warm-brown-200 dark:border-warm-brown-700';
};

export default function VirtualAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya Asisten Virtual BAKUL PELAK. Silakan ketik pertanyaan Anda seputar NIB, Halal, KBLI, permodalan, atau lokasi UMKM Tasikmalaya.',
      followups: QUICK_PROMPTS
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const processQuery = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const categoryMatch = findCategoryFromQuery(queryText);

    // Determine if we should prioritize recommendation search
    // We prioritize it if we matched a search term and either:
    // - The user explicitly used words like "rekomendasi" / "cari", or
    // - We do not have an exact matching knowledge base rule
    const hasExplicitIntent = queryText.toLowerCase().includes('rekomendasi') || queryText.toLowerCase().includes('cari');
    const kbMatch = findMatchingRule(queryText);

    if (categoryMatch && (hasExplicitIntent || !kbMatch)) {
      const { category, searchTerm } = categoryMatch;
      const catLabel = category ? category.label : 'UMKM';
      const dbKategori = category ? category.kategoriDB : '';

      fetchRecommendations(searchTerm, dbKategori, 5).then(items => {
        let text: string;
        if (items.length > 0) {
          const namaList = items.map(i => `• ${i.nama_usaha}${i.produk ? ' — ' + i.produk : ''}`).join('\n');
          text = `Berikut rekomendasi *${searchTerm}* (${catLabel}) di Tasikmalaya:\n\n${namaList}\n\n📍 Total ${items.length} usaha ditemukan. Silakan klik kartu rekomendasi di bawah ini untuk melihat lokasinya di peta!`;
        } else {
          text = `Maaf, belum ada data UMKM untuk kata kunci *${searchTerm}* (${catLabel}) yang tercatat di database saat ini.\n\nSilakan kunjungi Peta Interaktif atau hubungi admin pendataan kelurahan untuk informasi lebih lanjut.`;
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          recommendations: items.length > 0 ? items : undefined,
          followups: [
            { label: '📍 Lihat di Peta', query: 'peta umkm' },
            { label: '🔍 Cari UMKM Lain', query: 'peta umkm' },
            ...QUICK_PROMPTS.slice(0, 2)
          ]
        };

        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);
      });
      return;
    }

    setTimeout(() => {
      const match = findMatchingRule(queryText);

      let botMsg: ChatMessage;

      if (match) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: match.text,
          links: match.links,
          followups: match.followups || QUICK_PROMPTS.slice(0, 3)
        };
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Terima kasih atas pertanyaan Anda tentang "${queryText}".\n\nSaya siap memberikan informasi seputar NIB, Sertifikat Halal, KBLI, P-IRT, HAKI, Kredit BJB Mesra, KUR, maupun Lokasi Peta UMKM Kota Tasikmalaya. Silakan pilih salah satu topik di bawah ini:`,
          followups: QUICK_PROMPTS
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    processQuery(text);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: 'Percakapan di-reset. Ada yang bisa saya bantu terkait usaha atau perizinan UMKM?',
        followups: QUICK_PROMPTS
      }
    ]);
  };

  if (pathname === '/login') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* Window Chat */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[85vh] bg-white dark:bg-warm-brown-900 border border-warm-brown-200 dark:border-warm-brown-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-200">

          {/* Simple Header */}
          <div className="bg-warm-brown-800 text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-warm-brown-700 border border-warm-brown-600 flex items-center justify-center text-amber-300">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-none">Asisten BAKUL PELAK</h3>
                <p className="text-[10px] text-warm-brown-200 mt-0.5">Pendamping UMKM Tasikmalaya</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1 rounded-lg text-warm-brown-300 hover:text-white hover:bg-warm-brown-700 transition-colors"
                title="Reset Chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-warm-brown-300 hover:text-white hover:bg-warm-brown-700 transition-colors"
                aria-label="Tutup"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-warm-brown-50/20 dark:bg-warm-brown-950/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${msg.sender === 'user'
                  ? 'bg-warm-brown-700 text-white'
                  : 'bg-warm-brown-100 text-warm-brown-800 dark:bg-warm-brown-800 dark:text-warm-brown-200'
                  }`}>
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.sender === 'user'
                  ? 'bg-warm-brown-700 text-white rounded-tr-none'
                  : 'bg-white border border-warm-brown-200/70 text-warm-brown-900 rounded-tl-none dark:bg-warm-brown-900 dark:border-warm-brown-800 dark:text-warm-brown-100 shadow-2xs'
                  }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-warm-brown-100 dark:border-warm-brown-800 flex flex-col gap-1">
                      {msg.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-warm-brown-800 dark:text-amber-400 hover:underline text-[11px]"
                        >
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span>{link.label}</span>
                          <ExternalLink size={10} className="ml-auto opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* UMKM Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-warm-brown-100 dark:border-warm-brown-800 flex flex-col gap-1.5">
                      {msg.recommendations.map((rec) => {
                        const CardContent = (
                          <>
                            <div className={`h-9 w-9 rounded-md flex items-center justify-center flex-shrink-0 border ${getCategoryIconBg(rec.kategori)}`}>
                              {getCategoryIcon(rec.kategori)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <p className="text-[11px] font-bold text-warm-brown-900 dark:text-warm-brown-100 truncate flex-1">{rec.nama_usaha}</p>
                                {rec.url && <ExternalLink size={10} className="text-warm-brown-400 dark:text-warm-brown-500 group-hover:text-warm-brown-800 dark:group-hover:text-amber-400 transition-colors flex-shrink-0" />}
                              </div>
                              {rec.produk && (
                                <p className="text-[10px] text-warm-brown-600 dark:text-warm-brown-400 truncate">{rec.produk}</p>
                              )}
                              <p className="text-[9px] text-warm-brown-400 dark:text-warm-brown-500 mt-0.5">
                                {rec.alamat || rec.kecamatan}
                              </p>
                            </div>
                          </>
                        );

                        return rec.url ? (
                          <a
                            key={rec.id}
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-warm-brown-50 dark:bg-warm-brown-800/40 border border-warm-brown-200/60 dark:border-warm-brown-700/60 rounded-lg p-2 flex items-start gap-2 hover:bg-warm-brown-100/80 dark:hover:bg-warm-brown-800 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs"
                            title="Lihat di Google Maps"
                          >
                            {CardContent}
                          </a>
                        ) : (
                          <div
                            key={rec.id}
                            className="bg-warm-brown-50 dark:bg-warm-brown-800/40 border border-warm-brown-200/60 dark:border-warm-brown-700/60 rounded-lg p-2 flex items-start gap-2 shadow-2xs"
                          >
                            {CardContent}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Followups */}
                  {msg.followups && msg.followups.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-warm-brown-100 dark:border-warm-brown-850 flex flex-wrap gap-1">
                      {msg.followups.map((fp, idx) => (
                        <button
                          key={idx}
                          onClick={() => processQuery(fp.query)}
                          className="bg-warm-brown-50 hover:bg-warm-brown-100 dark:bg-warm-brown-800 dark:hover:bg-warm-brown-700 text-warm-brown-800 dark:text-warm-brown-200 border border-warm-brown-200 dark:border-warm-brown-700 text-[10px] font-medium px-2 py-0.5 rounded-lg transition-colors"
                        >
                          {fp.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="h-6 w-6 rounded-full bg-warm-brown-100 dark:bg-warm-brown-800 flex items-center justify-center text-warm-brown-700 dark:text-warm-brown-300">
                  <Bot size={12} />
                </div>
                <div className="bg-white dark:bg-warm-brown-900 border border-warm-brown-200 dark:border-warm-brown-800 rounded-xl px-3 py-2 text-xs shadow-2xs flex items-center gap-1.5 text-warm-brown-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-warm-brown-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-warm-brown-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-warm-brown-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar & Simple Input */}
          <div className="p-2.5 border-t border-warm-brown-200 dark:border-warm-brown-850 bg-white dark:bg-warm-brown-950 space-y-2">
            {/* Quick Pills */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => processQuery(item.query)}
                  className="rounded-lg border border-warm-brown-200 bg-warm-brown-50/80 px-2 py-0.5 text-[10px] font-medium text-warm-brown-700 whitespace-nowrap hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 rounded-xl border border-warm-brown-200 bg-warm-brown-50/50 py-1.5 px-3 text-xs text-warm-brown-900 placeholder-warm-brown-400 focus:border-warm-brown-600 focus:bg-white focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-100 dark:placeholder-warm-brown-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="rounded-xl bg-warm-brown-800 hover:bg-warm-brown-900 disabled:opacity-40 p-2 text-white shadow-sm transition-all flex items-center justify-center"
                aria-label="Kirim"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-12 w-12 rounded-full bg-warm-brown-800 hover:bg-warm-brown-900 text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        aria-label="Asisten Virtual"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}
