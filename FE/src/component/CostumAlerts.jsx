import React, { useEffect } from "react";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from "react-icons/md";

// --- 1. TOAST NOTIFICATION (Pesan Melayang) ---
export const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Hilang otomatis setelah 3 detik
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: "bg-green-600", icon: <MdCheckCircle size={24}/>, title: "Berhasil" },
    error:   { bg: "bg-red-600", icon: <MdError size={24}/>, title: "Error" },
    warning: { bg: "bg-yellow-600", icon: <MdWarning size={24}/>, title: "Peringatan" },
    info:    { bg: "bg-blue-600", icon: <MdInfo size={24}/>, title: "Info" },
  };

  const style = config[type] || config.info;

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-white ${style.bg} border border-white/10 min-w-[300px]`}>
        <div className="shrink-0">{style.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">{style.title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
          <MdClose size={18}/>
        </button>
      </div>
    </div>
  );
};

// --- 2. CONFIRM MODAL (Popup Konfirmasi) ---
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText="Ya, Lanjutkan", cancelText="Batal", isDanger=false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1e1e1e] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl p-6 transform scale-100 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${isDanger ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"}`}>
            {isDanger ? <MdWarning size={28}/> : <MdInfo size={28}/>}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-gray-300 font-medium hover:bg-white/5 transition"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white font-bold shadow-lg transition transform active:scale-95 flex items-center gap-2 ${
              isDanger 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};