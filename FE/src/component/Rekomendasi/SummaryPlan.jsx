import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
            ? "Tindakan ini akan menghapus SEMUA data pada kategori ini." 
            : "Data yang dihapus tidak dapat dikembalikan."}
        </p>
        <div className="flex justify-center gap-3 sm:gap-4">
          <button onClick={onClose} className="px-3 sm:px-4 py-2 font-note text-xs sm:text-sm text-gray-400 hover:text-white transition hover:cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-note text-xs sm:text-sm shadow-lg transition transform active:scale-95 hover:cursor-pointer">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const getWeatherLabel = (val) => {
  if (val == 0 || val === "Rain") return "🌧️ Hujan";
  if (val == 1 || val === "Cloudy") return "☁️ Berawan";
  if (val == 2 || val === "Sunny") return "☀️ Cerah";
  return val;
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

const SummaryPlan = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("mining");
  const [allPlans, setAllPlans] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem("finalizedPlans");
    if (savedPlans) {
      setAllPlans(JSON.parse(savedPlans));
    }
  }, []);

  useEffect(() => {
      if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
  }, [location.state]);

  useEffect(() => {
    const highlightId = location.state?.highlightId;
    
    if (highlightId && allPlans.length > 0) {
        setTimeout(() => {
            const element = document.getElementById(highlightId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.classList.add("ring-2", "ring-purple-500", "bg-white/5");
                setTimeout(() => {
                    element.classList.remove("ring-2", "ring-purple-500", "bg-white/5");
                }, 3000);
            }
        }, 500);
    }
  }, [location.state, allPlans, activeTab]);

  const promptDeleteOne = (id) => { setDeleteTarget(id); setModalOpen(true); };
  const promptDeleteCategory = () => { 
      setDeleteTarget(activeTab === 'mining' ? 'cat_mining' : 'cat_shipping'); 
      setModalOpen(true); 
  };

  const executeDelete = () => {
    let newPlans = [...allPlans];
    if (deleteTarget === 'cat_mining') {
        newPlans = allPlans.filter(p => (p.type || "Mining") === "Shipping");
    } else if (deleteTarget === 'cat_shipping') {
        newPlans = allPlans.filter(p => (p.type || "Mining") !== "Shipping");
    } else {
        newPlans = allPlans.filter(p => p.id !== deleteTarget);
    }
    setAllPlans(newPlans);
    localStorage.setItem("finalizedPlans", JSON.stringify(newPlans));
    setModalOpen(false);
  };

  const filteredData = allPlans.filter((item) => {
      const type = item.type || "Mining";
      return activeTab === "mining" ? type !== "Shipping" : type === "Shipping";
  });

  return (
    <div className="w-full animate-fade-in-up pb-20 px-4 sm:px-6">
      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={executeDelete} 
        isAll={deleteTarget && deleteTarget.toString().startsWith('cat_')}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 mb-8">
        
        {/* Title & Desc */}
        <div className="w-full text-left">
          <h2 className="heading-1 text-left text-xl sm:text-2xl md:text-3xl">Finalized Summary Plan</h2>
          <p className="note text-left mt-1 text-xs sm:text-sm">
              Riwayat rencana kerja yang telah disetujui.
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            {/* Tab Buttons */}
            <div className="flex bg-[#181818] p-1 rounded-lg w-full sm:w-fit">
                <button
                onClick={() => setActiveTab("mining")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all text-center text-xs sm:text-sm ${
                    activeTab === "mining" ? "bg-primary text-white shadow-lg font-bold" : "text-gray-400 hover:text-white hover:cursor-pointer"
                }`}
                >
                Mining Plan
                </button>
                <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all text-center text-xs sm:text-sm ${
                    activeTab === "shipping" ? "bg-primary text-white shadow-lg font-bold" : "text-gray-400 hover:text-white hover:cursor-pointer"
                }`}
                >
                Shipping Plan
                </button>
            </div>

            {/* Hapus Semua Button */}
            {filteredData.length > 0 && (
                <button onClick={promptDeleteCategory} className="w-full sm:w-auto note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 transition border border-red-800/50 bg-red-900/10 text-xs sm:text-sm">
                    <MdDelete className="text-base sm:text-lg" /> Hapus Semua
                </button>
            )}
        </div>
      </div>

      <div className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((plan, index) => {
            const isShipping = activeTab === "shipping";
            const config = isShipping ? {
                u: "Transport", a: "Stockpile", s: "Loading",
                iconU: "🚛", iconA: "📦", iconS: "⏱️",
                unitA: "Ton", unitS: "Jam"
            } : {
                u: "Truk", a: "Ekskavator", s: "Operator",
                iconU: "🚛", iconA: "🏗️", iconS: "👷",
                unitA: "Unit", unitS: "Org"
            };

            return (
                <div 
                    key={index} 
                    id={plan.id}
                    className="card rounded-xl transition-all duration-500 ease-in-out scroll-mt-24 p-4 sm:p-6"
                >
                {/* --- HEADER CARD --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/10 pb-4 mb-4 gap-3 sm:gap-4">
                    
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#AA14F0] font-mono font-bold text-base sm:text-lg">{plan.id}</span>
                            <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">-</span>
                            <span className="heading-2 text-sm sm:text-lg">Summary Plan</span>
                        </div>
                        <p className="date text-left text-[10px] sm:text-xs text-gray-400">
                            {plan.date}
                        </p>
                    </div>

                    <div className="flex justify-between items-center w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                        <div className="flex date h-fit px-2 sm:px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            {plan.status || "Finalized"}
                        </div>
                        <button onClick={() => promptDeleteOne(plan.id)} className="text-gray-500 hover:text-red-500 p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition hover:cursor-pointer -mr-2 sm:mr-0">
                            <MdDelete size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* --- ANALISIS --- */}
                <div className="mb-5 sm:mb-6">
                    <h4 className="heading-2 !text-font my-2 sm:my-3 text-left text-xs sm:text-sm">📝 Hasil Analisis Agent</h4>
                    <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/5">
                        <p className="body-text text-left break-words text-xs sm:text-sm text-gray-300 leading-relaxed">
                            "{plan.analysis || "Tidak ada data analisis detail."}"
                        </p>
                    </div>
                </div>

                {/* --- RESOURCE GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-6">
                    <ResourceItem label={config.u} value={`${plan.trucks || 0} Unit`} icon={config.iconU} />
                    <ResourceItem label={config.a} value={`${plan.excavators || 0} ${config.unitA}`} icon={config.iconA} />
                    <ResourceItem label={config.s} value={`${plan.operators || 0} ${config.unitS}`} icon={config.iconS} />
                    <ResourceItem label="Cuaca" value={getWeatherLabel(plan.weather)} icon="🌦️" />
                </div>

                {/* --- STATUS OPERASIONAL (Start Aligned) --- */}
                <div>
                    <h4 className="heading-2 !text-font my-2 sm:my-3 text-left text-xs sm:text-sm">📊 Status Operasional Saat Ini</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                        
                        {/* ITEM 1: TARGET */}
                        <div className="p-3 sm:p-4 flex flex-col justify-center items-start border-b border-white/10 sm:border-b-0 sm:border-r">
                            <p className="body-text !text-font text-[10px] uppercase tracking-wider mb-1 text-left">Target</p>
                            <p className="heading-2 text-base sm:text-lg md:text-xl text-left text-white">{plan.target} Ton</p> 
                        </div>

                        {/* ITEM 2: PREDIKSI */}
                        <div className="p-3 sm:p-4 flex flex-col justify-center items-start border-b border-white/10 sm:border-b-0 sm:border-r">
                            <p className="body-text !text-font text-[10px] uppercase tracking-wider mb-1 text-left">Prediksi</p>
                            <p className="heading-2 text-base sm:text-lg md:text-xl text-yellow-400 text-left">{plan.prediction} Ton</p>
                        </div>

                        {/* ITEM 3: GAP */}
                        <div className="p-3 sm:p-4 flex flex-col justify-center items-start">
                            <p className="body-text !text-font text-[10px] uppercase tracking-wider mb-1 text-left">Gap (Selisih)</p>
                            <p className={`heading-2 text-base sm:text-lg md:text-xl text-left ${parseInt(plan.prediction) > (plan.target) ? "!text-red-400" : "!text-green-400"}`}>
                            {plan.gap} Ton
                            </p>
                        </div>

                    </div>
                </div>

                </div>
            );
          })
        ) : (
          <div className="text-left p-6 sm:p-12 bg-[#2F2F2F]/30 rounded-xl border border-dashed border-gray-600">
            <h2 className="heading-2 text-base sm:text-xl">Belum ada {activeTab === "mining" ? "Mining" : "Shipping"} Plan.</h2>
            <p className="body-text text-xs sm:text-sm mt-2 text-gray-400">Silakan lakukan analisis di halaman "Tanyakan" dan klik Finalisasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceItem = ({ label, value, icon }) => (
  <div className="bg-[#2F2F2F] p-2 sm:p-3 rounded-lg border border-white/5 flex items-center gap-2 sm:gap-3">
    <span className="text-lg sm:text-xl shrink-0">{icon}</span>
    <div className="text-left min-w-0 overflow-hidden">
      <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left truncate">{label}</p>
      <p className={`font-bold text-white text-xs sm:text-sm text-left truncate`}>{value}</p>
    </div>
  </div>
);

export default SummaryPlan;