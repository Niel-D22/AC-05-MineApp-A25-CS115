import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { ConfirmModal, Toast } from "../CostumAlerts";

const DeleteModal = ({ isOpen, onClose, onConfirm, isAll }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 w-screen h-screen">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all">
        <h3 className="heading-2 !text-red-500 mb-2">Konfirmasi Hapus</h3>
        <p className="!text-gray-400 body-text !text-sm mb-6">
          {isAll 
            ? "Tindakan ini akan menghapus SEMUA data pada kategori ini." 
            : "Data yang dihapus tidak dapat dikembalikan."}
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 font-note text-gray-400 hover:text-white transition hover:cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-note shadow-lg transition transform active:scale-95 hover:cursor-pointer">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const getWeatherLabel = (val) => {
  if (val == 0 || val === "Rain") return "🌧️ Hujan";
  if (val == 1 || val === "Cloudy") return "☁️ Berawan";
  if (val == 2 || val === "Sunny") return "☀️ Cerah";
  return val;
};

const SummaryPlan = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("mining");
  const [allPlans, setAllPlans] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
      if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
    }, [location.state]);

  useEffect(() => {
    const savedPlans = localStorage.getItem("finalizedPlans");
    if (savedPlans) {
      setAllPlans(JSON.parse(savedPlans));
    }
  }, []);

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
    <div className="w-full animate-fade-in-up pb-20">
      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={executeDelete} 
        isAll={deleteTarget && deleteTarget.toString().startsWith('cat_')}
      />

      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="heading-1">Finalized Summary Plan</h2>
          <p className="note">
            Riwayat rencana kerja yang telah disetujui.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex bg-[#181818] p-2 rounded-lg">
                <button
                onClick={() => setActiveTab("mining")}
                className={`px-6 py-2 rounded-md transition-all ${
                    activeTab === "mining" ? "bg-primary body-text !text-sm shadow-lg" : "body-text !text-gray-400 !text-sm hover:text-white hover:cursor-pointer"
                }`}
                >
                Mining Plan
                </button>
                <button
                onClick={() => setActiveTab("shipping")}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                    activeTab === "shipping" ? "bg-primary body-text !text-sm shadow-lg" : "body-text !text-gray-400 !text-sm hover:text-white hover:cursor-pointer"
                }`}
                >
                Shipping Plan
                </button>
            </div>
          </div>
          <div className="flex justify-end w-full">
                {filteredData.length > 0 && (
            <button onClick={promptDeleteCategory} className="note !text-red-400 hover:bg-red-500/10 hover:cursor-pointer px-3 py-1 rounded flex    items-center gap-1 transition border border-red-800">
                <MdDelete /> Hapus Semua {activeTab === "mining" ? "Mining" : "Shipping"}
            </button>
          )}
          </div>
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
                <div key={index} className="card rounded-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                    <div className="flex gap-x-10 items-center">
                    <h3 className="heading-2">
                    <span className="text-[#AA14F0] font-mono mr-2">{plan.id}</span>
                        - Summary Plan
                    </h3>
                    <p className="date">
                        Dibuat pada: {plan.date}
                    </p>
                    </div>
                    <div className="flex gap-x-10 items-center">
                    <div className="flex date h-fit">
                        {plan.status || "Finalized"}
                    </div>
                    <button onClick={() => promptDeleteOne(plan.id)} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-white/5 transition hover:cursor-pointer">
                            <MdDelete size={20} />
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="heading-2 !text-font my-4">📝 Hasil Analisis Agent</h4>
                    <div className="bg-white/5 p-3 rounded-lg mb-4">
                    <p className="body-text">
                        "{plan.analysis || "Tidak ada data analisis detail."}"
                    </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ResourceItem label={config.u} value={`${plan.trucks || 0} Unit`} icon={config.iconU} />
                    <ResourceItem label={config.a} value={`${plan.excavators || 0} ${config.unitA}`} icon={config.iconA} />
                    <ResourceItem label={config.s} value={`${plan.operators || 0} ${config.unitS}`} icon={config.iconS} />
                    <ResourceItem label="Cuaca" value={getWeatherLabel(plan.weather)} icon="🌦️" />
                </div>

                <div>
                    <h4 className="heading-2 !text-font my-4">📊 Status Operasional Saat Ini</h4>
                    <div className="grid grid-cols-3 gap-4 bg-white/5 p-3 rounded-lg mb-4">
                    <div className="text-center border-r border-white/10">
                        <p className="body-text !text-font">Target</p>
                        <p className="body-text">{plan.target} Ton</p> 
                    </div>
                    <div className="text-center border-r border-white/10">
                        <p className="body-text !text-font">Prediksi</p>
                        <p className="body-text">{plan.prediction} Ton</p>
                    </div>
                    <div className="text-center">
                        <p className="body-text !text-font">Gap (Selisih)</p>
                        <p className={`body-text ${parseInt(plan.prediction) > (plan.target) ? "!text-red-400" : "!text-green-400"}`}>
                        {plan.gap} Ton
                        </p>
                    </div>
                    </div>
                </div>

                </div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-[#2F2F2F]/30 rounded-xl border border-dashed border-gray-600">
            <h2 className="heading-2">Belum ada {activeTab === "mining" ? "Mining" : "Shipping"} Plan yang difinalisasi.</h2>
            <p className="body-text !text-sm">Silakan lakukan analisis di halaman "Tanyakan" dan klik Finalisasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceItem = ({ label, value, icon }) => (
  <div className="bg-[#2F2F2F] p-3 rounded-lg border border-white/5 flex items-center gap-3">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
      <p className={`font-bold text-white`}>{value}</p>
    </div>
  </div>
);

export default SummaryPlan;