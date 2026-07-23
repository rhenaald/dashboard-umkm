import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/app/lib/gemini";
import { getAllUmkm } from "@/app/utils/db";

// Smart local fallback engine querying database records directly
function generateLocalFallbackResponse(query: string, umkmList: any[]): string {
    const q = (query || "").toLowerCase().trim();

    // 1. Definition of UMKM
    if (q.includes("apa itu umkm") || q === "umkm" || q.includes("pengertian umkm") || q.includes("jelaskan umkm")) {
        return `Sampurasun! **UMKM (Usaha Mikro, Kecil, dan Menengah)** adalah kegiatan usaha ekonomi produktif yang dijalankan oleh perorangan maupun badan usaha skala mikro hingga menengah.

Di Kota Tasikmalaya (khususnya Kecamatan Tawang & Cihideung), UMKM menjadi pilar utama ekonomi lokal, meliputi industri kerajinan bordir, kelom geulis, mebel, hingga aneka kuliner khas.

Platform **BAKUL PELAK** hadir untuk mempermudah pendataan, pemetaan lokasi, perizinan NIB, dan sertifikasi halal secara terpadu.`;
    }

    // 2. Definition of BAKUL PELAK
    if (q.includes("bakul pelak") || q.includes("apa itu bakul") || q.includes("fungsi bakul") || q.includes("aplikasi ini")) {
        return `**BAKUL PELAK** (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif) adalah platform digital resmi di Kota Tasikmalaya.

Fitur Utama BAKUL PELAK:
1. **Pemetaan Interaktif (WebGIS)**: Menampilkan posisi spasial lokasi UMKM.
2. **Dashboard Statistik**: Pemantauan status Desil, NIB, & Pelatihan.
3. **Layanan Publik**: Panduan mandiri NIB & Sertifikasi Halal.
4. **Asisten Virtual AI**: Layanan konsultasi cepat 24 jam.`;
    }

    // 3. Location & Top List Queries (e.g. Cihideung / Tawang / Top 10 / Daftar UMKM)
    if (
        q.includes("cihideung") ||
        q.includes("tawang") ||
        q.includes("top") ||
        q.includes("daftar") ||
        q.includes("list") ||
        q.includes("rekomendasi") ||
        q.includes("mana aja")
    ) {
        let filtered = umkmList;
        let label = "Terdaftar";

        if (q.includes("cihideung")) {
            filtered = umkmList.filter(
                (u) =>
                    u.kecamatan?.toLowerCase().includes("cihideung") ||
                    u.alamat?.toLowerCase().includes("cihideung")
            );
            label = "di Kecamatan Cihideung";
        } else if (q.includes("tawang")) {
            filtered = umkmList.filter(
                (u) =>
                    u.kecamatan?.toLowerCase().includes("tawang") ||
                    u.alamat?.toLowerCase().includes("tawang")
            );
            label = "di Kecamatan Tawang";
        }

        if (filtered.length === 0) filtered = umkmList;

        const topList = filtered.slice(0, 10);
        const listText = topList
            .map(
                (u, i) =>
                    `${i + 1}. **${u.nama_usaha}** (${u.kategori || "UMKM"})
   • Pemilik: ${u.nama || "-"}
   • Produk: ${u.produk || "-"}
   • Alamat: ${u.alamat || "-"} (Kec. ${u.kecamatan || "Tawang"})
   • Status NIB: ${u.status_nib || "Belum NIB"}`
            )
            .join("\n\n");

        return `Berikut daftar **10 UMKM ${label}** yang terdaftar di database BAKUL PELAK:\n\n${listText}\n\n*Total terdaftar ${label}: ${filtered.length} UMKM.*`;
    }

    // 4. Search by Category or Product Keyword
    const categories = ["makanan", "kuliner", "minuman", "bordir", "kerajinan", "jasa", "fashion", "pakaian", "mebel", "kayu", "foto", "studio"];
    const matchedCat = categories.find((c) => q.includes(c));
    if (matchedCat) {
        const filtered = umkmList.filter(
            (u) =>
                u.kategori?.toLowerCase().includes(matchedCat) ||
                u.produk?.toLowerCase().includes(matchedCat) ||
                u.nama_usaha?.toLowerCase().includes(matchedCat)
        );

        if (filtered.length > 0) {
            const topList = filtered.slice(0, 8);
            const listText = topList
                .map(
                    (u, i) =>
                        `${i + 1}. **${u.nama_usaha}**
   • Produk: ${u.produk || "-"}
   • Alamat: ${u.alamat || "-"}
   • Status NIB: ${u.status_nib || "Belum NIB"}`
                )
                .join("\n\n");

            return `Ditemukan **${filtered.length} UMKM** kategori/produk **${matchedCat.toUpperCase()}** di database:\n\n${listText}`;
        }
    }

    // 5. NIB Query
    if (q.includes("nib") || q.includes("oss") || q.includes("izin")) {
        const sudahNib = umkmList.filter((u) => u.status_nib?.toLowerCase().includes("sudah")).length;
        return `Untuk pendaftaran **NIB (Nomor Induk Berusaha)** mikro/kecil gratis 100% secara online:\n
1. Buka portal resmi OSS RBA di **https://oss.go.id**
2. Siapkan NIK KTP, Email aktif, & No WhatsApp.
3. Login & isi data usaha sesuai kode KBLI.
4. Klik **Terbitkan NIB** dan unduh file perizinan PDF.

*Data Real-Time BAKUL PELAK: Terdapat **${sudahNib} dari ${umkmList.length} UMKM** yang telah memiliki NIB.*`;
    }

    // 6. Halal Query
    if (q.includes("halal") || q.includes("sehati") || q.includes("sihalal")) {
        return `Untuk pendaftaran **Sertifikasi Halal Gratis (Program SEHATI BPJPH)**:\n
1. Buka portal **https://ptsp.halal.go.id**
2. Pastikan usaha Anda sudah memiliki **NIB Aktif**.
3. Pastikan bahan baku produk halal & proses pengolahan bersih/higienis.
4. Ajukan pendampingan Proses Produk Halal (PPH).`;
    }

    // 7. Fallback Response with DB Stats
    const total = umkmList.length;
    const sudahNib = umkmList.filter((u) => u.status_nib?.toLowerCase().includes("sudah")).length;

    return `Sampurasun! Saya Asisten Virtual BAKUL PELAK.

Ringkasan Data Database:
• Total Terdaftar: **${total} UMKM**
• Sudah Punya NIB: **${sudahNib} UMKM**
• Belum NIB: **${total - sudahNib} UMKM**

Anda dapat menanyakan:
- *"Apa itu UMKM?"*
- *"Daftar UMKM di Cihideung"*
- *"Persyaratan NIB & Halal"*
- *"Rekomendasi UMKM kuliner / bordir"*`;
}

