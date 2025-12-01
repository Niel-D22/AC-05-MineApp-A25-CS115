import React from "react";
import { useState } from "react";

const recommendations = [
  {
    id: 1,
    title: "Potensi Kelebihan Muatan (Overloading)",
    urgency: "Tinggi",
    color: "orange",
    analysis: [
      "Sensor muatan Truck H-12 dan H-25 menunjukkan muatan > 110% dari kapasitas nominal.",
      "Pola muat Shovel S-05 cenderung tidak rata dan berlebihan.",
      "Risiko kerusakan sasis dan ban unit meningkat drastis.",
    ],
    action: [
      "Hubungi operator Shovel S-05 untuk kalibrasi muatan dan *spotting*.",
      "Lakukan inspeksi visual segera pada ban H-12 dan H-25 di *check point* terdekat.",
    ],
  },
  {
    id: 2,
    title: "Optimasi Waktu Tunggu di Disposal",
    urgency: "Sedang",
    color: "yellow",
    analysis: [
      "Antrian di Disposal Area C meningkat dari 4 unit menjadi 6 unit dalam 30 menit terakhir.",
      "Rata-rata waktu tunggu mencapai 10 menit, melampaui batas toleransi 5 menit.",
      "Penyebab utama: **Dozer D-03** sedang *refueling* dan belum kembali merapikan.",
    ],
    action: [
      "Arahkan Truck H-30 dan H-31 (yang baru *ready*) ke **Disposal Area B**.",
      "Panggil Dozer D-05 dari *standby* untuk membantu perapihan di Disposal Area C.",
    ],
  },
  {
    id: 3,
    title: "Anomali Tekanan Oli di Crusher Conveyor C-01",
    urgency: "Kritis",
    color: "red",
    analysis: [
      "Sensor getaran Conveyor C-01 mendeteksi peningkatan > 5mm/s di *bearing* utama.",
      "Tekanan oli sistem hidrolik tiba-tiba turun 40% dari ambang normal.",
      "Potensi *major breakdown* (gangguan produksi total) dalam 2 jam.",
    ],
    action: [
      "Segera **hentikan operasi Crusher Line 1** untuk inspeksi C-01.",
      "Hubungi tim Mekanik Elektrik untuk memeriksa kebocoran atau kerusakan pompa oli.",
    ],
  },
  {
    id: 4,
    title: "Perluasan Front Penambangan Batubara",
    urgency: "Rendah",
    color: "green",
    analysis: [
      "Produksi Batubara tercapai 97% target harian (5.800 MT).",
      "Ketersediaan unit *Drilling* D-01 sedang *idle* (tidak terpakai).",
      "Perluasan *coal front* baru dapat memastikan stok siap gali untuk hari esok.",
    ],
    action: [
      "Arahkan Unit *Drilling* D-01 ke Pit A, koordinat X:200, Y:550.",
      "Mulai *drilling* untuk *blasting* batch berikutnya sesuai rencana geoteknik.",
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
const InformasiData = () => {
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
              <h2 className="text-xl font-h2 font-bold text-font mb-3">
                {rec.title}
              </h2>

              <h3 className="font-bold font-h2 text-gray-300 mb-1">
                Hasil Analisis
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 mb-3">
                <p></p>{" "}
                {rec.analysis.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3 className="font-bold font-h2 text-gray-300 mb-1">
                Rekomendasi Aksi
              </h3>
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

export default InformasiData;
