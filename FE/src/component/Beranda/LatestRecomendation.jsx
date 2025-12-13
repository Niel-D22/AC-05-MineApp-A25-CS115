import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiClipboard, FiArrowRight } from "react-icons/fi";

const LatestRecomendation = () => {
  const navigate = useNavigate();
  const [latestRec, setLatestRec] = useState();
  const [latestPlans, setLatestPlans] = useState([]);

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem("aiHistory") || "[]");
    const planData = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");

    if (historyData.length > 0) {
      setLatestRec(historyData[0]);
    }
    if (planData.length > 0) {
      setLatestPlans(planData.slice(0, 2));
    }
  },[]);

  return (
    <div className="gap-y-10 flex flex-col items-center">
      {/* --- KARTU 2: SUMMARY PLAN TERBARU --- */}
      <h1 className="heading-1"><span className="heading-1 !text-font">Summary Plan</span> Terbaru</h1>
      <div className="flex w-full gap-x-10">
        {latestPlans.length > 0 ? (
          latestPlans.map((plan, index) => (
              <div key={index} className="card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                        <FiClipboard size={24} />
                      </div>
                      <div>
                        <h3 className="heading-2">
                          Summary Plan
                        </h3>
                        <p className="note">
                          {index === 0 ? "Terbaru" : "Sebelumnya"}
                        </p>
                      </div>
                    </div>
                    
                    <span className="date rounded-lg !bg-primary !text-text-body">
                      {plan.status || "Finalized"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="body-text">
                        ID : {plan.id}
                      </p>
                      
                      <span className='date !text-lg'>
                        {plan.type}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 bg-white/5 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="note">Analysis :</span>
                        <span className="body-text !text-sm">{plan.analysis}</span>
                        <div className="flex gap-x-10">
                          <div className="flex flex-col">
                            <span className="note">Truk</span>
                            <span className="body-text !text-sm">🚛 {plan.trucks}</span>
                          </div>
                          <div className="flex flex-col">
                              <span className="note">Excavator</span>
                              <span className="body-text !text-sm">🏗️ {plan.excavators}</span>
                          </div>
                          <div className="flex flex-col">
                              <span className="note">Operator</span>
                              <span className="body-text !text-sm">👷 {plan.operators}</span>
                          </div>
                          <div className="flex flex-col">
                              <span className="note">Weather</span>
                              <span className="body-text !text-sm">☀️ {plan.weather}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/home/rekomendasi", { state: { activeTab: plan.type === 'Shipping' ? 'shipping' : 'mining' } })}
                  className="note hover:cursor-pointer hover:underline flex items-center mt-4"
                >
                  Lihat Detail Plan <FiArrowRight />
                </button>
              </div>
          ))
        ) : (
          <div className="card flex items-center justify-center p-8">
            <p className="text-gray-500 italic">Belum ada Plan yang difinalisasi.</p>
          </div>
        )}
      </div>

      {/* --- KARTU 1: REKOMENDASI TERAKHIR --- */}
      <h1 className="heading-1"><span className="heading-1 !text-font">Rekomendasi</span> Terbaru</h1>
      <div className="card flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                <FiActivity size={24} />
              </div>
              <div>
                <h2 className="heading-2">Rekomendasi terbaru</h2>
                <p className="note">Berdasarkan riwayat tanya jawab AI terbaru</p>
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
              <span className="date !text-lg">
                  {latestRec.type || "Mining"} plan
              </span>
              <p className="heading-2 !text-lg my-4">
                "{latestRec.title}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 my-4">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="block note">Prediksi</span>
                  <span className="body-text !text-2xl">{latestRec.prediction} Ton</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                   <span className="block note">Gap</span>
                   <span className="body-text !text-2xl">{latestRec.gap} Ton</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="body-text !text-2xl">
              Belum ada riwayat aktivitas.
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate("/home/rekomendasi")}
          className="note hover:cursor-pointer hover:underline flex items-center"
        >
          Lihat Semua Riwayat <FiArrowRight />
        </button>
      </div> 
    </div>
  );
};

export default LatestRecomendation;