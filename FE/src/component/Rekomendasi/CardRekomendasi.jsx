import React from "react";
import { useState } from "react";

const recommendations = [
  {
    id: 1,
    title: "Bahaya Slippery & Traksi Rendah",
    urgency: "Kritis",
    color: "red",
    analysis: [
      "Hujan lebat terdeteksi di Pit 2 & Ramp 3B.",
      "AI memprediksi traksi jalan turun 35%.",
      "Risiko unit selip meningkat drastis.",
    ],
    action: [
      "Batasi kecepatan Haul Truck maks 20 km/jam.",
      "Kirim Grader G-02 untuk perbaikan drainase Ramp 3B segera.",
    ],
  },
  {
    id: 2,
    title: "Optimasi Kontrol Debu PM10",
    urgency: "Sedang",
    color: "orange",
    analysis: [
      "Angin kencang 40 km/jam dari Timur Laut.",
      "Konsentrasi partikel debu (PM10) di Crusher 1 diprediksi melewati ambang batas dalam 15 menit.",
    ],
    action: [
      "Aktifkan Water Sprayer otomatis di Crusher 1.",
      "Alihkan rute Unit H-05 sementara waktu.",
      "Alihkan rute Unit H-05 sementara waktu.",
    ],
  },
  {
    id: 3,
    title: "Prediksi Kerusakan Excavator EX-201",
    urgency: "Kritis",
    color: "red",
    analysis: [
      "Sensor termal Excavator EX-201 mendeteksi overheat.",
      "Pola getaran mesin tidak normal (>3mm/s).",
      "Potensi Kerusakan mesin dalam 4 jam.",
    ],
    action: [
      "Hentikan operasi EX-201 segera.",
      "Hubungi tim mekanik untuk inspeksi hidrolik.",
    ],
  },
  {
    id: 4,
    title: "Prediksi Kerusakan Excavator EX-201",
    urgency: "Kritis",
    color: "red",
    analysis: [
      "Sensor termal Excavator EX-201 mendeteksi overheat.",
      "Pola getaran mesin tidak normal (>3mm/s).",
      "Potensi Kerusakan mesin dalam 4 jam.",
    ],
    action: [
      "Hentikan operasi EX-201 segera.",
      "Hubungi tim mekanik untuk inspeksi hidrolik.",
    ],
  },
];

const UrgencyTag = ({ urgency, color }) => {
  let tagClasses = "";

  switch (color) {
    case "red":
      tagClasses = "bg-red-600 text-white";
      break;
    case "orange":
      tagClasses = "bg-orange-400 text-gray-900"; // Oranye untuk Sedang/Tinggi
      break;
    default:
      tagClasses = "bg-gray-500 text-white";
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${tagClasses}`}
    >
      {urgency}
    </span>
  );
};

// Komponen Utama
const CardRekomendasi = () => {
  const [index, setIndex] = useState(0);

  const visibleCards = 3;
  const totalCards = recommendations.length;

  const next = () => {
    if (index < totalCards - visibleCards) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-6 sm:p-10">
      {/* Tombol kiri */}
      {index > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple-500 text-white px-3 py-2 rounded-lg z-20"
        >
          ‹
        </button>
      )}

      {/* Tombol kanan */}
      {index < totalCards - visibleCards && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-500 text-white px-3 py-2 rounded-lg z-20"
        >
          ›
        </button>
      )}

      {/* Slider container */}
      <div className="overflow-hidden text-start">
        <div
          className="flex gap-6 transition-transform duration-300"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-card shrink-0 rounded-xl p-6 shadow-xl"
              style={{
                width: "calc((100% - 2 * 24px) / 3)",
              }}
            >
              <h2 className="text-xl font-h2 font-bold text-font mb-3">{rec.title}</h2>

              <h3 className="font-bold font-h2 text-gray-300 mb-1">Hasil Analisis</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mb-3">
              <p></p>  {rec.analysis.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="font-bold font-h2 text-gray-300 mb-1">Rekomendasi Aksi</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mb-4">
                {rec.action.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="text-right">
                <UrgencyTag urgency={rec.urgency} color={rec.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardRekomendasi;
