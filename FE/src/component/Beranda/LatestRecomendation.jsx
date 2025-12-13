import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiActivity } from "react-icons/fi";
import { 
  MdLocalShipping, MdEngineering, MdPerson, 
  MdInventory, MdTimer, MdWbSunny
} from "react-icons/md";

const LatestRecomendation = () => {
  const navigate = useNavigate();
  const [latestRec, setLatestRec] = useState(null);
  const [latestPlans, setLatestPlans] = useState([]);

  const getWeatherLabel = (val) => {
    if (val == 0 || val === "0" || val === "Light Rain" || val === "Rain") return "Hujan";
    if (val == 1 || val === "1" || val === "Cloudy") return "Berawan";
    if (val == 2 || val === "2" || val === "Sunny") return "Cerah";
    return val || "-";
  };

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem("aiHistory") || "[]");
    if (historyData.length > 0) {
      setLatestRec(historyData[0]);
    }

    const planData = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");
    if (planData.length > 0) {
      setLatestPlans(planData.slice(0, 2));
    }
  }, []);

  return (
    <div className="gap-y-10 flex flex-col w-full">
      
      {/* BAGIAN 1: REKOMENDASI TERAKHIR (Kode Anda) */}
      <div className="w-full">
          <div className="flex justify-between items-end mb-4">
            <h1 className="heading-1"><span className="text-font">Rekomendasi</span> Terbaru</h1>
            <span className="note text-xs text-gray-400 pb-1">Berdasarkan riwayat tanya jawab AI</span>
          </div>
          
          <div className="card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <h2 className="heading-2">Aktivitas Terakhir</h2>
                    <p className="note">Riwayat analisis AI</p>
                  </div>
                </div>
                {latestRec && (
                  <span className="date">
                    {latestRec.date}
                  </span>
                )}
              </div>

              {latestRec ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 uppercase tracking-wider text-gray-300">
                      {latestRec.type || "Mining"} plan
                  </span>
                  <p className="heading-2 !text-lg my-4 line-clamp-2">
                    "{latestRec.title}"
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 my-4">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="block note text-[10px] uppercase">Prediksi</span>
                      <span className="body-text !text-xl font-bold text-primary">{latestRec.prediction} T</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                       <span className="block note text-[10px] uppercase">Gap</span>
                       <span className="body-text !text-xl font-bold">{latestRec.gap} T</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="body-text !text-lg text-gray-500 py-4 text-center">
                  Belum ada riwayat aktivitas.
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate("/home/rekomendasi")}
              className="note hover:underline hover:cursor-pointer transition-colors flex items-center gap-2 text-sm mt-4 pt-4 border-t border-white/10"
            >
              Lihat Semua Riwayat <FiArrowRight />
            </button>
          </div> 
      </div>

      {/* BAGIAN 2: SUMMARY PLAN TERBARU (Kode Update dengan Logika Mining/Shipping) */}
      <div className="w-full">
        <div className="flex justify-between items-end mb-4">
            <h1 className="heading-1"><span className="text-font">Summary Plan</span> Final</h1>
            <button 
            onClick={() => navigate("/home/summary-plan")}
            className="note hover:underline hover:cursor-pointer flex items-center gap-2 text-sm pb-1"
            >
            Lihat Semua <FiArrowRight />
            </button>
        </div>

        <div className="flex w-full gap-x-6"> 
            {latestPlans.length > 0 ? (
            latestPlans.map((plan, index) => {
                
                const isShipping = plan.type === "Shipping";

                const config = isShipping ? {
                    labelUnit: "Transport",
                    labelAlat: "Stockpile",
                    labelSdm: "Loading",
                    unitSdm: "Jam",
                    unitAlat: "Ton",
                    iconUnit: <MdLocalShipping className="text-blue-400 text-xl"/>,
                    iconAlat: <MdInventory className="text-orange-400 text-xl"/>,
                    iconSdm: <MdTimer className="text-purple-400 text-xl"/>
                } : {
                    labelUnit: "Unit Truk",
                    labelAlat: "Ekskavator",
                    labelSdm: "Operator",
                    unitSdm: "Org",
                    unitAlat: "Unit",
                    iconUnit: <MdLocalShipping className="text-red-400 text-xl"/>,
                    iconAlat: <MdEngineering className="text-yellow-400 text-xl"/>,
                    iconSdm: <MdPerson className="text-blue-400 text-xl"/>
                };

                return (
                <div key={index} className="card flex flex-col justify-between w-1/2 bg-[#1e1e1e]">
                    
                    <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-3">
                    <div className="flex-1 pr-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${isShipping ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"}`}>
                            {plan.type || "Mining"}
                        </span>
                        <h3 className="heading-2 !text-lg mt-2 line-clamp-1" title={plan.title}>
                            {plan.title}
                        </h3>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="note !text-[10px]">ID PLAN</p>
                        <p className="font-mono text-sm font-bold text-white">{plan.id}</p>
                    </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-justify p-2 bg-white/5 rounded-lg border border-white/5">
                        <p className="note ">Prediksi Output</p>
                        <p className="body-text !text-sm ">{plan.analysis}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-center mb-1">{config.iconUnit}</div>
                            <p className="note !text-[10px] uppercase mb-0.5">{config.labelUnit}</p>
                            <p className="body-text !text-sm font-bold">{plan.trucks} Unit</p>
                        </div>

                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-center mb-1">{config.iconAlat}</div>
                            <p className="note !text-[10px] uppercase mb-0.5">{config.labelAlat}</p>
                            <p className="body-text !text-sm font-bold">{plan.excavators} {config.unitAlat}</p>
                        </div>

                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-center mb-1">{config.iconSdm}</div>
                            <p className="note !text-[10px] uppercase mb-0.5">{config.labelSdm}</p>
                            <p className="body-text !text-sm font-bold">{plan.operators} {config.unitSdm}</p>
                        </div>

                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex justify-center mb-1">
                            <MdWbSunny className="text-yellow-500 text-xl"/>
                          </div>
                          <p className="note !text-[10px] uppercase mb-0.5">Cuaca</p>
                          <p className="body-text !text-sm font-bold truncate">
                            {getWeatherLabel(plan.weather)}
                          </p>
                      </div>
                    </div>

                    <div className="mb-4">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <p className="note !text-[10px]">Prediksi Output</p>
                            <p className="body-text !text-lg text-primary">{plan.prediction} T</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <p className="note !text-[10px]">Gap Target</p>
                            <p className={`body-text !text-lg ${parseFloat(plan.gap) > 0 ? "text-red-400" : "text-green-400"}`}>
                            {plan.gap} T
                            </p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <p className="note !text-[10px]">Gap Target</p>
                            <p className={`body-text !text-lg ${parseFloat(plan.gap) > 0 ? "text-red-400" : "text-green-400"}`}>
                            {plan.target} T
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end date !w-fit">
                        <FiCalendar /> {plan.date}
                    </div>
                    </div>

                </div>
                );
            })
            ) : (
            <div className="w-full card flex flex-col items-center justify-center">
                <div className="p-3 bg-gray-800 rounded-full mb-3 opacity-50">
                    <FiCalendar size={20} className="text-gray-400"/>
                </div>
                <p className="body-text text-gray-400">Belum ada Plan Final.</p>
                <p className="small-text mt-1">Lakukan analisis dan finalisasi di menu Tanyakan.</p>
            </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default LatestRecomendation;