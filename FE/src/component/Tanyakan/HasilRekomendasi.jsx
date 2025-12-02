import React from 'react';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdCheckCircleOutline, // Untuk status Selesai
  MdClose, // Untuk tombol Kirim yang belum berfungsi
} from "react-icons/md";

// Data dummy yang persis seperti yang Anda berikan di screenshot
const dummyRecommendationData = {
  title: "Hasil Rekomendasi dari Summary Plan",
  recommendations: [
    {
      id: 1,
      name: "Kartu Bahaya Slippery (Safety)",
      focus: "Keselamatan Jalan saat Hujan.",
      actions: [
        "Turunkan (Kurangi): Kecepatan Haul Truck (Limit maks 20 km/jam).",
        "Tingkatkan (Lakukan): Perbaikan drainase jalan (Segera kirim Grader).",
      ],
      conclusion: "Kondisi jalan tidak aman. Perlambat operasi dan perbaiki jalan segera untuk mencegah kecelakaan unit tergelincir.",
    },
    {
      id: 2,
      name: "Kartu Optimasi Kontrol Debu (Lingkungan)",
      focus: "Kualitas Udara & Visibilitas.",
      actions: [
        "Tingkatkan: Intensitas penyiraman air (Water Sprayer).",
        "Ubah (Alihkan): Rute lalu lintas unit (Jauhi area Crusher 1).",
      ],
      conclusion: "Angin kencang memicu debu berlebih. Basahi area dan kurangi kepadatan lalu lintas di titik tersebut agar debu tidak melebihi ambang batas.",
    },
    {
      id: 3,
      name: "Kartu Prediksi Breakdown Unit (Maintenance)",
      focus: "Kesehatan Mesin & Aset.",
      actions: [
        "Hentikan (Stop): Operasional Excavator EX-201 (Total stop).",
        "Lakukan: Inspeksi teknis pada sistem hidrolik.",
      ],
      conclusion: "Mesin dalam kondisi kritis (Overheat & Getaran). Jika tidak dimatikan sekarang, mesin akan rusak total dalam 4 jam.",
    },
  ],
  status: "Belum Terkirim",
};

// Komponen yang menerima isOpen dan setIsOpen untuk mekanisme buka/tutup
const HasilRekomendasi= ({ isOpen, setIsOpen }) => {
  return (
    <div className="w-full text-white text-left">
      {/* Container Utama - Mirip dengan warna dan border pada screenshot */}
      <div className="bg-card/50 p-0 rounded-xl">
        
        {/* Tombol Header untuk Buka/Tutup - Diganti menjadi tampilan judul */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full py-4 px-4 bg-card/50 border border-purple-500 rounded-xl hover:bg-gray-800 transition"
        >
          <span className="text-lg font-bold text-white">
            Hasil Rekomendasi
          </span>
          {/* Ikon panah sesuai status buka/tutup */}
          {isOpen ? (
            <MdOutlineKeyboardArrowUp className="text-3xl text-purple-400" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-3xl text-purple-400" />
          )}
        </button>

        {/* Konten Rekomendasi (Dapat Ditutup/Dibuka) */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full 
            ${isOpen ? "max-h-[2000px] opacity-100 p-6" : "max-h-0 opacity-0 p-0"} 
            bg-card/80 border border-t-0 border-purple-500 rounded-b-xl`} 
        >
          <h3 className="text-xl font-semibold mb-6 text-purple-400">
            {dummyRecommendationData.title}
          </h3>

          {/* Loop untuk menampilkan setiap Kartu Rekomendasi */}
          <div className="space-y-6">
            {dummyRecommendationData.recommendations.map((item) => (
              <div key={item.id}>
                <p className="font-bold text-white">
                  {item.id}. {item.name}
                </p>
                
                {/* Fokus */}
                <p className="text-sm font-medium text-purple-300 ml-4 mt-1">
                  Fokus: {item.focus}
                </p>
                
                {/* Daftar Tindakan/Aksi */}
                <ul className="space-y-1 ml-4 mt-2 list-none">
                  {item.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start text-sm text-gray-300">
                      <MdCheckCircleOutline className="mt-1 mr-2 text-green-400 flex-shrink-0" /> 
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>

                {/* Kesimpulan */}
                <p className="mt-2 text-sm text-gray-400 ml-4">
                  <span className="font-semibold text-purple-300">Kesimpulan:</span> {item.conclusion}
                </p>
              </div>
            ))}
          </div>

          <div className=" border-t border-gray-700">
            <p className="text-sm italic text-gray-400 mb-4">
              Jika anda merasa puas dengan hasil rekomendasi saya, mari kita bahas hingga *final report* agar saya dapat mengirimnya segera kepada *shipping planner*.
            </p>

            <div className="flex justify-between items-center">
              <p className="text-md font-medium text-gray-300">
                Status : <span className="font-bold text-red-400">{dummyRecommendationData.status}</span>
              </p>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2">
                Kirim <MdClose className='text-xl'/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasilRekomendasi;