import React, { useState, useEffect } from "react";

// Helper untuk ikon cuaca (Sederhana)
const getWeatherLabel = (val) => {
  if (val == 0 || val === "Rain") return "🌧️ Hujan";
  if (val == 1 || val === "Cloudy") return "☁️ Berawan";
  if (val == 2 || val === "Sunny") return "☀️ Cerah";
  return val;
};

const SummaryPlan = () => {
  const [activeTab, setActiveTab] = useState("mining");
  const [allPlans, setAllPlans] = useState([]);

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
        <div>
          <h2 className="text-3xl font-bold text-white font-syne">Finalized Summary Plan</h2>
          <p className="text-gray-400 mt-1 font-inter">
            Riwayat rencana kerja yang telah disetujui.
          </p>
        </div>

        <div className="flex bg-[#2F2F2F] p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveTab("mining")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "mining" ? "bg-[#AA14F0] text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            Mining Plan
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "shipping" ? "bg-[#AA14F0] text-white shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            Shipping Plan
          </button>
        </div>
      </div>

      {/* --- LIST KARTU SUMMARY PLAN --- */}
      <div className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((plan, index) => (
            <div 
              key={index} 
              className="bg-[#2F2F2F]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-[#AA14F0]/50 transition-all duration-300"
            >
              {/* 1. HEADER: ID - TITLE - TANGGAL */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div className="flex gap-x-10">
                  <h3 className="text-xl font-bold text-white font-syne">
                  <span className="text-[#AA14F0] font-mono mr-2">{plan.id}</span>
                    - Summary Plan
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 font-inter">
                    Dibuat pada: {plan.date}
                  </p>
                </div>
                <div className="flex gap-x-10">
                  <div className="flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
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
                <h4 className="text-sm font-bold text-gray-300 uppercase mb-2">📝 Hasil Analisis Agent</h4>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{plan.analysis || "Tidak ada data analisis detail."}"
                  </p>
                </div>
              </div>

              {/* 3. DETAIL RESOURCES (GRID 4 KOLOM) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ResourceItem label="Truk" value={`${plan.trucks || 0} Unit`} icon="🚛" color="text-blue-400" />
                <ResourceItem label="Ekskavator" value={`${plan.excavators || 0} Unit`} icon="🏗️" color="text-yellow-400" />
                <ResourceItem label="Operator" value={`${plan.operators || 0} Orang`} icon="👷" color="text-orange-400" />
                <ResourceItem label="Cuaca" value={getWeatherLabel(plan.weather)} icon="🌦️" color="text-cyan-400" />
              </div>

              {/* 4. STATUS OPERASIONAL SAAT INI */}
              <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase mb-3">📊 Status Operasional Saat Ini</h4>
                <div className="grid grid-cols-3 gap-4 bg-[#1a1a1a]/50 p-4 rounded-xl border border-white/10">
                  <div className="text-center border-r border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    {/* Tambahkan " Ton" di sini */}
                    <p className="text-lg font-bold text-white">{plan.target} Ton</p> 
                  </div>
                  <div className="text-center border-r border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Prediksi</p>
                    <p className="text-lg font-bold text-yellow-400">{plan.prediction} Ton</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Gap (Selisih)</p>
                    <p className={`text-lg font-bold ${parseInt(plan.gap) > 0 ? "text-red-400" : "text-green-400"}`}>
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