import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { createPortal } from "react-dom";
import { ConfirmModal, Toast } from "../CostumAlerts";

const DeleteModal = ({ isOpen, onClose, onConfirm, isAll }) => {
  if (!isOpen) return null;
  return createPortal (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 w-screen h-screen">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all">
        <h3 className="heading-2 !text-red-500 mb-2 text-lg sm:text-xl">Konfirmasi Hapus</h3>
        <p className="!text-gray-400 body-text !text-xs sm:text-sm mb-6">
          {isAll 
            ? "Semua riwayat akan dihapus permanen dan tidak dapat dikembalikan." 
            : "Data yang dihapus tidak dapat dikembalikan."}
        </p>
        <div className="flex justify-center gap-3 sm:gap-4">
          <button 
            onClick={onClose} 
            className="px-3 sm:px-4 py-2 font-note text-xs sm:text-sm text-gray-400 hover:text-white transition hover:cursor-pointer"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-note text-xs sm:text-sm shadow-lg transition transform active:scale-95 hover:cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const getWeatherLabel = (val) => {
  if (val == 0 || val === "Light Rain" || val === "Rain") return "🌧️ Hujan";
  if (val == 1 || val === "Cloudy") return "☁️ Berawan";
  if (val == 2 || val === "Sunny") return "☀️ Cerah";
  return val || "-";
};

const UrgencyTag = ({ hasPlan }) => {
  return (
    <span
      className={` ${
        hasPlan 
          ? "date rounded-lg !bg-primary !text-text-body px-2 py-1 text-[10px] sm:text-xs" 
          : "date !bg-gray-500/20 rounded-lg !text-text-body px-2 py-1 text-[10px] sm:text-xs"
      }`}
    >
      {hasPlan ? "Finalized" : "Draft"}
    </span>
  );
};

const CardRekomendasi = () => {
  const [historyData, setHistoryData] = useState([]);
  const [index, setIndex] = useState(0);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // STATE BARU: Untuk mengatur jumlah kartu yang tampil berdasarkan layar
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const savedHistory = localStorage.getItem("aiHistory");
    if (savedHistory) {
      setHistoryData(JSON.parse(savedHistory));
    }

    // UPDATE RESPONSIVE: Cek ukuran layar
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile: 1 Kartu
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablet (iPad): 2 Kartu
      } else {
        setVisibleCards(3); // Desktop: 3 Kartu
      }
    };

    handleResize(); // Jalankan saat awal render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalCards = historyData.length;

  const next = () => { if (index < totalCards - visibleCards) setIndex(index + 1); };
  const prev = () => { if (index > 0) setIndex(index - 1); };

  const promptDeleteOne = (id) => { setDeleteTarget(id); setModalOpen(true); };
  const promptDeleteAll = () => { setDeleteTarget("all"); setModalOpen(true); };

  const executeDelete = () => {
    if (deleteTarget === "all") {
        localStorage.removeItem("aiHistory");
        setHistoryData([]);
    } else {
        const newData = historyData.filter(item => item.sessionId !== deleteTarget);
        setHistoryData(newData);
        localStorage.setItem("aiHistory", JSON.stringify(newData));
        if (index > 0 && index >= newData.length - visibleCards + 1) setIndex(Math.max(0, index - 1));
    }
    setModalOpen(false);
  };

  if (historyData.length === 0) {
    return (
      <div className="heading-2 p-8 sm:p-12 card my-8 text-center text-sm sm:text-base">
        <p>Belum ada riwayat rekomendasi AI.</p>
        <p className="body-text !text-xs sm:!text-sm mt-2">Lakukan analisis di halaman "Tanyakan" untuk mendapatkan rekomendasi.</p>
      </div>
    );
  }

  // Helper calculation for dynamic gap adjustment in translateX
  const gap = 24; // corresponds to gap-6 (6 * 4px)
  
  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6">
      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={executeDelete} 
        isAll={deleteTarget === "all"}
      />

      <button onClick={promptDeleteAll} className="note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-1.5 transition border border-red-800 mb-4 text-xs sm:text-sm">
        <MdDelete /> Hapus Semua Riwayat
      </button>

      {/* NAVIGASI SLIDER - DIPERBAIKI POSISINYA UNTUK HP/TABLET */}
      {index > 0 && (
        <button 
          onClick={prev} 
          className="absolute left-0 sm:-left-2 md:-left-5 top-1/2 -translate-y-1/2 bg-primary text-white p-2 sm:p-3 rounded-lg z-20 shadow-xl hover:bg-purple-700 transition hover:cursor-pointer"
        >
          ‹
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button 
          onClick={next} 
          className="absolute right-0 sm:-right-2 md:-right-5 top-1/2 -translate-y-1/2 bg-primary text-white p-2 sm:p-3 rounded-lg z-20 shadow-xl hover:bg-purple-700 transition hover:cursor-pointer"
        >
          ›
        </button>
      )}

      {/* CONTAINER CAROUSEL */}
      <div className="overflow-hidden text-start py-2 sm:py-4 px-1">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ 
            // Rumus translate: Menggeser index * (lebar 1 kartu + gap)
            transform: `translateX(calc(-${index} * ((100% / ${visibleCards}) + (${gap}px / ${visibleCards} * ${visibleCards - 1}))))` 
          }}
        >
          {historyData.map((item, i) => {
            const isShipping = item.type === "Shipping";
            const config = isShipping ? {
                u: "Transport", a: "Stockpile", s: "Loading",
                iconU: "🚢", iconA: "📦", iconS: "⏱️",
                unitA: "Ton", unitS: "Jam"
            } : {
                u: "Truk", a: "Ekskavator", s: "Operator",
                iconU: "🚛", iconA: "🏗️", iconS: "👷",
                unitA: "Unit", unitS: "Org"
            };

            return (
                <div
                key={i}
                className="card shrink-0 flex flex-col justify-between group relative p-4 sm:p-5 md:p-6"
                // UPDATE: Kalkulasi lebar kartu agar pas
                style={{ 
                    width: `calc((100% - ${(visibleCards - 1) * gap}px) / ${visibleCards})`, 
                    minHeight: "380px" // Sedikit dikurangi agar pas di layar kecil
                }}
                >
                
                <button 
                    onClick={() => promptDeleteOne(item.sessionId)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-10"
                >
                    <MdDelete size={18} className="sm:w-5 sm:h-5" />
                </button>

                <div>
                    <div className="flex justify-between items-start mb-3 sm:mb-4 pr-6">
                    <div className="flex flex-col gap-y-1 sm:gap-y-2">
                        <span className="date w-fit text-[10px] sm:text-xs">{item.date}</span>
                        <span className={`date !text-sm sm:!text-lg`}>
                            {item.type || 'Mining'} Plan
                        </span>
                    </div>
                    <UrgencyTag hasPlan={!!item.summaryId} />
                    </div>

                    <h2 className="heading-2 my-2 sm:my-4 line-clamp-2 text-sm sm:text-base md:text-xl" title={item.title}>
                    {item.title}
                    </h2>

                    <div className="bg-white/5 p-3 rounded-lg mb-3 sm:mb-4">
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                        <span className="note">Target</span>
                        <span className="note !text-text-body">{item.target} Ton</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                        <span className="note">Output</span>
                        <span className="note !text-text-body">{item.prediction} Ton</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs pt-1 border-t border-white/10">
                        <span className="note">Gap</span>
                        <span className={"note !text-text-body"}>
                        {item.gap} Ton
                        </span>
                    </div>
                    </div>

                    <h3 className="note !text-text-body my-2 sm:my-4 text-xs sm:text-sm font-bold">Konfigurasi AI</h3>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1.5 sm:space-y-2">
                    <li className="flex items-center gap-2">
                        <span>{config.iconU}</span> <span className="note">{config.u}:</span> <span className="body-text !text-xs sm:!text-sm">{item.trucks} Unit</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>{config.iconA}</span> <span className="note">{config.a}:</span> <span className="body-text !text-xs sm:!text-sm">{item.excavators} {config.unitA}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>{config.iconS}</span> <span className="note">{config.s}:</span> <span className="body-text !text-xs sm:!text-sm">{item.operators} {config.unitS}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>🌦️</span> <span className="note">Cuaca:</span> <span className="body-text !text-xs sm:!text-sm">{getWeatherLabel(item.weather)}</span>
                    </li>
                    </ul>
                </div>

                {item.summaryId && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                    <p className="note text-center !text-[10px] sm:!text-xs mb-2">Terhubung ke Summary Plan:</p>
                    <div className="date !text-[10px] sm:!text-xs text-center truncate">
                        {item.summaryId}
                    </div>
                    </div>
                )}
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardRekomendasi;