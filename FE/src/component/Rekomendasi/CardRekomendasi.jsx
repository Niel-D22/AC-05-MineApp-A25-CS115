import React, { useState, useEffect } from "react";

// Helper Sederhana untuk Label Cuaca
const getWeatherLabel = (val) => {
  // Menangani angka (0,1,2) atau text ("Sunny", dll)
  if (val == 0 || val === "Light Rain") return "🌧️ Hujan";
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

  useEffect(() => {
    const savedHistory = localStorage.getItem("aiHistory");
    if (savedHistory) {
      setHistoryData(JSON.parse(savedHistory));
    }
  }, []);

  const visibleCards = 3;
  const totalCards = historyData.length;

  const next = () => {
    if (index < totalCards - visibleCards) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (historyData.length === 0) {
    return (
      <div className="text-center p-12 card">
        <p>Belum ada riwayat rekomendasi AI.</p>
        <p className="text-sm mt-2">Lakukan analisis di halaman "Tanyakan" untuk mendapatkan rekomendasi.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Tombol Navigasi */}
      {index > 0 && (
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition hover:cursor-pointer">
          ‹
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition
        hover:cursor-pointer">
          ›
        </button>
      )}

      <div className="overflow-hidden text-start py-4">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / 3 + 2)}%)` }} // Logic sliding yang lebih halus
        >
          {historyData.map((item, i) => (
            <div
              key={i}
              className="card shrink-0 flex flex-col justify-between"
              style={{ width: "calc((100% - 48px) / 3)", minHeight: "420px" }}
            >
              <div>
                {/* HEADER: Tanggal & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-y-4">
                    <span className="date w-fit">{item.date}</span>
                    
                    {/* --- TAMBAHKAN BAGIAN INI (TYPE BADGE) --- */}
                    <span className={`date !text-lg`}>
                        {item.type || 'Mining'} Plan
                    </span>
                    {/* ----------------------------------------- */}
                  </div>

                  <UrgencyTag hasPlan={!!item.summaryId} />
                </div>

                {/* JUDUL */}
                <h2 className="heading-2 my-4">
                  {item.title}
                </h2>

                {/* STATUS OPERASIONAL (Baru) */}
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

                {/* DETAIL RESOURCES */}
                <h3 className="note !text-text-body my-4">Konfigurasi AI</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span>🚛</span> <span className="note">Truk:</span> <span className="body-text !text-sm">{item.trucks} Unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏗️</span> <span className="note">Ekskavator:</span> <span className="body-text !text-sm">{item.excavators} Unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👷</span> <span className="note">Operator:</span> <span className="body-text !text-sm">{item.operators} Orang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌦️</span> <span className="note">Cuaca:</span> <span className="body-text !text-sm">{getWeatherLabel(item.weather)}</span>
                  </li>
                </ul>
              </div>

              {/* FOOTER: ID LINK */}
              {item.summaryId && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="note text-center !text-xs mb-4">Terhubung ke Summary Plan:</p>
                  <div className="date !text-xs text-center">
                    {item.summaryId}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardRekomendasi;