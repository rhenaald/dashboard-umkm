import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VirtualAssistant from "@/components/VirtualAssistant";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "BAKUL KAHURIPAN - Dashboard & Portal UMKM Kelurahan Kahuripan",
  description: "Bantu Kelola Usaha Lokal (BAKUL KAHURIPAN) - Portal digital, pemetaan interaktif, monitoring desil, dan statistik UMKM Kelurahan Kahuripan, Kecamatan Tawang, Kota Tasikmalaya.",
  keywords: ["UMKM", "Kahuripan", "Tasikmalaya", "Tawang", "Dashboard UMKM", "Pemetaan UMKM", "Desil UMKM", "NIB", "Sertifikasi Halal"],
  authors: [{ name: "Pemerintah Kelurahan Kahuripan" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-white text-warm-brown-950 transition-colors duration-300">
        <Suspense fallback={<div className="h-16 bg-white border-b border-warm-brown-200/50"></div>}>
          <Navbar />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Premium Footer */}
        <Footer />
        <VirtualAssistant />
      </body>
    </html>
  );
}
