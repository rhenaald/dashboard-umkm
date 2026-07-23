'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, X, Store, BarChart3, MapPin, Landmark, ShieldCheck, Sliders, LogIn, LogOut } from 'lucide-react';

// Isolated search component that uses searchParams
function NavbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with URL search param
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    // Update the URL without jumping scroll
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-xs relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4.5 w-4.5 text-warm-brown-450 dark:text-warm-brown-500" />
      </div>
      <input
        type="text"
        placeholder="Cari UMKM / produk..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-1.5 pl-9 pr-4 text-sm text-warm-brown-900 placeholder-warm-brown-450 focus:border-warm-brown-600 focus:bg-white focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-900/50 dark:text-warm-brown-150 dark:placeholder-warm-brown-600 dark:focus:border-warm-brown-500 dark:focus:bg-warm-brown-900 transition-all duration-300 shadow-inner"
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.isAuthenticated);
        }
      } catch (err) {
        console.error('Error fetching auth status:', err);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthenticated(false);
        router.push('/');
        router.refresh();
      } else {
        alert('Gagal keluar.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Store },
    { name: 'Statistik', href: '/statistik', icon: BarChart3 },
    { name: 'Pemetaan', href: '/peta', icon: MapPin },
    { name: 'Layanan Publik', href: '/publik', icon: Landmark },
    { name: 'Monitoring Desil', href: '/monitoring', icon: ShieldCheck },
    { name: 'Kelola Data', href: '/admin', icon: Sliders },
  ];

  // Filter links based on authentication status to hide admin links from public users
  const visibleLinks = navLinks.filter((link) => {
    if (link.href === '/admin' || link.href === '/monitoring') {
      return isAuthenticated;
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-warm-brown-200/50 bg-warm-brown-50/85 backdrop-blur-md dark:border-warm-brown-850/30 dark:bg-warm-brown-950/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-brown-700 text-warm-brown-50 shadow-md group-hover:bg-warm-brown-800 transition-all duration-300">
                <Store size={22} className="animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="block text-sm font-bold tracking-wider text-warm-brown-900 dark:text-warm-brown-100 uppercase">
                  BAKUL PELAK
                </span>
                <span className="block text-[10px] text-warm-brown-500 dark:text-warm-brown-400 -mt-1 font-medium">
                  Bantu Kelola Usaha Lokal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-warm-brown-700 text-warm-brown-50'
                    : 'text-warm-brown-700 hover:bg-warm-brown-100 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-900 dark:hover:text-warm-brown-100'
                    }`}
                >
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Search Box wrapped in Suspense boundary */}
          <Suspense fallback={
            <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-xs h-8 bg-warm-brown-100/50 rounded-xl dark:bg-warm-brown-900/30 animate-pulse"></div>
          }>
            <NavbarSearch />
          </Suspense>

          {/* Premium Auth Action Button (Desktop) */}
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 cursor-pointer transition-all duration-200"
              >
                <LogOut size={16} />
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-warm-brown-700 hover:bg-warm-brown-100 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-900 dark:hover:text-warm-brown-100"
              >
                <LogIn size={16} />
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-warm-brown-700 hover:bg-warm-brown-100 hover:text-warm-brown-900 focus:outline-none dark:text-warm-brown-300 dark:hover:bg-warm-brown-900 dark:hover:text-warm-brown-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1 bg-warm-brown-50/95 dark:bg-warm-brown-950/95 border-b border-warm-brown-200 dark:border-warm-brown-900 animate-fadeIn">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${isActive
                  ? 'bg-warm-brown-750 text-warm-brown-50'
                  : 'text-warm-brown-750 hover:bg-warm-brown-100 dark:text-warm-brown-250 dark:hover:bg-warm-brown-900'
                  }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Auth Button */}
          <div className="border-t border-warm-brown-200/50 dark:border-warm-brown-850/50 mt-2 pt-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <LogOut size={18} />
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-bold text-warm-brown-750 hover:bg-warm-brown-100 dark:text-warm-brown-250 dark:hover:bg-warm-brown-900"
              >
                <LogIn size={18} />
                Masuk Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

