'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { Umkm } from '@/app/utils/mockData';

interface StatsChartsProps {
  data: Umkm[];
}

export default function StatsCharts({ data }: StatsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-warm-brown-700 border-t-transparent"></div>
          <span className="text-sm font-semibold text-warm-brown-600">Memuat Visualisasi Grafik...</span>
        </div>
      </div>
    );
  }

  // 1. Calculate categories data (Horizontal Bar Chart)
  const categoryCounts: { [key: string]: number } = {};
  data.forEach(item => {
    categoryCounts[item.kategori] = (categoryCounts[item.kategori] || 0) + 1;
  });
  
  const barData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  // 2. Calculate NIB data (Pie Chart)
  const nibAlready = data.filter(item => item.status_nib === 'Sudah NIB').length;
  const nibNotYet = data.filter(item => item.status_nib === 'Belum NIB').length;
  const pieData = [
    { name: 'Sudah NIB', value: nibAlready },
    { name: 'Belum NIB', value: nibNotYet }
  ];

  // 3. Calculate Training data (Doughnut Chart)
  const trainedAlready = data.filter(item => item.status_pelatihan === 'Pernah').length;
  const trainedNotYet = data.filter(item => item.status_pelatihan === 'Belum').length;
  const doughnutData = [
    { name: 'Pernah Pelatihan', value: trainedAlready },
    { name: 'Belum Pelatihan', value: trainedNotYet }
  ];

  // Custom Warm-Brown Colors
  const COLORS_CATEGORIES = ['#834f30', '#a1653e', '#b37d4e', '#c99e74', '#eedec8'];
  const COLORS_NIB = ['#15803d', '#b37d4e']; // green-700 & warm-brown-500
  const COLORS_TRAINING = ['#d97706', '#eedec8']; // amber-600 & warm-brown-200

  // Custom Tooltip Renderer
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-warm-brown-200 rounded-xl p-3 shadow-md dark:bg-warm-brown-900 dark:border-warm-brown-850">
          <p className="text-sm font-bold text-warm-brown-900 dark:text-warm-brown-100">{payload[0].name}</p>
          <p className="text-xs font-semibold text-warm-brown-700 dark:text-warm-brown-300 mt-1">
            Jumlah: <span className="text-amber-600 dark:text-amber-500 font-extrabold">{payload[0].value} UMKM</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      
      {/* Horizontal Bar Chart (6 cols) */}
      <div className="lg:col-span-12 xl:col-span-6 bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
            Sebaran UMKM Berdasarkan Kategori Usaha
          </h3>
          <p className="text-xs text-warm-brown-600 dark:text-warm-brown-400 mt-1">
            Visualisasi distribusi volume UMKM untuk masing-masing bidang industri lokal.
          </p>
        </div>
        
        <div className="h-80 mt-6 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={barData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238, 222, 200, 0.2)' }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_CATEGORIES[index % COLORS_CATEGORIES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NIB Pie Chart (6 cols) */}
      <div className="lg:col-span-6 xl:col-span-3 bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
            Kepemilikan NIB
          </h3>
          <p className="text-xs text-warm-brown-600 dark:text-warm-brown-400 mt-1">
            Rasio kelengkapan berkas Nomor Induk Berusaha (NIB) terdata.
          </p>
        </div>

        <div className="h-64 mt-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_NIB[index % COLORS_NIB.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Training Doughnut Chart (6 cols) */}
      <div className="lg:col-span-6 xl:col-span-3 bg-white border border-warm-brown-200 rounded-3xl p-6 shadow-sm dark:bg-warm-brown-900 dark:border-warm-brown-850 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-warm-brown-900 dark:text-warm-brown-100">
            Partisipasi Pelatihan
          </h3>
          <p className="text-xs text-warm-brown-600 dark:text-warm-brown-400 mt-1">
            Persentase pelaku usaha yang pernah mengikuti pembinaan kelurahan.
          </p>
        </div>

        <div className="h-64 mt-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={doughnutData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={55}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {doughnutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_TRAINING[index % COLORS_TRAINING.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
