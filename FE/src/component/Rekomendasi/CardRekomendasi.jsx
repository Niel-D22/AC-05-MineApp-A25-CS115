import React, { useState, useEffect } from "react";
import {
  MdLocalShipping,
  MdConstruction,
  MdEngineering,
  MdDirectionsBoat,
  MdInventory2,
  MdAccessTime,
  MdWbSunny,
  MdCloud,
  MdGrain,
  MdTrackChanges,
  MdShowChart,
  MdCompareArrows,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

/* ===== WEATHER BADGE ===== */
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
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
};

/* ===== STATUS TAG ===== */
const UrgencyTag = ({ hasPlan }) => (
  <span
    className={`px-2 py-1 rounded-lg text-xs font-bold ${
      hasPlan ? "bg-primary text-white" : "bg-gray-500/20 text-gray-300"
    }`}
  >
    {hasPlan ? "Finalized" : "Draft"}
  </span>
);

const CardRekomendasi = () => {
  const [historyData, setHistoryData] = useState([]);
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  /* ===== RESPONSIVE CARD COUNT ===== */
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("aiHistory");
    if (saved) setHistoryData(JSON.parse(saved));
  }, []);

  const totalCards = historyData.length;

  const next = () => {
    if (index < totalCards - visibleCards) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (historyData.length === 0) {
    return (
      <div className="card text-center p-12">
        <p>Belum ada riwayat rekomendasi AI.</p>
        <p className="text-sm mt-2 text-gray-400">
          Lakukan analisis untuk mendapatkan rekomendasi.
        </p>
      </div>
    );
  }

  /* ===== ICON MAPPING ===== */
  const getConfig = (item) => {
    if (item.type === "Shipping") {
      return {
        a: [
          "Transport",
          item.trucks,
          "Ton",
          <MdDirectionsBoat className="text-blue-400" />,
        ],
        b: [
          "Stock",
          item.excavators,
          "Ton",
          <MdInventory2 className="text-orange-400" />,
        ],
        c: [
          "Loading",
          item.operators,
          "Jam",
          <MdAccessTime className="text-purple-400" />,
        ],
      };
    }
    return {
      a: [
        "Truk",
        item.trucks,
        "Unit",
        <MdLocalShipping className="text-red-400" />,
      ],
      b: [
        "Ekskavator",
        item.excavators,
        "Unit",
        <MdConstruction className="text-yellow-400" />,
      ],
      c: [
        "Operator",
        item.operators,
        "Orang",
        <MdEngineering className="text-green-400" />,
      ],
    };
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6">
      {/* NAV BUTTON */}
      {index > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary p-2 sm:p-3 rounded-lg"
        >
          <MdChevronLeft size={22} />
        </button>
      )}
      {index < totalCards - visibleCards && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary p-2 sm:p-3 rounded-lg"
        >
          <MdChevronRight size={22} />
        </button>
      )}

      {/* CAROUSEL */}
      <div className="overflow-hidden py-4">
        <div
          className="flex gap-4 transition-transform duration-500"
          style={{
            transform: `translateX(-${index * (100 / visibleCards)}%)`,
          }}
        >
          {historyData.map((item, i) => {
            const cfg = getConfig(item);

            return (
              <div
                key={i}
                className="shrink-0"
                style={{ width: `${100 / visibleCards}%` }}
              >
                <div className="card h-full flex flex-col justify-between">
                  {/* HEADER */}
                  <div className="flex justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-400">{item.date}</span>
                      <p className="text-xs mt-1">{item.type} Plan</p>
                    </div>
                    <UrgencyTag hasPlan={!!item.summaryId} />
                  </div>

                  {/* TITLE */}
                  <h2 className="text-base sm:text-lg font-bold mb-3 line-clamp-2">
                    {item.title}
                  </h2>

                  {/* STATUS */}
                  <div className="bg-white/5 p-3 rounded-lg mb-4 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <MdTrackChanges /> Target
                      </span>
                      <span>{item.target} Ton</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <MdShowChart /> Output
                      </span>
                      <span>{item.prediction} Ton</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <MdCompareArrows /> Gap
                      </span>
                      <span
                        className={`font-bold ${
                          item.gap > 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {item.gap} Ton
                      </span>
                    </div>
                  </div>

                  {/* CONFIG */}
                  <ul className="space-y-2 text-sm">
                    {[cfg.a, cfg.b, cfg.c].map(([l, v, u, ic], idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="w-5">{ic}</span>
                        <span className="min-w-[80px]">{l}</span>
                        <span>
                          {v} {u}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3">
                      <span className="w-5">🌦️</span>
                      <span className="min-w-[80px]">Cuaca</span>
                      <WeatherBadge val={item.weather} />
                    </li>
                  </ul>

                  {/* FOOTER */}
                  {item.summaryId && (
                    <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs">
                      Terhubung ke Plan
                      <div className="mt-1 font-mono">{item.summaryId}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardRekomendasi;
