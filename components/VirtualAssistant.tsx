'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, User, Landmark, CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  links?: { label: string; url: string }[];
}

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
    text: 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) menentukan kode aktivitas ekonomi usaha Anda. Contoh kode populer di Kahuripan:\n- 56101: Kedai Makanan (Bakso, Warung Nasi)\n- 13921: Kerajinan Bordir Tasik\n- 16292: Kerajinan Kelom Geulis & Kerajinan Kayu\n- 47711: Toko Pakaian / Jilbab\n\nGunakan kotak pencarian KBLI di halaman Layanan Publik untuk mencari kode bidang usaha Anda secara spesifik!',
  },
  'program bantuan umkm': {
    text: 'Kelurahan Kahuripan dan Dinas Koperasi, UMKM & Perindustrian Kota Tasikmalaya menyediakan berbagai program bantuan tahun 2026:\n1. Fasilitasi Pembuatan Sertifikat Halal Massal (SEHATI).\n2. Pelatihan Pemasaran Digital & Ekspor Kelom Geulis (Agustus 2026).\n3. Program Permodalan Tanpa Jaminan "Kredit Mesra" Bank BJB.\n\nHubungi Sekretariat Kelurahan untuk pendaftaran bantuan aktif!',
    links: [{ label: 'Layanan Bantuan BJB Mesra', url: 'https://bankbjb.co.id/personal/kredit-mesra' }]
  }
};

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Sampurasun! Saya Asisten BAKUL, asisten virtual kelurahan Kahuripan. Ada yang bisa saya bantu terkait perizinan, sertifikasi halal, atau program UMKM?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll Chat to Bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[80vh] bg-white border border-warm-brown-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 dark:bg-warm-brown-900 dark:border-warm-brown-850 animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Chat Header */}
          <div className="bg-warm-brown-100 p-4 text-warm-brown-900 border-b border-warm-brown-200 flex items-center justify-between dark:bg-warm-brown-950 dark:border-warm-brown-850">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warm-brown-200 flex items-center justify-center border border-warm-brown-300 text-warm-brown-700 shadow-inner dark:bg-warm-brown-900 dark:border-warm-brown-800 dark:text-warm-brown-300">
                <MessageSquare size={22} className="text-warm-brown-600 animate-pulse dark:text-warm-brown-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide text-warm-brown-900 dark:text-warm-brown-100">
                  Asisten Virtual BAKUL
                </h3>
                <div className="flex items-center gap-1">
                  <span className="block h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] text-warm-brown-500 font-bold uppercase dark:text-warm-brown-400">Online</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-warm-brown-500 hover:text-warm-brown-700 p-1.5 rounded-lg hover:bg-warm-brown-200 transition-colors dark:text-warm-brown-400 dark:hover:text-warm-brown-300 dark:hover:bg-warm-brown-800"
              aria-label="Tutup asisten virtual"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Bubbles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-warm-brown-900">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-warm-brown-700 text-warm-brown-50'
                    : 'bg-warm-brown-100 text-warm-brown-700 dark:bg-warm-brown-800 dark:text-warm-brown-300'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Landmark size={14} />}
                </div>

                <div className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-warm-brown-700 text-warm-brown-50 rounded-br-none'
                    : 'bg-warm-brown-100/60 text-warm-brown-900 rounded-bl-none dark:bg-warm-brown-950/40 dark:text-warm-brown-200'
                }`}>
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-dashed border-warm-brown-300 dark:border-warm-brown-850 flex flex-col gap-1.5">
                      {msg.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-warm-brown-700 hover:text-warm-brown-850 hover:underline dark:text-warm-brown-450 dark:hover:text-warm-brown-300"
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

          {/* Quick suggestions & Input */}
          <div className="p-4 border-t border-warm-brown-100 dark:border-warm-brown-850 bg-warm-brown-50/50 dark:bg-warm-brown-950/10 space-y-3">
            
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
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
                Langkah NIB
              </button>
              <button
                onClick={() => triggerBotReply('persyaratan halal', 'Persyaratan Halal')}
                className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
              >
                Syarat Halal
              </button>
              <button
                onClick={() => triggerBotReply('panduan kbli', 'Panduan KBLI')}
                className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
              >
                Panduan KBLI
              </button>
              <button
                onClick={() => triggerBotReply('program bantuan umkm', 'Program Bantuan UMKM')}
                className="rounded-lg border border-warm-brown-200 bg-white px-2.5 py-1 text-[10px] font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-350 dark:hover:bg-warm-brown-800 shadow-sm"
              >
                Bantuan
              </button>
            </div>

            {/* Form Input */}
            <form onSubmit={handleCustomChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya perihal KBLI, NIB, Halal..."
                className="flex-1 rounded-xl border border-warm-brown-200 bg-white py-1.5 px-3 text-xs text-warm-brown-900 placeholder-warm-brown-450 focus:border-warm-brown-600 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900 dark:text-warm-brown-250 dark:placeholder-warm-brown-600 shadow-inner"
              />
              <button
                type="submit"
                className="rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 p-2 text-white shadow-sm transition-colors flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-warm-brown-700 hover:bg-warm-brown-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-bounce-short"
        aria-label="Tanya Asisten Virtual BAKUL"
      >
        <span className="absolute right-16 bg-warm-brown-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-warm-brown-950">
          Tanya Asisten BAKUL
        </span>
        {isOpen ? (
          <X size={24} className="animate-in spin-in-90 duration-200" />
        ) : (
          <MessageSquare size={24} className="animate-in zoom-in duration-200" />
        )}
      </button>
    </div>
  );
}
