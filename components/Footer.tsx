'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store, Mail, Phone, MapPin, Heart, ArrowUp, Info, HelpCircle
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      )
    },
    {
      label: 'Website Kelurahan',
      href: '#',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="w-full border-t border-warm-brown-200/60 bg-gradient-to-b from-warm-brown-50 to-warm-brown-100/90 text-warm-brown-900 transition-colors duration-300 dark:border-warm-brown-850/50 dark:from-warm-brown-950 dark:to-warm-brown-950/95 dark:text-warm-brown-100">

      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-warm-brown-500 via-warm-brown-700 to-warm-brown-600"></div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">

          {/* Column 1: Brand & Logo */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warm-brown-700 text-warm-brown-50 shadow-md group-hover:bg-warm-brown-850 dark:bg-warm-brown-800 dark:group-hover:bg-warm-brown-700 transition-all duration-300 transform group-hover:rotate-6">
                <Store size={24} />
              </div>
              <div>
                <span className="block text-base font-bold tracking-wider text-warm-brown-900 dark:text-warm-brown-100 uppercase">
                  BAKUL PELAK
                </span>
                <span className="block text-[11px] text-warm-brown-550 dark:text-warm-brown-400 font-medium leading-none">
                  Bantu Kelola Usaha Lokal
                </span>
              </div>
            </Link>
            <p className="text-sm text-warm-brown-600 dark:text-warm-brown-300 leading-relaxed">
              Platform digital yang menyediakan dashboard statistik, portal pelayanan publik, dan pemetaan interaktif untuk mendukung pengelolaan data UMKM melalui Platform Ekonomi Lokal dan Administrasi Kolaboratif.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => {
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-brown-100 text-warm-brown-700 hover:bg-warm-brown-700 hover:text-warm-brown-50 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800 dark:hover:text-warm-brown-100 transition-all duration-300 shadow-sm"
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-warm-brown-800 dark:text-warm-brown-200">
              Peta Situs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Statistik UMKM', href: '/statistik' },
                { name: 'Peta Sebaran', href: '/peta' },
                { name: 'Layanan Publik', href: '/publik' },
                { name: 'Monitoring Desil', href: '/monitoring' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-brown-600 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:text-warm-brown-100 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-warm-brown-400 group-hover:bg-warm-brown-700 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Info / Support */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-warm-brown-800 dark:text-warm-brown-200">
              Layanan Publik
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Pendaftaran NIB', href: 'https://oss.go.id', external: true },
                { name: 'Sertifikasi Halal Gratis', href: 'https://ptsp.halal.go.id', external: true },
                { name: 'Dinas Koperasi & UMKM', href: '#', external: false },
                { name: 'Panduan Usaha Lokal', href: '/publik#panduan', external: false },
                { name: 'Bantuan Kredit Mesra', href: '#', external: false }
              ].map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-brown-600 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:text-warm-brown-100 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <HelpCircle size={14} className="text-warm-brown-400" />
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-warm-brown-600 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:text-warm-brown-100 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <Info size={14} className="text-warm-brown-400" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-warm-brown-800 dark:text-warm-brown-200">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm text-warm-brown-600 dark:text-warm-brown-300">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="mt-0.5 text-warm-brown-500 shrink-0" />
                <span>Jl. Siliwangi & KHZ Mustofa, Wilayah Tawang & Cihideung, Kota Tasikmalaya, Jawa Barat 46115</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-warm-brown-500 shrink-0" />
                <span>+62 265 123456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-warm-brown-500 shrink-0" />
                <span>umkm.tasikmalaya@tasikmalayakota.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-8 border-warm-brown-200/60 dark:border-warm-brown-850/40" />

        {/* Bottom Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-warm-brown-550 dark:text-warm-brown-400">
              &copy; {currentYear} <strong>BAKUL PELAK</strong>. Semua hak cipta dilindungi.
            </p>
            <p className="text-[10px] text-warm-brown-450 dark:text-warm-brown-500 mt-1">
              Pemerintah Kota Tasikmalaya (Kecamatan Tawang & Cihideung)
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Made with love */}
            <div className="flex items-center gap-1.5 text-xs text-warm-brown-600 dark:text-warm-brown-400">
              <span>Dibuat dengan</span>
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>untuk kemajuan Ekonomi Lokal</span>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-brown-200 text-warm-brown-700 hover:bg-warm-brown-700 hover:text-warm-brown-50 dark:bg-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-800 dark:hover:text-warm-brown-100 transition-all duration-300 shadow-sm"
              title="Kembali ke Atas"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
