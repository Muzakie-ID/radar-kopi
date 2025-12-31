"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#121212] text-[#D4A373]">
      <div className="flex flex-col items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium animate-pulse">Memuat Peta Ngongkrong...</p>
      </div>
    </div>
  ),
});

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

export default function Home() {
  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Fetch Cafes
    const fetchCafes = async () => {
      try {
        const response = await fetch('/api/cafes');
        const data = await response.json();
        if (data.success) {
          setAllCafes(data.data);
          setFilteredCafes(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cafes:", error);
      }
    };

    fetchCafes();

    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allCafes;

    // Filter by Search
    if (searchQuery) {
      result = result.filter(cafe => 
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Chips
    if (activeFilter === 'wifi') {
      result = result.filter(cafe => cafe.wifi_status === 'fast');
    } else if (activeFilter === 'socket') {
      result = result.filter(cafe => cafe.socket_status === 'many');
    }

    setFilteredCafes(result);
  }, [searchQuery, activeFilter, allCafes]);

  const toggleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#121212]">
      <Map cafes={filteredCafes} userLocation={userLocation} />
      
      {/* Floating Search Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-[1000] px-4 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                <button 
                  onClick={() => toggleFilter('wifi')}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                    activeFilter === 'wifi' 
                      ? 'bg-[#D4A373] text-black' 
                      : 'bg-[#1E1E1E] border border-[#333] text-gray-300'
                  }`}
                >
                    🚀 Wifi Kenceng
                </button>
                <button 
                  onClick={() => toggleFilter('socket')}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                    activeFilter === 'socket' 
                      ? 'bg-[#D4A373] text-black' 
                      : 'bg-[#1E1E1E] border border-[#333] text-gray-300'
                  }`}
                >
                    ⚡ Banyak Colokan
                </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center overflow-hidden rounded-full bg-[#1E1E1E] shadow-xl ring-1 ring-white/10">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Mau ngopi di mana hari ini?" 
                    className="w-full border-0 bg-transparent py-3.5 pl-6 pr-12 text-white placeholder:text-gray-500 focus:ring-0 sm:text-sm outline-none"
                />
                <div className="absolute right-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#D4A373]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
