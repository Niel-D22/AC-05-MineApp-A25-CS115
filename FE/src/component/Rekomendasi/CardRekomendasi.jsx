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
      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
        hasPlan 
          ? "bg-green-500/20 text-green-400 border-green-500/50" 
          : "bg-gray-500/20 text-gray-400 border-gray-500/50"
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
      <div className="text-center p-12 bg-[#2F2F2F]/30 rounded-xl border border-dashed border-gray-600 text-gray-500">
        <p>Belum ada riwayat rekomendasi AI.</p>
        <p className="text-sm mt-2">Lakukan analisis di halaman "Tanyakan" untuk mendapatkan rekomendasi.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Tombol Navigasi */}
      {index > 0 && (
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#AA14F0] text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition">
          ‹
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#AA14F0] text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition">
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
              className="bg-card-glass shrink-0 rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col justify-between"
              style={{ width: "calc((100% - 48px) / 3)", minHeight: "420px" }}
            >
              <div>
                {/* HEADER: Tanggal & Status */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-gray-400">{item.date}</span>
                  <UrgencyTag hasPlan={!!item.summaryId} />
                </div>

                {/* JUDUL */}
                <h2 className="text-lg font-bold text-white mb-4 leading-tight line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h2>

                {/* STATUS OPERASIONAL (Baru) */}
                <div className="bg-[#1a1a1a]/60 p-3 rounded-lg border border-white/5 mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Target</span>
                    <span className="text-white font-bold">{item.target} Ton</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Output</span>
                    <span className="text-yellow-400 font-bold">{item.prediction} Ton</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                    <span className="text-gray-400">Gap</span>
                    <span className={`${parseInt(item.gap) > 0 ? "text-red-400" : "text-green-400"} font-bold`}>
                      {item.gap} Ton
                    </span>
                  </div>
                </div>

                {/* DETAIL RESOURCES */}
                <h3 className="font-bold text-[#BC8CF2] mb-2 text-xs uppercase tracking-wider">Konfigurasi AI</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span>🚛</span> Truk: <span className="text-white font-semibold">{item.trucks} Unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🏗️</span> Ekskavator: <span className="text-white font-semibold">{item.excavators} Unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>👷</span> Operator: <span className="text-white font-semibold">{item.operators} Orang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌦️</span> Cuaca: <span className="text-white font-semibold">{getWeatherLabel(item.weather)}</span>
                  </li>
                </ul>
              </div>

              {/* FOOTER: ID LINK */}
              {item.summaryId && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-center text-gray-500 mb-1">Terhubung ke Summary Plan:</p>
                  <div className="bg-[#AA14F0]/10 text-[#AA14F0] text-center text-xs font-mono py-1 rounded border border-[#AA14F0]/30">
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