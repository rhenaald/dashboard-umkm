import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VirtualAssistant from "@/components/VirtualAssistant";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "BAKUL PELAK - Platform Ekonomi Lokal & Administrasi Kolaboratif",
  description: "BAKUL PELAK (Bantu Kelola Usaha Lokal melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif) merupakan platform digital yang menyediakan dashboard statistik, portal pelayanan publik, dan pemetaan interaktif untuk mendukung pengelolaan data UMKM di berbagai wilayah. Sistem ini dirancang untuk mempermudah pemerintah daerah, pelaku UMKM, dan masyarakat dalam mengakses informasi, mengelola data, serta mendukung pengambilan keputusan berbasis data secara terintegrasi dan kolaboratif.",
  keywords: ["UMKM", "BAKUL PELAK", "Ekonomi Lokal", "Administrasi Kolaboratif", "Dashboard UMKM", "Pemetaan UMKM", "Desil UMKM", "NIB", "Sertifikasi Halal"],
  authors: [{ name: "Platform BAKUL PELAK" }],
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
