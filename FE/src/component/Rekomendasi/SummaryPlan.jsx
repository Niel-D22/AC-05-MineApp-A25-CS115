import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UseAuth } from "../../context/AuthContext";

import {
  MdDeleteOutline,
  MdFileDownload,
  MdLocalShipping,
  MdConstruction,
  MdEngineering,
  MdDirectionsBoat,
  MdInventory2,
  MdAccessTime,
  MdWbSunny,
  MdCloud,
  MdGrain,
  MdWarning,
  MdCheckCircle,
  MdLock, 
} from "react-icons/md";

// --- 2. IMPORT CUSTOM ALERTS ---
import { Toast, ConfirmModal } from "../CostumAlerts";

// --- HELPER: ICON CUACA ---
const getWeatherIcon = (val) => {
  if (val == 0 || val === "Rain" || val === "Light Rain")
    return (
      <div className="flex items-center gap-2 text-blue-300">
        <MdGrain className="text-xl" /> <span className="text-sm">Hujan</span>
      </div>
    );
  if (val == 1 || val === "Cloudy")
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <MdCloud className="text-xl" /> <span className="text-sm">Berawan</span>
      </div>
    );
  if (val == 2 || val === "Sunny")
    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <MdWbSunny className="text-xl" /> <span className="text-sm">Cerah</span>
      </div>
    );
  return (
    <div className="flex items-center gap-2 text-white">
      <MdWarning className="text-xl" />{" "}
      <span className="text-sm">{val || "-"}</span>
    </div>
  );
};

