import React, { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from "react-icons/md";

// --- 1. TOAST NOTIFICATION (Pojok Kanan Atas) ---
export const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: "bg-green-500/10", border: "border-green-500/50", text: "text-green-400", icon: <MdCheckCircle /> },
    error: { bg: "bg-red-500/10", border: "border-red-500/50", text: "text-red-400", icon: <MdError /> },
    warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/50", text: "text-yellow-400", icon: <MdWarning /> },
    info: { bg: "bg-blue-500/10", border: "border-blue-500/50", text: "text-blue-400", icon: <MdInfo /> },
  };

  const style = config[type] || config.info;

  return (
    <div className={`fixed top-6 right-6 z-[10000] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-fade-in-down ${style.bg} ${style.border} ${style.text}`}>
      <span className="text-xl">{style.icon}</span>
      <p className="text-sm font-medium pr-2">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition"><MdClose /></button>
    </div>
  );
};

// --- 2. CONFIRM MODAL (Full Screen Overlay + Center) ---
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDanger = false, confirmText = "Ya, Hapus" }) => {
  if (!isOpen) return null;

  return (
    // WRAPPER UTAMA: Mengunci seluruh layar (Viewport)
    // 'fixed inset-0' -> Menempel ke 4 sudut layar browser
    // 'z-[9999]' -> Memastikan di lapisan paling atas (di atas Navbar dll)
    // 'flex items-center justify-center' -> Memaksa konten (kotak modal) ke TENGAH
    <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full p-4">
      
      {/* OVERLAY BACKGROUND */}
      {/* Gelap & Blur di belakang modal */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onCancel} // Klik area gelap untuk menutup
      ></div>
      
      {/* KOTAK MODAL */}
      {/* 'relative z-10' -> Agar muncul di depan overlay */}
      <div className="relative z-10 bg-[#1e1e1e] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl transform transition-all scale-100 animate-pop-in">
        
        {/* Header */}
        <h3 className={`text-xl font-bold mb-2 ${isDanger ? "text-red-400" : "text-white"}`}>
          {title}
        </h3>
        
        {/* Pesan */}
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 transition border border-transparent"
          >
            Batal
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${
              isDanger 
                ? "bg-red-600 hover:bg-red-500 shadow-red-900/20" 
                : "bg-[#AA14F0] hover:bg-[#9a12d9] shadow-purple-900/20"
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};