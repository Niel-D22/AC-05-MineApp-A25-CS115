import React, { useState, useEffect } from "react";
// Import Icons
import { 
  MdLocalShipping, MdConstruction, MdEngineering, // Mining Icons
  MdDirectionsBoat, MdInventory2, MdAccessTime,   // Shipping Icons
  MdWbSunny, MdCloud, MdGrain,                    // Weather Icons
  MdTrackChanges, MdShowChart, MdCompareArrows,   // Status Icons
  MdChevronLeft, MdChevronRight                   // Nav Icons
} from "react-icons/md";

// Helper untuk Cuaca dengan Icon
const WeatherBadge = ({ val }) => {
  let icon = <MdWbSunny className="text-yellow-400" />;
  let label = "Cerah";

  if (val == 0 || val === "Light Rain") {
    icon = <MdGrain className="text-blue-300" />;
    label = "Hujan";
  } else if (val == 1 || val === "Cloudy") {
    icon = <MdCloud className="text-gray-400" />;
    label = "Berawan";
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="body-text !text-sm">{label}</span>
    </div>
  );
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

  // --- LOGIKA MAPPING ICON (Mining vs Shipping) ---
  const getDisplayConfig = (item) => {
    const isShipping = item.type === "Shipping";

    if (isShipping) {
      return {
        lbl1: "Transport", val1: item.trucks,      icon1: <MdDirectionsBoat className="text-blue-400" />, unit1: "Ton",
        lbl2: "Stock",     val2: item.excavators,  icon2: <MdInventory2 className="text-orange-400" />,   unit2: "Ton",
        lbl3: "Loading",   val3: item.operators,   icon3: <MdAccessTime className="text-purple-400" />,   unit3: "Jam"
      };
    } else {
      return {
        lbl1: "Truk",      val1: item.trucks,      icon1: <MdLocalShipping className="text-red-400" />,   unit1: "Unit",
        lbl2: "Ekskavator",val2: item.excavators,  icon2: <MdConstruction className="text-yellow-400" />, unit2: "Unit",
        lbl3: "Operator",  val3: item.operators,   icon3: <MdEngineering className="text-green-400" />,   unit3: "Orang"
      };
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Tombol Navigasi */}
      {index > 0 && (
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition hover:cursor-pointer">
          <MdChevronLeft size={24} />
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg z-20 shadow-lg hover:bg-purple-700 transition hover:cursor-pointer">
          <MdChevronRight size={24} />
        </button>
      )}

      <div className="overflow-hidden text-start py-4">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / 3 + 2)}%)` }}
        >
          {historyData.map((item, i) => {
            const config = getDisplayConfig(item);

            return (
              <div
                key={i}
                className="card shrink-0 flex flex-col justify-between"
                style={{ width: "calc((100% - 48px) / 3)", minHeight: "420px" }}
              >
                <div>
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-y-1">
                      <span className="date w-fit">{item.date}</span>
                      <span className={`date !text-xs !bg-white/10 w-fit`}>
                          {item.type || 'Mining'} Plan
                      </span>
                    </div>
                    <UrgencyTag hasPlan={!!item.summaryId} />
                  </div>

                  {/* JUDUL */}
                  <h2 className="heading-2 my-4 h-12 line-clamp-2">
                    {item.title}
                  </h2>

                  {/* STATUS OPERASIONAL */}
                  <div className="bg-white/5 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <MdTrackChanges className="text-gray-400" /> <span className="note">Target</span>
                      </div>
                      <span className="note !text-text-body">{item.target} Ton</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <MdShowChart className="text-gray-400" /> <span className="note">Output</span>
                      </div>
                      <span className="note !text-text-body">{item.prediction} Ton</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <MdCompareArrows className="text-gray-400" /> <span className="note">Gap</span>
                      </div>
                      <span className={`note font-bold ${item.gap > 0 ? "!text-red-400" : "!text-green-400"}`}>
                        {item.gap} Ton
                      </span>
                    </div>
                  </div>

                  {/* DETAIL RESOURCES (DINAMIS & IKON) */}
                  <h3 className="note !text-text-body my-4">Konfigurasi AI</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="text-lg w-6 flex justify-center">{config.icon1}</span> 
                      <span className="note min-w-[80px]">{config.lbl1}:</span> 
                      <span className="body-text !text-sm">{config.val1} {config.unit1}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-lg w-6 flex justify-center">{config.icon2}</span> 
                      <span className="note min-w-[80px]">{config.lbl2}:</span> 
                      <span className="body-text !text-sm">{config.val2} {config.unit2}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-lg w-6 flex justify-center">{config.icon3}</span> 
                      <span className="note min-w-[80px]">{config.lbl3}:</span> 
                      <span className="body-text !text-sm">{config.val3} {config.unit3}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-lg w-6 flex justify-center">🌦️</span> 
                      <span className="note min-w-[80px]">Cuaca:</span> 
                      <WeatherBadge val={item.weather} />
                    </li>
                  </ul>
                </div>

                {/* FOOTER */}
                {item.summaryId && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="note text-center !text-xs mb-2">Terhubung ke Plan:</p>
                    <div className="date !text-xs text-center mx-auto w-fit">
                      {item.summaryId}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardRekomendasi;