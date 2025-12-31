"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Cafe {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  wifi_status: string;
  socket_status: string;
  photos: { file_path: string }[];
}

interface MapProps {
  cafes: Cafe[];
  userLocation?: [number, number] | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function Map({ cafes, userLocation, center, zoom, className }: MapProps) {
  // Hapus state internal cafes dan useEffect fetch
  // Gunakan props cafes langsung

  return (
    <MapContainer
      center={center || userLocation || [-6.200000, 106.816666]} 
      zoom={zoom || 13}
      scrollWheelZoom={true}
      className={className}
      style={{ height: "100%", width: "100%", minHeight: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Marker User Location */}
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Lokasi Kamu</Popup>
        </Marker>
      )}
      
      {cafes.map((cafe) => (
        <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]}>
          <Popup>
            <div className="min-w-[200px]">
              {cafe.photos && cafe.photos.length > 0 ? (
                <img 
                  src={`http://localhost:8000/storage/${cafe.photos[0].file_path}`} 
                  alt={cafe.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              
              <h3 className="font-bold text-lg leading-tight mb-1">{cafe.name}</h3>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {cafe.wifi_status === 'fast' && (
                  <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">🚀 Wifi Kenceng</span>
                )}
                {cafe.socket_status === 'many' && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">⚡ Banyak Colokan</span>
                )}
                 {cafe.wifi_status === 'standard' && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">👌 Wifi Standar</span>
                )}
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {cafe.description || "Tidak ada deskripsi."}
              </p>

              <Link href={`/cafe/${cafe.id}`} className="block w-full text-center bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-medium py-2 rounded transition-colors">
                Lihat Detail
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
