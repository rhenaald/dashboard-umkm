import React from 'react';
import { getAllUmkm } from '@/app/utils/db';
import StatsCharts from '@/components/StatsCharts';
import { Store, ShieldCheck, GraduationCap, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Dashboard Statistik UMKM - BAKUL PELAK',
  description: 'Informasi visual grafik sebaran UMKM, status kepemilikan NIB, dan tingkat pelatihan pelaku usaha.',
};

export default async function StatistikPage() {
  const allUmkm = await getAllUmkm();
  const totalUmkm = allUmkm.length;

  // Calculate most common category
  const categoriesMap: { [key: string]: number } = {};
  allUmkm.forEach(item => {
    categoriesMap[item.kategori] = (categoriesMap[item.kategori] || 0) + 1;
  });

  let topCategory = 'N/A';
  let topCategoryCount = 0;
  Object.entries(categoriesMap).forEach(([cat, val]) => {
    if (val > topCategoryCount) {
      topCategoryCount = val;
      topCategory = cat;
    }
  });

  // Calculate NIB ownership count
  const totalNib = allUmkm.filter(item => item.status_nib === 'Sudah NIB').length;

  // Calculate trained owners count
  const totalTrained = allUmkm.filter(item => item.status_pelatihan === 'Pernah').length;

  // KPI card configuration
  const kpiCards = [
    {
      title: 'Total UMKM Terdata',
      value: totalUmkm,
      desc: 'Usaha mikro, kecil, dan menengah',
      icon: Store,
      colorClass: 'bg-white text-warm-brown-950 border border-warm-brown-200',
      iconColorClass: 'bg-warm-brown-100 text-warm-brown-700',
    },
    {
      title: 'Kategori Usaha Dominan',
      value: topCategory,
      desc: `${topCategoryCount} usaha di bidang ini`,
      icon: TrendingUp,
      colorClass: 'bg-white text-warm-brown-950 border border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 dark:text-warm-brown-50',
      iconColorClass: 'bg-warm-brown-100 text-warm-brown-700 dark:bg-warm-brown-900 dark:text-warm-brown-300',
    },
    {
      title: 'UMKM Ber-NIB',
      value: totalNib,
      desc: `${Math.round((totalNib / (totalUmkm || 1)) * 100)}% dari total usaha`,
      icon: ShieldCheck,
      colorClass: 'bg-white text-warm-brown-950 border border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 dark:text-warm-brown-50',
      iconColorClass: 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400',
    },
    {
      title: 'Peserta Pelatihan',
      value: totalTrained,
      desc: `${Math.round((totalTrained / (totalUmkm || 1)) * 100)}% pelaku usaha terlatih`,
      icon: GraduationCap,
      colorClass: 'bg-white text-warm-brown-950 border border-warm-brown-200 dark:bg-warm-brown-900 dark:border-warm-brown-850 dark:text-warm-brown-50',
      iconColorClass: 'bg-warm-brown-100 text-warm-brown-700 dark:bg-warm-brown-900 dark:text-warm-brown-300',
    },
  ];

  return (
    <div className="flex-1 bg-white py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b border-warm-brown-200 pb-5 dark:border-warm-brown-850">
          <span className="text-xs font-bold uppercase tracking-wider text-warm-brown-550 dark:text-warm-brown-400">
            Analisis Data Terpadu
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-warm-brown-900 dark:text-warm-brown-100 sm:text-4xl">
            Statistik Pertumbuhan Ekonomi Lokal
          </h1>
          <p className="mt-2 text-sm text-warm-brown-600 dark:text-warm-brown-400">
            Pemantauan transparan sebaran kategori usaha, status legalitas perizinan, dan kepesertaan pelatihan UMKM Kelurahan Kahuripan.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className={`rounded-3xl p-6 shadow-sm flex items-start gap-4 transition-all duration-300 hover:shadow-md ${card.colorClass}`}
              >
                <div className={`p-3 rounded-2xl ${card.iconColorClass}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold opacity-75 uppercase tracking-wider">{card.title}</p>
                  <p className="text-2xl font-black mt-1 leading-none">{card.value}</p>
                  <p className="text-xs mt-2 opacity-80 leading-normal font-medium">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recharts Analytics Area */}
        <div className="mt-10">
          <StatsCharts data={allUmkm} />
        </div>

      </div>
    </div>
  );
}
