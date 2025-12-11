import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Helper untuk ikon cuaca (Sederhana)
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

  const handleDelete = (idToDelete) => {
    const updatedPlans = allPlans.filter(plan => plan.id !== idToDelete);
    setAllPlans(updatedPlans);
    localStorage.setItem("finalizedPlans", JSON.stringify(updatedPlans));

    console.log(`Plan dengan ID ${idToDelete} telah dihapus.`);
  };

  const filteredData = allPlans.filter(
    (item) => item.type.toLowerCase() === activeTab
  );

  return (
    <div className="w-full animate-fade-in-up pb-20">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="heading-1">Finalized Summary Plan</h2>
          <p className="note">
            Riwayat rencana kerja yang telah disetujui.
          </p>
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
      </div>

      {/* --- LIST KARTU SUMMARY PLAN --- */}
      <div className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((plan, index) => (
            <div 
              key={index} 
              className="card rounded-lg"
            >
              {/* 1. HEADER: ID - TITLE - TANGGAL */}
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
                  <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5"
                  title="Hapus Plan">
                  <span className="text-lg">🗑️</span> 
                  </button>
                </div>
              </div>

              {/* 2. HASIL ANALISIS */}
              <div className="mb-6">
                <h4 className="heading-2 !text-font my-4">📝 Hasil Analisis Agent</h4>
                <div className="bg-white/5 p-3 rounded-lg mb-4">
                  <p className="body-text">
                    "{plan.analysis || "Tidak ada data analisis detail."}"
                  </p>
                </div>
              </div>

              {/* 3. DETAIL RESOURCES (GRID 4 KOLOM) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col bg-white/5 p-3 rounded-lg mb-4 gap-x-4">
                  <span className="body-text !text-font">Truk</span>
                  <span className="body-text">🚛{`${plan.trucks || 0} Unit`}</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg mb-4 gap-x-4">
                  <span className="body-text !text-font">Ekskavator</span>
                  <span className="body-text">🏗️{`${plan.excavators || 0} Unit`}</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg mb-4 gap-x-4">
                  <span className="body-text !text-font">Operator</span>
                  <span className="body-text">👷{`${plan.operators || 0} Orang`}</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg mb-4 gap-x-4">
                  <span className="body-text !text-font">Cuaca</span>
                  <span className="body-text">🌦️{getWeatherLabel(plan.weather)}</span>
                </div>
              </div>

              {/* 4. STATUS OPERASIONAL SAAT INI */}
              <div>
                <h4 className="heading-2 !text-font my-4">📊 Status Operasional Saat Ini</h4>
                <div className="grid grid-cols-3 gap-4 bg-white/5 p-3 rounded-lg mb-4">
                  <div className="text-center border-r border-white/10">
                    <p className="body-text !text-font">Target</p>
                    {/* Tambahkan " Ton" di sini */}
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
          ))
        ) : (
          <div className="text-center p-12 bg-[#2F2F2F]/30 rounded-xl border border-dashed border-gray-600">
            <p className="text-gray-500 text-lg">Belum ada Summary Plan yang difinalisasi.</p>
            <p className="text-gray-600 text-sm mt-2">Silakan lakukan analisis di halaman "Tanyakan" dan klik Finalisasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Komponen Kecil untuk Item Resource
const ResourceItem = ({ label, value, icon, color }) => (
  <div className="bg-[#2F2F2F] p-3 rounded-lg border border-white/5 flex items-center gap-3">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
      <p className={`font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default SummaryPlan;