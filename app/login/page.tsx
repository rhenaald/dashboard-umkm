'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redirect to admin panel
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Username atau password salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-warm-brown-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-warm-brown-950 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white border border-warm-brown-200/80 p-8 sm:p-10 rounded-3xl shadow-xl dark:bg-warm-brown-900 dark:border-warm-brown-850">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-brown-700 text-warm-brown-50 shadow-md">
            <Store size={28} />
          </div>
          <h2 className="mt-6 text-2xl font-black tracking-wide text-warm-brown-900 dark:text-warm-brown-100 uppercase">
            BAKUL PELAK
          </h2>
          <p className="mt-1 text-xs text-warm-brown-600 dark:text-warm-brown-400 font-bold uppercase tracking-wider">
            Admin Panel Authentication
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 p-3.5 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
              <div className="font-bold">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1.5 dark:text-warm-brown-455">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown-450">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2.5 pl-10 pr-4 text-xs font-medium text-warm-brown-900 placeholder-warm-brown-400 focus:border-warm-brown-650 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200 dark:placeholder-warm-brown-600 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-brown-600 uppercase tracking-wider mb-1.5 dark:text-warm-brown-455">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown-450">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  className="w-full rounded-xl border border-warm-brown-200 bg-white/70 py-2.5 pl-10 pr-4 text-xs font-medium text-warm-brown-900 placeholder-warm-brown-400 focus:border-warm-brown-650 focus:outline-none dark:border-warm-brown-800 dark:bg-warm-brown-950 dark:text-warm-brown-200 dark:placeholder-warm-brown-600 shadow-inner"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full rounded-2xl bg-warm-brown-700 hover:bg-warm-brown-800 py-3 px-4 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Memproses Masuk...
                </>
              ) : (
                <>
                  Masuk Panel Admin
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-[11px] font-bold text-warm-brown-600 hover:text-warm-brown-800 dark:text-warm-brown-400 dark:hover:text-warm-brown-300 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>

      </div>
    </div>
  );
}
