'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Building2, ShieldCheck, HeartHandshake, HelpCircle,
  Search, Send, MessageSquare, Landmark, User, FileText, CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  links?: { label: string; url: string }[];
}

const KBLI_DATA = [
  { code: '56101', name: 'Restoran / Rumah Makan', desc: 'Penyediaan jasa makanan bagi konsumen dengan penyajian langsung, seperti warung nasi, kedai bakso, rumah makan sunda.' },
  { code: '13921', name: 'Industri Barang Jadi Tekstil (Bordir)', desc: 'Pembuatan produk bordir, sulaman kebaya, mukena bordir khas Tasikmalaya.' },
  { code: '16292', name: 'Industri Kelom Geulis & Kerajinan Kayu', desc: 'Pembuatan alas kaki kayu tradisional kelom geulis, ukiran kayu, kerajinan berbahan dasar bambu/kayu.' },
  { code: '47711', name: 'Perdagangan Eceran Pakaian', desc: 'Penjualan eceran pakaian jadi, jilbab, hijab anak/dewasa, busana muslim.' },
  { code: '56303', name: 'Kedai Minuman / Kopi', desc: 'Penyediaan jasa minuman kopi, jus, susu, teh dengan atau tanpa makanan ringan.' },
  { code: '10710', name: 'Industri Produk Roti & Kue', desc: 'Pembuatan roti manis, kue kering, nastar, kastengel, rengginang, keripik tempe, makanan ringan.' },
  { code: '96020', name: 'Aktivitas Salon Kecantikan & Rias', desc: 'Jasa pemotongan rambut, rias pengantin, perawatan wajah, persewaan baju pengantin.' },
  { code: '95290', name: 'Reparasi Barang Keperluan Pribadi', desc: 'Jasa reparasi sepatu, sol sepatu, reparasi tas rajut, perawatan barang kulit.' },
  { code: '01461', name: 'Budidaya Jamur / Pertanian Mikro', desc: 'Budidaya jamur tiram, sayuran hidroponik, peternakan lele skala rumah tangga.' },
  { code: '25920', name: 'Jasa Las & Pengerjaan Logam', desc: 'Pengelasan pagar besi, pembuatan kanopi, teralis jendela, pengerjaan plat seng.' }
];

