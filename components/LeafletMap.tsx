'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Umkm } from '@/app/utils/mockData';

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
const culinaryIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const otherIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
          const isCulinary = umkm.kategori === 'Kuliner';
          const isSelected = umkm.id === selectedId;
          const pos: [number, number] = [umkm.latitude, umkm.longitude];
          
          return (
            <Marker 
              key={umkm.id} 
              position={pos}
              icon={isCulinary ? culinaryIcon : otherIcon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-warm-brown-100 dark:bg-warm-brown-800 text-warm-brown-800 dark:text-warm-brown-200">
                      {umkm.kategori}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      umkm.status_nib === 'Sudah NIB' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' 
                        : 'bg-warm-brown-100 text-warm-brown-800 dark:bg-warm-brown-950/40 dark:text-warm-brown-300'
                    }`}>
                      {umkm.status_nib}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-sm text-warm-brown-900 dark:text-warm-brown-100 mt-2 leading-snug">
                    {umkm.nama_usaha}
                  </h4>
                  <p className="text-xs text-warm-brown-600 dark:text-warm-brown-400 mt-0.5 font-semibold">
                    Pemilik: {umkm.nama}
                  </p>
                  <p className="text-xs text-warm-brown-750 dark:text-warm-brown-300 mt-1 leading-normal border-t border-warm-brown-100/60 pt-1.5 dark:border-warm-brown-800/60">
                    Produk: {umkm.produk}
                  </p>
                  <p className="text-[10px] text-warm-brown-500 dark:text-warm-brown-450 mt-1">
                    {umkm.alamat} (RT {umkm.rt} / RW {umkm.rw})
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
