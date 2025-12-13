import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Menggunakan paket Icons yang sama dengan SummaryPlan agar konsisten
import { 
  MdLocalShipping, MdConstruction, MdEngineering, 
  MdDirectionsBoat, MdInventory2, MdAccessTime,
  MdWbSunny, MdCloud, MdGrain, MdArrowForward, MdAnalytics, MdAssignment
} from "react-icons/md";

// Helper Icon Cuaca
const getWeatherIcon = (val) => {
  if (val == 0 || val === "Light Rain") return <MdGrain className="text-blue-300"/>;
  if (val == 1 || val === "Cloudy") return <MdCloud className="text-gray-400"/>;
  if (val == 2 || val === "Sunny") return <MdWbSunny className="text-yellow-400"/>;
  return <MdWbSunny className="text-gray-500"/>;
};

const LatestRecomendation = () => {
  const navigate = useNavigate();
  const [latestRec, setLatestRec] = useState(null);
  const [latestPlans, setLatestPlans] = useState([]);

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem("aiHistory") || "[]");
    const planData = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");

    if (historyData.length > 0) setLatestRec(historyData[0]);
    if (planData.length > 0) setLatestPlans(planData.slice(0, 2)); // Ambil 2 plan terakhir saja agar layout pas
  },[]);

  // --- LOGIKA MAPPING DATA (Agar tidak kosong saat Shipping) ---
  const getPlanConfig = (type, data) => {
    const isShipping = (type || "").toLowerCase() === "shipping";
    
    if (isShipping) {
      return [
        { label: "Transport", val: data.transport_capacity, unit: "Ton", icon: <MdDirectionsBoat className="text-blue-400"/> },
        { label: "Stock",     val: data.stock,              unit: "Ton", icon: <MdInventory2 className="text-orange-400"/> },
        { label: "Loading",   val: data.loading_time,       unit: "Jam", icon: <MdAccessTime className="text-purple-400"/> },
      ];
    } else {
      return [
        { label: "Trucks",    val: data.trucks,     unit: "Unit",  icon: <MdLocalShipping className="text-red-400"/> },
        { label: "Excavator", val: data.excavators, unit: "Unit",  icon: <MdConstruction className="text-yellow-400"/> },
        { label: "Operator",  val: data.operators,  unit: "Orang", icon: <MdEngineering className="text-green-400"/> },
      ];
    }
  };

  return (
    <div className="w-full flex flex-col gap-12 animate-fade-in-up">
      
      {/* --- SECTION 1: LATEST SUMMARY PLANS --- */}
      <div className="w-full">
        <div className="flex justify-between items-end mb-6">
          <h2 className="heading-1">
            <span className="text-font">Summary Plan</span> Terbaru
          </h2>
          <button 
            onClick={() => navigate("/home/rekomendasi", { state: { activeTab: 'mining' } })}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors group"
          >
            Lihat Semua <MdArrowForward className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestPlans.length > 0 ? (
            latestPlans.map((plan, index) => {
              // Ambil konfigurasi display (Icon & Label)
              const stats = getPlanConfig(plan.type, plan);

              return (
                <div key={index} className="card group hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-white/5 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-lg">
                            <MdAssignment size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white leading-none">
                                {plan.type || "Mining"} Plan
                            </h3>
                            {index === 0 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold tracking-wider">NEW</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-mono">{plan.id}</p>
                        </div>
                        </div>
                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        {plan.status || "Finalized"}
                        </span>
                    </div>

                    {/* Metrics Grid (4 Kolom Rapi) */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {stats.map((stat, i) => (
                        <div key={i} className="bg-[#1a1a1a] p-2 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center h-20 hover:bg-white/5 transition-colors">
                            <span className="text-lg mb-1">{stat.icon}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">{stat.label}</span>
                            <span className="text-xs font-bold text-white mt-0.5">{stat.val || 0}</span>
                        </div>
                        ))}
                        
                        {/* Kolom 4: Cuaca (Selalu Ada) */}
                        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center h-20 hover:bg-white/5 transition-colors">
                            <span className="text-lg mb-1">{getWeatherIcon(plan.weather)}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">Cuaca</span>
                            <span className="text-[10px] text-white mt-0.5">{plan.weather || "-"}</span>
                        </div>
                    </div>

                    {/* Footer Analysis Preview
                    <div className="bg-white/5 p-3 rounded-lg text-xs text-gray-400 italic mb-4 line-clamp-2 border-l-2 border-purple-500/50">
                        "{plan.analysis || "Analisis lengkap tersedia di detail plan..."}"
                    </div> */}
                  </div>

                  <button 
                    onClick={() => navigate("/home/rekomendasi", { state: { activeTab: (plan.type || 'mining').toLowerCase() } })}
                    className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-primary text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Lihat Detail Plan <MdArrowForward className="group-hover/btn:translate-x-1 transition-transform"/>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 card border-dashed border-gray-700 flex flex-col items-center justify-center py-12 text-gray-500 bg-[#121212]">
              <MdAssignment size={40} className="mb-3 opacity-30"/>
              <p className="text-sm">Belum ada Summary Plan yang disetujui.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 2: LATEST AI INSIGHT --- */}
      <div className="w-full pb-10">
        <h2 className="heading-1 mb-6">
          <span className="text-font">Rekomendasi AI</span> Terakhir
        </h2>
        
        {latestRec ? (
          <div className="card relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              
              {/* Left: Icon & Main Info */}
              <div className="flex-1 flex items-start gap-5 w-full">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 shadow-inner border border-blue-500/20">
                  <MdAnalytics size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded uppercase tracking-wider">
                        {latestRec.type || "Mining"} Insight
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MdAccessTime className="text-[10px]"/> {latestRec.date}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                    {latestRec.title}
                  </h3>
                  
                  Stats Mini Horizontal
                  <div className="flex flex-wrap gap-4 mt-4">
                     <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-white/10 flex items-center gap-3">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Prediksi</div>
                        <div className="text-lg font-bold text-white">{latestRec.prediction} <span className="text-xs font-normal text-gray-500">Ton</span></div>
                     </div>
                     <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-white/10 flex items-center gap-3">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Gap</div>
                        <div className={`text-lg font-bold ${latestRec.gap > 0 ? "text-red-400" : "text-green-400"}`}>
                          {latestRec.gap} <span className="text-xs font-normal text-gray-500">Ton</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Right: Action Button */}
              <div className="w-full md:w-auto flex justify-end">
                <button 
                  onClick={() => navigate("/home/rekomendasi")}
                  className="group/btn flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all w-full md:w-auto justify-center"
                >
                  <span className="text-sm font-bold text-gray-300 group-hover/btn:text-white">Analisis Penuh</span>
                  <div className="bg-white/10 rounded-full p-1 group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
                    <MdArrowForward size={16}/>
                  </div>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="card border-dashed border-gray-700 flex flex-col items-center justify-center py-10 text-gray-500 bg-[#121212]">
             <MdAnalytics size={40} className="mb-3 opacity-30"/>
             <p className="text-sm">Belum ada riwayat tanya jawab dengan AI.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default LatestRecomendation;