export default function LayananPublikPage() {
  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Sampurasun! Saya Asisten BAKUL, asisten virtual kelurahan Kahuripan. Ada yang bisa saya bantu terkait perizinan, sertifikasi halal, atau program UMKM?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // KBLI State
  const [kbliQuery, setKbliQuery] = useState('');

  // Complaint Form State
  const [complaintName, setComplaintName] = useState('');
  const [complaintBiz, setComplaintBiz] = useState('');
  const [complaintContact, setComplaintContact] = useState('');
  const [complaintCat, setComplaintCat] = useState('Perizinan');
  const [complaintText, setComplaintText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll Chat to Bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Complaint Submit
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintName || !complaintBiz || !complaintContact || !complaintText) return;
    setFormSubmitted(true);
    // Reset Form
    setTimeout(() => {
      setComplaintName('');
      setComplaintBiz('');
      setComplaintContact('');
      setComplaintText('');
      setFormSubmitted(false);
      alert('Aduan/Laporan berhasil dikirim ke database Kelurahan Kahuripan. Petugas akan menghubungi Anda dalam 2x24 jam.');
    }, 1000);
  };

  // Predefined Q&A mapping for Bot
  const chatbotReplies: { [key: string]: { text: string; links?: { label: string; url: string }[] } } = {
    'persyaratan nib': {
      text: 'Untuk mendaftar NIB (Nomor Induk Berusaha) Mikro/Kecil secara online, siapkan dokumen berikut:\n1. NIK KTP pemilik usaha.\n2. Alamat email aktif & Nomor HP/WhatsApp aktif.\n3. Rincian data usaha (kegiatan usaha, alamat usaha, jumlah modal usaha, jumlah tenaga kerja).\n\nAnda bisa mendaftar gratis 100% langsung di situs resmi OSS RBA.',
      links: [{ label: 'Daftar NIB di OSS RBA', url: 'https://oss.go.id' }]
    },
    'langkah-langkah nib': {
      text: 'Berikut langkah pembuatan NIB mandiri:\n1. Buat akun hak akses di situs resmi OSS RBA menggunakan KTP/Email.\n2. Login, pilih menu "Perizinan Berusaha" -> "Permohonan Baru".\n3. Isi formulir data diri pelaku usaha.\n4. Tambahkan rincian bidang usaha (masukkan kode KBLI produk Anda).\n5. Klik "Terbitkan NIB" dan unduh berkas perizinan PDF Anda.',
      links: [{ label: 'Panduan Video OSS', url: 'https://oss.go.id/panduan' }]
    },
    'persyaratan halal': {
      text: 'Sertifikasi Halal Gratis (program SEHATI LPPOM MUI) diperuntukkan bagi usaha mikro/kecil. Persyaratan utama:\n1. Produk tidak menggunakan bahan baku yang diragukan kehalalannya (seperti daging impor tanpa sertifikat halal).\n2. Proses pengolahan dipastikan aman, bersih, dan higienis.\n3. Pelaku usaha telah memiliki NIB aktif.\n4. Menyiapkan berkas nama bahan dan skema proses produk halal.',
      links: [{ label: 'Daftar Halal di SIHALAL', url: 'https://ptsp.halal.go.id' }]
    },
    'panduan kbli': {
      text: 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) menentukan kode aktivitas ekonomi usaha Anda. Contoh kode populer di Kahuripan:\n- 56101: Kedai Makanan (Bakso, Warung Nasi)\n- 13921: Kerajinan Bordir Tasik\n- 16292: Kerajinan Kelom Geulis & Kerajinan Kayu\n- 47711: Toko Pakaian / Jilbab\n\nGunakan kotak pencarian KBLI di samping kiri untuk mencari kode bidang usaha Anda secara spesifik!',
    },
    'program bantuan umkm': {
      text: 'Kelurahan Kahuripan dan Dinas Koperasi, UMKM & Perindustrian Kota Tasikmalaya menyediakan berbagai program bantuan tahun 2026:\n1. Fasilitasi Pembuatan Sertifikat Halal Massal (SEHATI).\n2. Pelatihan Pemasaran Digital & Ekspor Kelom Geulis (Agustus 2026).\n3. Program Permodalan Tanpa Jaminan "Kredit Mesra" Bank BJB.\n\nHubungi Sekretariat Kelurahan untuk pendaftaran bantuan aktif!',
      links: [{ label: 'Layanan Bantuan BJB Mesra', url: 'https://bankbjb.co.id/personal/kredit-mesra' }]
    }
  };

  const triggerBotReply = (key: string, userText: string) => {
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    // Add bot reply typing state
    setTimeout(() => {
      const match = chatbotReplies[key];
      if (match) {
        setMessages(prev => [...prev, { sender: 'bot', text: match.text, links: match.links }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'Maaf, saya tidak mengerti pertanyaan tersebut. Silakan pilih salah satu pertanyaan populer di bawah chat untuk jawaban cepat yang informatif.'
        }]);
      }
    }, 600);
  };

  const handleCustomChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const queryNormalized = chatInput.toLowerCase().trim();
    let matchedKey = '';

    // Check key containment
    if (queryNormalized.includes('syarat nib') || queryNormalized.includes('persyaratan nib')) matchedKey = 'persyaratan nib';
    else if (queryNormalized.includes('cara buat nib') || queryNormalized.includes('langkah nib') || queryNormalized.includes('langkah-langkah nib')) matchedKey = 'langkah-langkah nib';
    else if (queryNormalized.includes('halal') || queryNormalized.includes('syarat halal')) matchedKey = 'persyaratan halal';
    else if (queryNormalized.includes('kbli') || queryNormalized.includes('kode kbli')) matchedKey = 'panduan kbli';
    else if (queryNormalized.includes('bantuan') || queryNormalized.includes('program bantuan')) matchedKey = 'program bantuan umkm';

    const userText = chatInput;
    setChatInput('');
    triggerBotReply(matchedKey, userText);
  };

  // Filter KBLI guide
  const filteredKbli = KBLI_DATA.filter(item =>
    item.code.includes(kbliQuery) ||
    item.name.toLowerCase().includes(kbliQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(kbliQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 mb-10 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Pelayanan Administrasi Digital
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Portal Layanan Publik &amp; Asistensi
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Akses perizinan mandiri, pencarian klasifikasi usaha KBLI, form pengaduan kelurahan, serta konsultasi perizinan instan dengan Asisten Virtual BAKUL.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">

          {/* OSS Card */}
          <a
            href="https://oss.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                Pendaftaran NIB (OSS RBA)
              </h3>
              <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                Buat Nomor Induk Berusaha (NIB) secara gratis dan resmi melalui portal Lembaga OSS Kementerian Investasi.
              </p>
            </div>
          </a>

          {/* Halal Card */}
          <a
            href="https://ptsp.halal.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-green-50 text-green-700 group-hover:bg-green-100 transition-colors dark:bg-green-950/20 dark:text-green-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                Sertifikasi Halal (SIHALAL)
              </h3>
              <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                Ajukan sertifikasi produk halal secara online (SEHATI) terintegrasi dengan BPJPH Kementerian Agama RI.
              </p>
            </div>
          </a>

          {/* Help Card */}
          <a
            href="#complaint-section"
            className="group rounded-3xl border border-warm-brown-250 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-warm-brown-850 dark:bg-warm-brown-900/60 flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-warm-brown-100 text-warm-brown-700 group-hover:bg-warm-brown-200 transition-colors dark:bg-warm-brown-950 dark:text-warm-brown-400">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100 group-hover:text-warm-brown-700 dark:group-hover:text-warm-brown-400 transition-colors">
                Layanan Pengaduan UMKM
              </h3>
              <p className="mt-2 text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed">
                Ajukan kendala teknis usaha, kesulitan permodalan, perizinan, atau sampaikan masukan langsung ke Kelurahan.
              </p>
            </div>
          </a>

        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Column: KBLI Search Tool & Form Pengaduan (7 cols) */}
          <div className="lg:col-span-7 space-y-8">

            {/* KBLI Guide Search Tool */}
            <div className="bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
              <div className="flex items-center gap-2 border-b border-warm-brown-100 pb-4 mb-5 dark:border-warm-brown-800">
                <Landmark size={20} className="text-warm-brown-700 dark:text-warm-brown-400" />
                <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
                  Panduan KBLI Terpopuler
                </h3>
              </div>

              <p className="text-xs text-warm-brown-650 dark:text-warm-brown-400 leading-relaxed mb-4">
                KBLI adalah klasifikasi standar kegiatan usaha. Pelaku usaha di Kelurahan Kahuripan wajib mengisi kode KBLI yang cocok saat membuat NIB. Cari kode di bawah ini:
              </p>

              {/* Search input */}
              <div className="relative mb-5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4.5 w-4.5 text-warm-brown-450 dark:text-warm-brown-500" />
                </div>
                <input
                  type="text"
                  placeholder="Cari kata kunci (e.g., 'bordir', 'makanan', 'kayu')..."
                  value={kbliQuery}
                  onChange={(e) => setKbliQuery(e.target.value)}
                  className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 pl-9 pr-4 text-xs font-medium text-warm-brown-900 focus:border-warm-brown-600 focus:bg-white focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors shadow-inner"
                />
              </div>

              {/* KBLI results list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {filteredKbli.length > 0 ? (
                  filteredKbli.map((kbli) => (
                    <div
                      key={kbli.code}
                      className="border border-warm-brown-100 rounded-2xl p-4 bg-warm-brown-50/50 hover:bg-warm-brown-50 transition-colors dark:border-warm-brown-800 dark:bg-warm-brown-950/30 dark:hover:bg-warm-brown-900/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-warm-brown-700 dark:text-warm-brown-300 uppercase tracking-wide bg-warm-brown-100 dark:bg-warm-brown-950 px-2 py-0.5 rounded-md">
                          KBLI {kbli.code}
                        </span>
                        <span className="text-[10px] font-bold text-warm-brown-500 dark:text-warm-brown-400">Mikro &amp; Kecil</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-warm-brown-900 dark:text-warm-brown-150 mt-2">
                        {kbli.name}
                      </h4>
                      <p className="text-[11px] text-warm-brown-650 dark:text-warm-brown-400 mt-1 leading-normal font-medium">
                        {kbli.desc}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-warm-brown-500 dark:text-warm-brown-450 font-bold">
                    Tidak ada kode KBLI yang cocok.
                  </div>
                )}
              </div>
            </div>

            {/* Form Pengaduan */}
            <div id="complaint-section" className="bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850">
              <div className="flex items-center gap-2 border-b border-warm-brown-100 pb-4 mb-5 dark:border-warm-brown-800">
                <FileText size={20} className="text-warm-brown-700 dark:text-warm-brown-400" />
                <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
                  Formulir Pengaduan Pelaku Usaha
                </h3>
              </div>

              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1 dark:text-warm-brown-400">
                      Nama Pelaku Usaha
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintName}
                      onChange={(e) => setComplaintName(e.target.value)}
                      placeholder="Masukkan nama KTP Anda"
                      className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 px-3 text-xs text-warm-brown-900 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1 dark:text-warm-brown-400">
                      Nama Usaha
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintBiz}
                      onChange={(e) => setComplaintBiz(e.target.value)}
                      placeholder="Masukkan nama brand/toko"
                      className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 px-3 text-xs text-warm-brown-900 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1 dark:text-warm-brown-400">
                      Kontak WhatsApp / Email
                    </label>
                    <input
                      type="text"
                      required
                      value={complaintContact}
                      onChange={(e) => setComplaintContact(e.target.value)}
                      placeholder="e.g., 0812XXXXXXXX atau email"
                      className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 px-3 text-xs text-warm-brown-900 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1 dark:text-warm-brown-400">
                      Kategori Laporan
                    </label>
                    <select
                      value={complaintCat}
                      onChange={(e) => setComplaintCat(e.target.value)}
                      className="w-full rounded-xl border border-warm-brown-200 bg-white py-2 px-3 text-xs font-bold text-warm-brown-850 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250"
                    >
                      <option>Perizinan / Legalitas</option>
                      <option>Pemberdayaan / Pelatihan</option>
                      <option>Permodalan / Kredit</option>
                      <option>Pemasaran / Expo</option>
                      <option>Infrastruktur Lapangan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1 dark:text-warm-brown-400">
                    Detail Aduan / Pengaduan Usaha
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Deskripsikan kesulitan, masalah permohonan modal, perizinan, atau kendala lapangan secara detail..."
                    className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2 px-3 text-xs text-warm-brown-900 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 transition-colors"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={formSubmitted}
                    className="rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {formSubmitted ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Kirim Aduan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Chatbot Virtual Assistant (5 cols) */}
          <div className="lg:col-span-5">

            <div className="bg-white border border-warm-brown-200 rounded-3xl shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850 h-[620px] flex flex-col justify-between overflow-hidden">

              {/* Chat Title bar */}
              <div className="bg-warm-brown-100 p-4 text-warm-brown-900 border-b border-warm-brown-200 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warm-brown-200 flex items-center justify-center border border-warm-brown-300 text-warm-brown-700 shadow-inner">
                  <MessageSquare size={22} className="text-warm-brown-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-warm-brown-900">
                    Asisten Virtual BAKUL
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="block h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[10px] text-warm-brown-500 font-bold uppercase">Online / Siap Membantu</span>
                  </div>
                </div>
              </div>

              {/* Chat Bubble Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                  >
                    {/* Small avatar */}
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${msg.sender === 'user'
                        ? 'bg-warm-brown-700 text-warm-brown-50'
                        : 'bg-warm-brown-100 text-warm-brown-700 dark:bg-warm-brown-800 dark:text-warm-brown-300'
                      }`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Landmark size={14} />}
                    </div>

                    <div className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${msg.sender === 'user'
                        ? 'bg-warm-brown-700 text-warm-brown-50 rounded-br-none'
                        : 'bg-warm-brown-100/60 text-warm-brown-900 rounded-bl-none dark:bg-warm-brown-950/40 dark:text-warm-brown-200'
                      }`}>
                      {/* Text content with newlines */}
                      <p className="whitespace-pre-line font-medium">{msg.text}</p>

                      {/* Interactive external link suggestions */}
                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-warm-brown-300 dark:border-warm-brown-850 flex flex-col gap-1.5">
                          {msg.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-warm-brown-700 hover:text-warm-brown-850 hover:underline dark:text-warm-brown-400 dark:hover:text-warm-brown-300"
                            >
                              <CheckCircle2 size={12} className="text-green-500" />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* popular suggestions & input box */}
              <div className="p-4 border-t border-warm-brown-100 dark:border-warm-brown-850 bg-warm-brown-50/50 dark:bg-warm-brown-950/10 space-y-4">

                {/* Popular buttons list */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => triggerBotReply('persyaratan nib', 'Persyaratan NIB')}
                    className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
                  >
                    Syarat NIB
                  </button>
                  <button
                    onClick={() => triggerBotReply('langkah-langkah nib', 'Langkah NIB')}
                    className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
                  >
                    Langkah-Langkah NIB
                  </button>
                  <button
                    onClick={() => triggerBotReply('persyaratan halal', 'Persyaratan Halal')}
                    className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
                  >
                    Syarat Sertifikasi Halal
                  </button>
                  <button
                    onClick={() => triggerBotReply('panduan kbli', 'Panduan KBLI')}
                    className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
                  >
                    Panduan KBLI Usaha
                  </button>
                  <button
                    onClick={() => triggerBotReply('program bantuan umkm', 'Program Bantuan UMKM')}
                    className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
                  >
                    Bantuan Kelurahan
                  </button>
                </div>

                {/* Input action */}
                <form onSubmit={handleCustomChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tanya perihal KBLI, NIB, Halal..."
                    className="flex-1 rounded-xl border border-warm-brown-200 bg-white py-2 px-3.5 text-xs text-warm-brown-900 placeholder-warm-brown-450 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 dark:placeholder-warm-brown-600 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 p-2 text-white shadow-sm transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
