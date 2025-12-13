import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { ConfirmModal, Toast } from "../CostumAlerts";

const DeleteModal = ({ isOpen, onClose, onConfirm, isAll }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 w-screen h-screen">
      {/* Background Gelap */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Kotak Modal */}
      <div className="relative bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all">
        <h3 className="text-xl font-bold text-red-500 mb-2">Konfirmasi Hapus</h3>
        <p className="text-gray-400 text-sm mb-6">
          {isAll 
            ? "Semua riwayat akan dihapus permanen dan tidak dapat dikembalikan." 
            : "Data yang dihapus tidak dapat dikembalikan."}
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-lg transition transform active:scale-95"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
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
          ? "date rounded-lg !bg-primary !text-text-body" 
          : "date !bg-gray-500/20 rounded-lg !text-text-body"
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

  useEffect(() => {
    const savedHistory = localStorage.getItem("aiHistory");
    if (savedHistory) {
      setHistoryData(JSON.parse(savedHistory));
    }
  }, []);

  const visibleCards = 3;
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
      <div className="heading-2 p-12 card my-8">
        <p>Belum ada riwayat rekomendasi AI.</p>
        <p className="body-text !text-sm">Lakukan analisis di halaman "Tanyakan" untuk mendapatkan rekomendasi.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6">
      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={executeDelete} 
        isAll={deleteTarget === "all"}
      />

      <button onClick={promptDeleteAll} className="note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 py-1 rounded flex    items-center gap-1 transition border border-red-800">
        <MdDelete /> Hapus Semua Riwayat
      </button>

      {index > 0 && (
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition hover:cursor-pointer">
          ‹
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition hover:cursor-pointer">
          ›
        </button>
      )}

      <div className="overflow-hidden text-start py-4">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / 3 + 2)}%)` }}
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
                className="card shrink-0 flex flex-col justify-between group relative"
                style={{ width: "calc((100% - 48px) / 3)", minHeight: "420px" }}
                >
                
                <button 
                    onClick={() => promptDeleteOne(item.sessionId)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition z-10"
                >
                    <MdDelete size={20} />
                </button>

                <div>
                    <div className="flex justify-between items-start mb-4 pr-6">
                    <div className="flex flex-col gap-y-4">
                        <span className="date w-fit">{item.date}</span>
                        <span className={`date !text-lg`}>
                            {item.type || 'Mining'} Plan
                        </span>
                    </div>
                    <UrgencyTag hasPlan={!!item.summaryId} />
                    </div>

                    <h2 className="heading-2 my-4" title={item.title}>
                    {item.title}
                    </h2>

                    <div className="bg-white/5 p-3 rounded-lg mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="note">Target</span>
                        <span className="note !text-text-body">{item.target} Ton</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="note">Output</span>
                        <span className="note !text-text-body">{item.prediction} Ton</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                        <span className="note">Gap</span>
                        <span className={"note !text-text-body"}>
                        {item.gap} Ton
                        </span>
                    </div>
                    </div>

                    <h3 className="note !text-text-body my-4">Konfigurasi AI</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                        <span>{config.iconU}</span> <span className="note">{config.u}:</span> <span className="body-text !text-sm">{item.trucks} Unit</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>{config.iconA}</span> <span className="note">{config.a}:</span> <span className="body-text !text-sm">{item.excavators} {config.unitA}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>{config.iconS}</span> <span className="note">{config.s}:</span> <span className="body-text !text-sm">{item.operators} {config.unitS}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span>🌦️</span> <span className="note">Cuaca:</span> <span className="body-text !text-sm">{getWeatherLabel(item.weather)}</span>
                    </li>
                    </ul>
                </div>

                {item.summaryId && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="note text-center !text-xs mb-4">Terhubung ke Summary Plan:</p>
                    <div className="date !text-xs text-center">
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