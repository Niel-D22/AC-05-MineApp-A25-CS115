import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteSweep, MdClose } from "react-icons/md"; 
import PageTransitionEvent from "../component/PageTransition";
import { ConfirmModal } from "../component/CostumAlerts"; // Pastikan import ini ada

const Notifikasi = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk Modal Konfirmasi
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null); // ID yg mau dihapus (null jika hapus semua)
  const [isDeleteAll, setIsDeleteAll] = useState(false); // Flag untuk membedakan hapus satu atau semua

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
        prev.map((notif) => notif.id === id ? { ...notif, is_read: 1 } : notif)
      );
    } catch (err) { console.error("Error update status:", err); }
  };

  // --- LOGIC DELETE DENGAN MODAL ---

  // Trigger Hapus Satu
  const promptDeleteOne = (id, e) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setIsDeleteAll(false);
    setConfirmOpen(true);
  };

  // Trigger Hapus Semua
  const promptDeleteAll = () => {
    if (notifications.length === 0) return;
    setDeleteTargetId(null);
    setIsDeleteAll(true);
    setConfirmOpen(true);
  };

  // Eksekusi Hapus (Dipanggil saat user klik "Ya" di modal)
  const executeDelete = async () => {
    const token = localStorage.getItem("token");
    setConfirmOpen(false); // Tutup modal dulu

    try {
        if (isDeleteAll) {
            // Logic Hapus Semua
            const deletePromises = notifications.map(notif => 
                axios.delete(`${API_URL}/${notif.id}`, { headers: { Authorization: `Bearer ${token}` } })
            );
            await Promise.all(deletePromises);
            setNotifications([]);
        } else {
            // Logic Hapus Satu
            if (!deleteTargetId) return;
            await axios.delete(`${API_URL}/${deleteTargetId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) => prev.filter((n) => n.id !== deleteTargetId));
        }
    } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus data.");
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <PageTransitionEvent>
    <div className="min-h-screen text-white p-6 pb-24 animate-fade-in-up">
      
      {/* --- MODAL KONFIRMASI --- */}
      <ConfirmModal 
        isOpen={confirmOpen}
        title={isDeleteAll ? "Hapus Semua Notifikasi?" : "Hapus Notifikasi?"}
        message={isDeleteAll 
            ? "Tindakan ini akan menghapus seluruh riwayat notifikasi Anda secara permanen." 
            : "Apakah Anda yakin ingin menghapus pesan notifikasi ini?"}
        onConfirm={executeDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Ya, Hapus"
        isDanger={true}
      />

      <div className="max-w-3xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="heading-2">Notifikasi 🔔</h1>
            <p className="small-text mt-1">
                {notifications.filter(n => n.is_read === 0).length} Pesan belum dibaca
            </p>
          </div>

          {notifications.length > 0 && (
              <button 
                onClick={promptDeleteAll}
                className="note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 py-1 rounded flex items-center gap-1 transition border border-red-800"
              >
                <MdDeleteSweep size={18} /> Hapus Semua
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
              <div className="flex items-start gap-4">
                {/* Ikon Tipe */}
                <div className={`p-3 rounded-full shrink-0 ${notif.is_read === 0 ? "bg-purple-500/20 text-purple-400" : "bg-gray-700/30 text-gray-500"}`}>
                  {notif.type === 'alert' ? '⚠️' : '📢'}
                </div>

                {/* Konten Text */}
                <div className="flex-1 min-w-0 pr-8"> {/* Tambah padding-right agar teks tidak nabrak tombol X */}
                  <div className="flex justify-between items-start mb-1 flex-col sm:flex-row sm:items-center gap-1">
                    <h3 className={`heading-2 !text-font ${notif.is_read === 0 ? "heading-2 !text-font" : "heading-2 !text-white"}`}>
                      {notif.title}
                    </h3>
                    <span className="date whitespace-nowrap">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="small-text mt-1">
                    {notif.message}
                  </p>
                </div>

                {/* Tombol Hapus Satu (Diperbaiki Posisinya) */}
                <button 
                  onClick={(e) => promptDeleteOne(notif.id, e)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-400 hover:bg-white/5 p-1.5 rounded-full transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Hapus pesan ini"
                >
                  <MdClose size={18} />
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
    </PageTransitionEvent>
  );
};

export default Notifikasi;