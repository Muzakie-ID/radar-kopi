"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Review {
  id: number;
  guest_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Cafe {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  open_hours: string;
  wifi_status: string;
  socket_status: string;
  musholla_status: boolean;
  toilet_info: string;
  parking_info: string;
  photos: { file_path: string; category: string }[];
  tags: string[];
  reviews: Review[];
}

export default function CafeDetail() {
  const params = useParams();
  const router = useRouter();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewForm, setReviewForm] = useState({
    guest_name: "",
    rating: 5,
    comment: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await fetch(`/api/cafes/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setCafe(data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchCafeDetail();
  }, [params.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/cafes/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });
      const data = await response.json();
      if (data.success) {
        alert("Review berhasil dikirim! Menunggu persetujuan admin.");
        setReviewForm({ guest_name: "", rating: 5, comment: "" });
      } else {
        alert("Gagal mengirim review: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Terjadi kesalahan saat mengirim review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="h-screen bg-[#121212] flex items-center justify-center text-[#D4A373]">Loading...</div>;
  if (!cafe) return <div className="h-screen bg-[#121212] flex items-center justify-center text-white">Kafe tidak ditemukan :(</div>;

  // Filter Photos
  const heroPhoto = cafe.photos.find(p => p.category === 'interior') || cafe.photos[0];
  const menuPhotos = cafe.photos.filter(p => p.category === 'menu');
  const otherPhotos = cafe.photos.filter(p => p.category !== 'menu');

  return (
    <main className="min-h-screen bg-[#121212] text-gray-200 pb-32">
      {/* Header Image */}
      <div className="relative h-64 md:h-96 w-full">
        {heroPhoto ? (
          <img 
            src={`/storage/${heroPhoto.file_path}`} 
            className="w-full h-full object-cover"
            alt={cafe.name}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
        
        <Link href="/" className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition z-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        
        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition z-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-1">{cafe.name}</h1>
        <p className="text-[#D4A373] text-sm mb-4 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          {cafe.address}
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex-1 pb-3 text-sm font-medium ${activeTab === "overview" ? "text-[#D4A373] border-b-2 border-[#D4A373]" : "text-gray-500"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("menu")}
            className={`flex-1 pb-3 text-sm font-medium ${activeTab === "menu" ? "text-[#D4A373] border-b-2 border-[#D4A373]" : "text-gray-500"}`}
          >
            Menu
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 pb-3 text-sm font-medium ${activeTab === "reviews" ? "text-[#D4A373] border-b-2 border-[#D4A373]" : "text-gray-500"}`}
          >
            Reviews
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {cafe.tags?.map((tag, index) => (
                <span key={index} className="bg-[#1E1E1E] text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-800">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Fasilitas Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Wifi</p>
                <p className="font-medium text-white">
                  {cafe.wifi_status === 'fast' ? '🚀 Super Kenceng' : cafe.wifi_status === 'standard' ? '👌 Standar' : '🐢 Lemot'}
                </p>
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Colokan</p>
                <p className="font-medium text-white">
                  {cafe.socket_status === 'many' ? '⚡ Banyak' : '🔌 Sedikit'}
                </p>
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Musholla</p>
                <p className="font-medium text-white">
                  {cafe.musholla_status ? '✅ Tersedia' : '❌ Tidak Ada'}
                </p>
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Jam Buka</p>
                <p className="font-medium text-white">{cafe.open_hours || '-'}</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800">
              <h3 className="text-white font-bold mb-2">Tentang Tempat Ini</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {cafe.description || "Belum ada deskripsi detail."}
              </p>
            </div>

            {/* Gallery (Other Photos) */}
            {otherPhotos.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-3">Galeri Suasana</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {otherPhotos.map((photo, idx) => (
                    <div key={idx} className="flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden bg-gray-800 border border-gray-800">
                      <img 
                        src={`/storage/${photo.file_path}`} 
                        className="w-full h-full object-cover"
                        alt={`Suasana ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Tambahan */}
            <div className="space-y-3">
              {cafe.parking_info && (
                <div className="flex gap-3 items-start">
                  <span className="text-xl">🅿️</span>
                  <div>
                    <p className="text-white font-medium text-sm">Parkir</p>
                    <p className="text-gray-400 text-xs">{cafe.parking_info}</p>
                  </div>
                </div>
              )}
              {cafe.toilet_info && (
                <div className="flex gap-3 items-start">
                  <span className="text-xl">🚽</span>
                  <div>
                    <p className="text-white font-medium text-sm">Toilet</p>
                    <p className="text-gray-400 text-xs">{cafe.toilet_info}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {menuPhotos.length > 0 ? (
              menuPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={`/storage/${photo.file_path}`} 
                    className="w-full h-full object-cover"
                    alt="Menu"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-500">
                Belum ada foto menu.
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Review Form */}
            <div className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-800 mb-8">
              <h3 className="text-white font-bold mb-4">Tulis Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nama</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#121212] border border-gray-700 rounded p-2 text-white text-sm focus:border-[#D4A373] outline-none"
                    value={reviewForm.guest_name}
                    onChange={(e) => setReviewForm({...reviewForm, guest_name: e.target.value})}
                    placeholder="Nama kamu..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`text-xl transition-colors ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Komentar</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-[#121212] border border-gray-700 rounded p-2 text-white text-sm focus:border-[#D4A373] outline-none"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Gimana tempatnya? Asik buat kerja?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="w-full bg-[#D4A373] text-black font-bold py-2 rounded hover:bg-[#b88a5c] transition disabled:opacity-50"
                >
                  {submittingReview ? 'Mengirim...' : 'Kirim Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <h3 className="text-white font-bold mb-4">Apa Kata Mereka?</h3>
            {cafe.reviews && cafe.reviews.length > 0 ? (
              <div className="space-y-4">
                {cafe.reviews.map((review) => (
                  <div key={review.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{review.guest_name}</p>
                        <div className="text-yellow-500 text-xs">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">Belum ada review. Jadilah yang pertama!</p>
            )}
          </div>
        )}
      </div>
      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-gray-800 p-4 z-50">
        <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#D4A373] text-black font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-[#b88a5c] transition shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V9.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Rute ke Sini
          </a>
      </div>
    </main>
  );
}