export async function POST(req: NextRequest) {
    let umkmList: any[] = [];
    try {
        umkmList = await getAllUmkm();
    } catch (dbErr) {
        console.error("Database fetch error:", dbErr);
    }

    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { reply: "Mohon masukkan pertanyaan yang valid." },
                { status: 400 }
            );
        }

        // Attempt Gemini AI if key is configured
        if (process.env.GEMINI_API_KEY) {
            const totalUmkm = umkmList.length;
            const sudahNib = umkmList.filter((u) =>
                u.status_nib?.toLowerCase().includes("sudah")
            ).length;

            const sampleUmkmList = umkmList
                .slice(0, 15)
                .map(
                    (u) =>
                        `• ${u.nama_usaha} (Pemilik: ${u.nama || "-"}, Kategori: ${u.kategori}, Produk: ${u.produk || "-"}, Alamat: ${u.alamat || "-"}, Kec: ${u.kecamatan || "Tawang"}, Status NIB: ${u.status_nib})`
                )
                .join("\n");

            const systemPrompt = `Anda adalah "Asisten Virtual BAKUL PELAK", AI pintar pendamping platform BAKUL PELAK Kota Tasikmalaya.

PERAN & GAYA BAHASA:
- Gunakan bahasa Indonesia yang ramah, santun, dan informatif.
- Sapa pengguna dengan "Sampurasun!" atau "Halo!".

DATA REAL-TIME UMKM DATABASE BAKUL PELAK:
- Total Terdaftar: ${totalUmkm} UMKM
- Memiliki NIB: ${sudahNib} | Belum NIB: ${totalUmkm - sudahNib}
- Contoh Daftar UMKM Terdaftar:
${sampleUmkmList}

Pertanyaan User: "${message}"`;

            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: systemPrompt,
                });
                if (response && response.text) {
                    return NextResponse.json({ reply: response.text });
                }
            } catch (geminiError) {
                console.warn("Gemini API call failed, switching to local database search fallback:", geminiError);
            }
        }

        // Local Database Search Fallback
        const fallbackReply = generateLocalFallbackResponse(message, umkmList);
        return NextResponse.json({ reply: fallbackReply });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        const fallbackReply = generateLocalFallbackResponse("", umkmList);
        return NextResponse.json({ reply: fallbackReply });
    }
}

// =========================================================================
// ALTERNATIVE: PostgreSQL Direct pg pool implementation (Commented Out)
// =========================================================================
//
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// import { Pool } from "pg";
//
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//
// const tools = [
//     {
//         functionDeclarations: [
//             {
//                 name: "searchUMKM",
//                 description: "Mencari daftar UMKM berdasarkan kategori/jenis usaha...",
//                 parameters: {
//                     type: SchemaType.OBJECT,
//                     properties: {
//                         kategori: { type: SchemaType.STRING },
//                         kecamatan: { type: SchemaType.STRING },
//                         limit: { type: SchemaType.NUMBER }
//                     }
//                 }
//             }
//         ]
//     }
// ];
//
// export async function POST_ALTERNATIVE(req) { ... }