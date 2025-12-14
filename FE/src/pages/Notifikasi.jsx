import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteSweep } from "react-icons/md"; // Import ikon sapu/hapus semua

const Notifikasi = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const API_URL = "http://localhost:3000/api/notifications"; 

  // 1. Fetch Data
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Anda belum login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Urutkan notifikasi: Terbaru di atas
      const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setNotifications(sortedData);
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
      // Redirect ke summary plan dengan highlight ID
      navigate("/home/summary-plan", { 
          state: { activeTab: targetTab, highlightId: notif.reference_id } 
      });
  };

  // 2. Tandai Baca
  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 1) return; 

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: 1 } : notif
        )
      );
    } catch (err) {
      console.error("Error update status:", err);
    }
  };

  // 3. Hapus Satu Notifikasi
  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Agar tidak men-trigger klik card (pindah halaman)
    
    // Gunakan window.confirm standar (atau bisa ganti Modal Custom nanti)
    if (!window.confirm("Hapus notifikasi ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus notifikasi.");
    }
  };

  // 4. Hapus SEMUA Notifikasi (Fitur Baru)
  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Apakah Anda yakin ingin menghapus SEMUA riwayat notifikasi? Tindakan ini tidak bisa dibatalkan.")) return;

    try {
      const token = localStorage.getItem("token");
      
      // Request ke endpoint DELETE root (sesuaikan dengan backend Anda)
      // Jika backend menggunakan json-server, biasanya tidak support delete all sekaligus,
      // jadi kita loop manual di frontend. Jika backend Express buatan sendiri, buat route delete all.
      
      // CARA 1: Jika Backend support DELETE /api/notifications (Bulk Delete)
      // await axios.delete(API_URL, { headers: { Authorization: `Bearer ${token}` } });

      // CARA 2: Loop Manual (Lebih aman untuk JSON-Server / Backend sederhana)
      const deletePromises = notifications.map(notif => 
        axios.delete(`${API_URL}/${notif.id}`, { headers: { Authorization: `Bearer ${token}` } })
      );
      
      await Promise.all(deletePromises);

      setNotifications([]); // Kosongkan state
      alert("Semua notifikasi berhasil dihapus.");

    } catch (err) {
      console.error("Gagal hapus semua:", err);
      alert("Terjadi kesalahan saat menghapus semua data.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen text-white p-6 pb-24 animate-fade-in-up">
      <div className="max-w-3xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="heading-2">
                Notifikasi 🔔
            </h1>
            <p className="small-text mt-1">
                {notifications.filter(n => n.is_read === 0).length} Pesan belum dibaca
            </p>
          </div>

          {/* Tombol Hapus Semua */}
          {notifications.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 py-1 rounded flex    items-center gap-1 transition border border-red-800"
              >
                <MdDeleteSweep size={18} />
                Hapus Semua
              </button>
          )}
        </div>

        {/* Loading & Error */}
        {loading && <p className="text-center text-gray-400 animate-pulse mt-10">Memuat notifikasi...</p>}
        {error && <p className="text-center text-red-400 mt-10 bg-red-500/10 p-4 rounded-lg">{error}</p>}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="text-center py-16 bg-[#1E1E1E] rounded-xl border border-dashed border-gray-700 flex flex-col items-center">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <p className="text-gray-400 text-lg font-semibold">Tidak ada notifikasi baru.</p>
            <p className="text-gray-600 text-sm">Semua informasi penting akan muncul di sini.</p>
          </div>
        )}

        {/* List Notifikasi */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleOnClick(notif)}
              className={`relative p-5 rounded-xl border transition-all duration-200 cursor-pointer group hover:scale-[1.01] ${
                notif.is_read === 0
                  ? "bg-[#252525] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                  : "bg-[#1A1A1A] border-white/5 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                {/* Ikon Tipe */}
                <div className={`p-3 rounded-full shrink-0 ${notif.is_read === 0 ? "bg-purple-500/20 text-purple-400" : "bg-gray-700/30 text-gray-500"}`}>
                  {notif.type === 'alert' ? '⚠️' : '📢'}
                </div>

                {/* Konten Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                    <h3 className={`heading-2 !text-font ${notif.is_read === 0 ? "heading-2 !text-font" : "heading-2 !text-white"}`}>
                      {notif.title}
                    </h3>
                    <span className="date">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="small-text">
                    {notif.message}
                  </p>
                </div>

                {/* Tombol Hapus Satu (Absolute Position) */}
                <button 
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Hapus pesan ini"
                >
                  ✕
                </button>
              </div>

              {/* Titik Merah (Unread Indicator) */}
              {notif.is_read === 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red] border border-[#1E1E1E]"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;