import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { MdCheckCircle, MdError, MdInfo, MdWarning, MdClose } from "react-icons/md";

// --- 1. TOAST NOTIFICATION ---
export const Toast = ({ message, type = "info", onClose }) => {
  // State untuk animasi masuk/keluar
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animasi masuk saat mount
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger animasi keluar
      setTimeout(onClose, 300); // Hapus komponen setelah animasi selesai (300ms)
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: "bg-green-600", icon: <MdCheckCircle size={24}/>, title: "Berhasil" },
    error:   { bg: "bg-red-600", icon: <MdError size={24}/>, title: "Error" },
    warning: { bg: "bg-yellow-600", icon: <MdWarning size={24}/>, title: "Peringatan" },
    info:    { bg: "bg-blue-600", icon: <MdInfo size={24}/>, title: "Info" },
  };

  const style = config[type] || config.info;

  // Gunakan Portal
  return ReactDOM.createPortal(
    <div className={`fixed top-5 right-5 z-[10000] transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-white ${style.bg} border border-white/10 min-w-[300px]`}>
        <div className="shrink-0">{style.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">{style.title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="hover:bg-white/20 p-1 rounded-full transition">
          <MdClose size={18}/>
        </button>
      </div>
    </div>,
    document.body
  );
};

// --- 2. CONFIRM MODAL (Smooth Animation) ---
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText="Ya, Lanjutkan", cancelText="Batal", isDanger=false }) => {
  
  const [showModal, setShowModal] = useState(false); // Apakah modal dirender di DOM?
  const [animate, setAnimate] = useState(false);     // Apakah class animasi aktif?

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);                // 1. Render modal ke DOM
      document.body.style.overflow = 'hidden'; // Lock scroll
      
      // Sedikit delay agar transisi CSS terdeteksi
      setTimeout(() => setAnimate(true), 10); 
    } else {
      setAnimate(false);                 // 2. Matikan animasi (fade out)
      document.body.style.overflow = 'unset';  // Unlock scroll
      
      // 3. Tunggu animasi selesai (300ms) baru hapus dari DOM
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Jika tidak harus ditampilkan, jangan render apapun
  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${animate ? 'visible' : 'invisible'}`}>
      
      {/* BACKGROUND OVERLAY (Fade In/Out) */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onCancel} // Klik background untuk batal (opsional)
      ></div>

      {/* KOTAK MODAL (Scale In/Out) */}
      <div 
        className={`bg-[#1e1e1e] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-all duration-300 ${animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${isDanger ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}>
            {isDanger ? <MdWarning size={28}/> : <MdInfo size={28}/>}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-gray-300 mb-8 leading-relaxed">
            {message}
            </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
    </div>,
    document.body
  );
};