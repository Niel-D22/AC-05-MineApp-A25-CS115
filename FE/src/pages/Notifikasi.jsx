import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifikasi = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Ganti URL ini sesuai port backend Anda
  const API_URL = "http://localhost:3000/api/notifications"; 

  // 1. Fungsi Mengambil Data Notifikasi
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token"); // Pastikan token tersimpan saat login
      if (!token) {
        setError("Anda belum login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }, // Kirim token ke backend
      });

      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
      setError("Gagal memuat notifikasi.");
      setLoading(false);
    }
  };

  const handleOnClick = (notif) => {
    if (notif.is_read === 0) {
          markAsRead(notif.id, notif.is_read);
      }
      let targetTab = "mining";
      if (notif.type && (notif.type.toLowerCase().includes("shipping"))) {
          targetTab = "shipping";
      }
      navigate("/home/summary-plan", { 
          state: { activeTab: targetTab, highlightId: notif.reference_id } 
      });
  };

  // 2. Fungsi Tandai Sudah Dibaca
  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 1) return; // Jika sudah dibaca, abaikan

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state lokal agar UI berubah tanpa refresh halaman
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: 1 } : notif
        )
      );
    } catch (err) {
      console.error("Error update status:", err);
    }
  };

  // 3. Fungsi Hapus Notifikasi
  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Mencegah klik tembus ke container (agar tidak memicu markAsRead)
    
    if (!window.confirm("Hapus notifikasi ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Hapus dari state lokal
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  // Panggil fetch saat halaman pertama kali dibuka
  useEffect(() => {
    fetchNotifications();
  }, []);

  // --- FORMAT TANGGAL ---
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // --- RENDER TAMPILAN ---
  return (
    <div className="min-h-screen text-white p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Notifikasi 🔔
          </h1>
          <span className="text-sm text-gray-400">
            {notifications.filter(n => n.is_read === 0).length} Belum dibaca
          </span>
        </div>

        {/* Loading & Error State */}
        {loading && <p className="text-center text-gray-400 animate-pulse">Memuat notifikasi...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="text-center py-12 bg-[#1E1E1E] rounded-xl border border-dashed border-gray-700">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-500">Tidak ada notifikasi baru.</p>
          </div>
        )}

        {/* List Notifikasi */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleOnClick(notif)}
              className={`relative p-5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                notif.is_read === 0
                  ? "bg-[#252525] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]" // Style Belum Baca
                  : "bg-[#1A1A1A] border-white/5 opacity-80 hover:opacity-100" // Style Sudah Baca
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                {/* Ikon Kiri */}
                <div className={`p-3 rounded-full ${notif.is_read === 0 ? "bg-purple-500/20 text-purple-400" : "bg-gray-700/30 text-gray-500"}`}>
                  {notif.type === 'alert' ? '⚠️' : '📢'}
                </div>

                {/* Konten Teks */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold text-lg ${notif.is_read === 0 ? "text-white" : "text-gray-400"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 font-mono">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Tombol Hapus (Muncul saat Hover) */}
                <button 
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  title="Hapus notifikasi"
                >
                  ✕
                </button>
              </div>

              {/* Indikator Belum Dibaca (Titik Merah) */}
              {notif.is_read === 0 && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;