import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Heart } from "lucide-react";
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
      <body className="min-h-full flex flex-col bg-warm-brown-50 text-warm-brown-950 dark:bg-warm-brown-950 dark:text-warm-brown-50 transition-colors duration-300">
        <Suspense fallback={<div className="h-16 bg-warm-brown-50 dark:bg-warm-brown-950 border-b border-warm-brown-200/50"></div>}>
          <Navbar />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="w-full border-t border-warm-brown-200 bg-warm-brown-100 py-6 dark:border-warm-brown-900 dark:bg-warm-brown-900/60 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold tracking-wide text-warm-brown-800 dark:text-warm-brown-200">
                  BAKUL KAHURIPAN
                </p>
                <p className="text-xs text-warm-brown-600 dark:text-warm-brown-400">
                  Bantu Kelola Usaha Lokal Kelurahan Kahuripan, Kecamatan Tawang, Kota Tasikmalaya
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-warm-brown-600 dark:text-warm-brown-400">
                <span>Dibuat dengan</span>
                <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                <span>untuk kemajuan Ekonomi Lokal &copy; {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
