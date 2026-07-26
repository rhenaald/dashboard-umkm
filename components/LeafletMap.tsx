'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Umkm } from '@/app/types/umkm';

// Fix Leaflet marker icon asset resolution bug in Next.js
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIconRetina.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for specific categories
const kulinerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const jasaIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const fesyenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const kerajinanIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const perdaganganIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getCategoryIcon(kategori: string) {
  const cat = (kategori || '').toLowerCase();
  if (cat.includes('kuliner')) return kulinerIcon;
  if (cat.includes('jasa')) return jasaIcon;
  if (cat.includes('fesyen') || cat.includes('fashion')) return fesyenIcon;
  if (cat.includes('kerajinan')) return kerajinanIcon;
  return perdaganganIcon;
}

interface LeafletMapProps {
  umkmList: Umkm[];
  activeCenter: [number, number];
  activeZoom: number;
  selectedId: number | null;
}

// Controller component to dynamically pan/zoom map view
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ umkmList, activeCenter, activeZoom, selectedId }: LeafletMapProps) {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-warm-brown-200 dark:border-warm-brown-850 shadow-md">
      <MapContainer 
        center={activeCenter} 
        zoom={activeZoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map Controller for Programmatic Pan/Zoom */}
        <MapController center={activeCenter} zoom={activeZoom} />

        {/* Render Markers */}
        {umkmList.map((umkm) => {
          const icon = getCategoryIcon(umkm.kategori);
          const pos: [number, number] = [umkm.latitude, umkm.longitude];
          
          return (
            <Marker 
              key={umkm.id} 
              position={pos}
              icon={icon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-warm-brown-100 dark:bg-warm-brown-800 text-warm-brown-800 dark:text-warm-brown-200">
                      {umkm.kategori || 'Usaha'}
                    </span>
                    {umkm.status_nib && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        umkm.status_nib === 'Sudah NIB' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' 
                          : 'bg-warm-brown-100 text-warm-brown-800 dark:bg-warm-brown-950/40 dark:text-warm-brown-300'
                      }`}>
                        {umkm.status_nib}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-sm text-warm-brown-900 dark:text-warm-brown-100 mt-2 leading-snug">
                    {umkm.nama_usaha}
                  </h4>
                  {umkm.produk && (
                    <p className="text-xs text-warm-brown-750 dark:text-warm-brown-300 mt-1 leading-normal border-t border-warm-brown-100/60 pt-1.5 dark:border-warm-brown-800/60">
                      Produk: {umkm.produk}
                    </p>
                  )}
                  {umkm.alamat && (
                    <p className="text-[10px] text-warm-brown-500 dark:text-warm-brown-450 mt-1">
                      {umkm.alamat} {umkm.rt && umkm.rw ? `(RT ${umkm.rt} / RW ${umkm.rw})` : ''}
                    </p>
                  )}

                  {umkm.url && (
                    <a
                      href={umkm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center justify-center gap-1 w-full rounded-xl bg-warm-brown-700 hover:bg-warm-brown-800 text-white text-[11px] font-bold py-1.5 px-2.5 transition-colors shadow-sm no-underline"
                    >
                      <span>📍 Buka di Google Maps</span>
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