const SummaryPlan = () => {
  const location = useLocation();
  const { userRole } = UseAuth(); 

  const [activeTab, setActiveTab] = useState("mining");
  const [allPlans, setAllPlans] = useState([]);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

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

  const canDeletePlan = (planType) => {
    const pType = (planType || "Mining").toLowerCase(); 
    const uRole = (userRole || "").toLowerCase(); 

    if (uRole.includes("main") && pType === "mining") return true;
    if (uRole.includes("shipping") && pType === "shipping") return true;
    return false;
  };

  const handleRequestDelete = (plan) => {
    if (canDeletePlan(plan.type)) {
      setDeleteModal({ open: true, id: plan.id });
    } else {
      setToast({
        message: `Akses Ditolak! Role '${userRole}' tidak boleh menghapus data ${plan.type}.`,
        type: "error",
      });
    }
  };

  const confirmDelete = () => {
    const idToDelete = deleteModal.id;
    const updatedPlans = allPlans.filter((plan) => plan.id !== idToDelete);
    setAllPlans(updatedPlans);
    localStorage.setItem("finalizedPlans", JSON.stringify(updatedPlans));
    setDeleteModal({ open: false, id: null });
    setToast({
      message: "Plan berhasil dihapus dari riwayat.",
      type: "success",
    });
  };



  const filteredData = allPlans.filter(
    (item) => (item.type || "Mining").toLowerCase() === activeTab
  );

  return (
    // Gunakan Fragment agar Modal Sticky bekerja dengan baik
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Hapus Summary Plan?"
        message={`Apakah Anda yakin ingin menghapus data Plan ID: ${deleteModal.id}?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        confirmText="Ya, Hapus"
        isDanger={true}
      />

      <div className="w-full animate-fade-in-up pb-20">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-y-4">
            <div className="text-center md:text-left">
              <h2 className="heading-1 mb-2">Finalized Summary Plan</h2>
              <p className="note max-w-lg">
                Daftar rencana kerja operasional yang telah divalidasi oleh Agent AI.
              </p>
            </div>

            <div className="flex gap-3">
              {/* Switcher Tab */}
              <div className="flex bg-[#181818] p-1.5 rounded-xl border border-white/5 h-fit">
                <button
                  onClick={() => setActiveTab("mining")}
                  className={`px-6 py-2 rounded-lg transition-all font-medium text-sm ${activeTab === "mining" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Mining
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`px-6 py-2 rounded-lg transition-all font-medium text-sm ${activeTab === "shipping" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Shipping
                </button>
              </div>

              
            </div>
          </div>
        </div>

        {/* LIST CONTENT */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredData.length > 0 ? (
            filteredData.map((plan, index) => {
              const isShipping = (plan.type || "").toLowerCase() === "shipping";
              
              const col1 = isShipping
                ? { label: "Stockpile", val: plan.stock, icon: <MdInventory2 className="text-orange-400 text-xl" />, unit: "Ton" }
                : { label: "Unit Truk", val: plan.trucks, icon: <MdLocalShipping className="text-red-400 text-xl" />, unit: "Unit" };
              const col2 = isShipping
                ? { label: "Transport", val: plan.transport_capacity, icon: <MdDirectionsBoat className="text-blue-400 text-xl" />, unit: "Ton" }
                : { label: "Ekskavator", val: plan.excavators, icon: <MdConstruction className="text-yellow-400 text-xl" />, unit: "Unit" };
              const col3 = isShipping
                ? { label: "Loading Time", val: plan.loading_time, icon: <MdAccessTime className="text-purple-400 text-xl" />, unit: "Jam" }
                : { label: "Operator", val: plan.operators, icon: <MdEngineering className="text-green-400 text-xl" />, unit: "Orang" };
              
              const isGapBad = parseFloat(plan.prediction) < parseFloat(plan.target || plan.target_tonnage);
              const hasAccess = canDeletePlan(plan.type);

              return (
                <div key={index} className="bg-[#1e1e1e] border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-colors shadow-xl">
                  {/* HEADER KARTU */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isShipping ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                          {plan.type || "Mining"}
                        </span>
                        <h3 className="text-lg font-bold text-white font-mono">{plan.id}</h3>
                      </div>
                      <p className="text-xs text-gray-400">Dibuat pada: <span className="text-gray-300">{plan.date}</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                        <MdCheckCircle /> {plan.status || "Finalized"}
                      </div>

                      {hasAccess ? (
                        <button onClick={() => handleRequestDelete(plan)} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all" title="Hapus Plan Ini">
                          <MdDeleteOutline size={22} />
                        </button>
                      ) : (
                        <button disabled className="text-gray-600 cursor-not-allowed p-2 rounded-lg opacity-50" title="Akses Ditolak">
                          <MdLock size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* HASIL ANALISIS */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">📝 Analisis AI Agent</h4>
                    <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                      <p className="text-sm text-gray-300 italic leading-relaxed">"{plan.analysis || "Tidak ada data analisis detail."}"</p>
                    </div>
                  </div>

                  {/* DETAIL RESOURCES */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col1.label}</p>
                      <div className="flex items-center gap-2">{col1.icon}<span className="text-white font-bold">{col1.val || 0} <span className="text-xs font-normal text-gray-400">{col1.unit}</span></span></div>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col2.label}</p>
                      <div className="flex items-center gap-2">{col2.icon}<span className="text-white font-bold">{col2.val || 0} <span className="text-xs font-normal text-gray-400">{col2.unit}</span></span></div>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col3.label}</p>
                      <div className="flex items-center gap-2">{col3.icon}<span className="text-white font-bold">{col3.val || 0} <span className="text-xs font-normal text-gray-400">{col3.unit}</span></span></div>
                    </div>
                    <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Cuaca</p>
                      <div className="mt-1">{getWeatherIcon(plan.weather)}</div>
                    </div>
                  </div>

                  {/* STATUS OPERASIONAL */}
                  <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-xs text-gray-500 mb-1">Target</p><p className="text-lg font-bold text-white">{plan.target || plan.target_tonnage || 0} <span className="text-xs font-normal text-gray-400">Ton</span></p></div>
                    <div className="border-l border-r border-white/10"><p className="text-xs text-gray-500 mb-1">Prediksi Output</p><p className="text-lg font-bold text-yellow-400">{plan.prediction} <span className="text-xs font-normal text-gray-400">Ton</span></p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Gap (Selisih)</p><p className={`text-lg font-bold ${isGapBad ? "text-red-500" : "text-green-500"}`}>{plan.gap} <span className="text-xs font-normal text-gray-400">Ton</span></p></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-16 bg-[#1e1e1e] rounded-xl border border-dashed border-gray-700">
              <div className="bg-gray-800 p-4 rounded-full mb-4 text-gray-500">
                {activeTab === "mining" ? <MdLocalShipping size={40} /> : <MdDirectionsBoat size={40} />}
              </div>
              <p className="text-gray-300 text-lg font-medium">Belum ada {activeTab === "mining" ? "Mining" : "Shipping"} Plan.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SummaryPlan;