import React, { useState } from "react";
import { 
  MdInput, MdSmartToy, MdChat, MdCheckCircle, MdHistory, 
  MdExpandMore, MdExpandLess, MdTipsAndUpdates, MdWarning 
} from "react-icons/md";
import PageTransition from "../component/PageTransition";

const guideSteps = [
  {
    id: 1,
    title: "Memulai Analisis Baru",
    icon: <MdInput className="text-blue-400" />,
    content: (
      <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed">
        <p>
          Buka halaman <strong>"Tanyakan"</strong>. Sistem akan otomatis mendeteksi peran Anda (Mining Planner atau Shipping Planner).
        </p>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1">
          <li><strong>Target:</strong> Masukkan target tonase yang ingin dicapai hari ini.</li>
          <li><strong>Parameter Alat:</strong> Masukkan jumlah unit yang tersedia (Truk/Ekskavator) atau kapasitas logistik.</li>
          <li><strong>Faktor Alam:</strong> Pilih kondisi cuaca (Sunny, Cloudy, Rainy) karena AI akan memperhitungkan <em>slippery factor</em> (faktor licin).</li>
        </ul>
        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-2 sm:p-3 rounded-r text-[10px] sm:text-xs">
          <strong>Catatan Shipping:</strong> "Kapasitas Transport" adalah kapasitas angkut <em>sekali jalan</em> (per trip) dari alat pemindah (Dump Truck/Conveyor) ke tongkang, bukan total kapasitas kapal.
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Membaca Rekomendasi AI",
    icon: <MdSmartToy className="text-purple-400" />,
    content: (
      <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed">
        <p>Setelah menekan tombol <strong>Kirim Data</strong>, AI Agent akan memproses perhitungan prediktif.</p>
        <p>Anda akan melihat 3 kartu skenario:</p>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1">
          <li><strong>Analisis Kontrol:</strong> Prediksi berdasarkan input asli Anda.</li>
          <li><strong>Rekomendasi Optimasi:</strong> Saran AI untuk menambah/mengurangi alat agar target tercapai lebih efisien.</li>
        </ul>
        <p>Klik tombol <strong>"Pilih Skenario Ini"</strong> pada kartu yang menurut Anda paling masuk akal untuk diterapkan.</p>
      </div>
    )
  },
  {
    id: 3,
    title: "Diskusi & Revisi dengan AI",
    icon: <MdChat className="text-green-400" />,
    content: (
      <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed">
        <p>Jika hasil belum memuaskan, Anda tidak perlu input ulang dari awal. Gunakan kolom <strong>Chat Diskusi</strong> di bawah.</p>
        <p>Contoh perintah yang bisa Anda ketik:</p>
        <div className="flex flex-col gap-2">
          <code className="bg-black/30 p-2 rounded text-[10px] sm:text-xs text-green-300 break-all">"Bagaimana jika hujan turun selama 2 jam?"</code>
          <code className="bg-black/30 p-2 rounded text-[10px] sm:text-xs text-green-300 break-all">"Coba tambah 2 truk lagi, apakah target tercapai?"</code>
        </div>
        <p>AI akan menghitung ulang secara <em>real-time</em> berdasarkan konteks percakapan terakhir.</p>
      </div>
    )
  },
  {
    id: 4,
    title: "Finalisasi & Penyimpanan",
    icon: <MdCheckCircle className="text-yellow-400" />,
    content: (
      <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed">
        <p>
          Setelah menemukan konfigurasi yang pas, klik tombol <strong>Finalisasi dan Kirim</strong>.
        </p>
        <p>
          Data akan disimpan sebagai <strong>Summary Plan</strong> yang valid (Locked). Data ini akan masuk ke database laporan harian dan tidak bisa diedit lagi, hanya bisa dihapus oleh Supervisor.
        </p>
      </div>
    )
  },
  {
    id: 5,
    title: "Riwayat & Monitoring",
    icon: <MdHistory className="text-red-400" />,
    content: (
      <div className="space-y-3 text-gray-300 text-xs sm:text-sm leading-relaxed">
        <p>
          Buka menu <strong>Summary Plan</strong> untuk melihat daftar rencana kerja yang sudah disetujui.
        </p>
        <p>
          Gunakan filter Tab (Mining / Shipping) untuk melihat kategori yang relevan. Anda bisa menghapus plan yang salah input dengan menekan ikon sampah (Membutuhkan konfirmasi).
        </p>
      </div>
    )
  }
];

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-[#2a2a2a] transition-all duration-300 mb-3 sm:mb-4">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors ${
          isOpen ? "bg-white/5" : "hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className={`p-1.5 sm:p-2 rounded-lg bg-black/20 text-lg sm:text-xl flex-shrink-0`}>
            {item.icon}
          </div>
          <span className="font-bold text-white text-xs sm:text-base break-words">{item.title}</span>
        </div>
        {isOpen ? <MdExpandLess className="text-gray-400 text-lg sm:text-xl flex-shrink-0 ml-2" /> : <MdExpandMore className="text-gray-400 text-lg sm:text-xl flex-shrink-0 ml-2" />}
      </button>
      
      <div
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] sm:max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 sm:p-5 border-t border-white/5 bg-[#232323]">
          {item.content}
        </div>
      </div>
    </div>
  );
};

const UserGuide = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <PageTransition>
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fade-in-up px-3 sm:px-4 md:px-6">
      {/* Header Dokumentasi */}
      <div className="text-center mb-8 sm:mb-9 md:mb-10 pt-4 sm:pt-5 md:pt-6">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
          <MdTipsAndUpdates /> Internal Documentation 
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Panduan Penggunaan Sistem
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-xs sm:text-sm px-2 sm:px-4">
          Pelajari cara menggunakan AI Assistant untuk mengoptimalkan perencanaan tambang dan logistik pengapalan secara efisien.
        </p>
      </div>

      {/* Accordion Content */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-7 md:gap-8 items-start">
        
        {/* Kolom Kiri: Steps */}
        <div className="w-full lg:w-2/3">
          {guideSteps.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Kolom Kanan: Troubleshooting Cepat */}
        <div className="w-full lg:w-1/3 bg-[#1e1e1e] border border-white/5 rounded-xl p-4 sm:p-5 md:p-6 lg:sticky lg:top-6">
          <h3 className="text-white font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <MdWarning className="text-yellow-500"/> Troubleshooting
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            <li className="text-xs text-gray-400">
              <strong className="block text-gray-200 mb-1">Error 429 (Kuota Habis)</strong>
              Terlalu banyak permintaan dalam waktu singkat. Tunggu 1-2 menit lalu coba lagi.
            </li>
            <li className="text-xs text-gray-400">
              <strong className="block text-gray-200 mb-1">Error 500 (Parsing)</strong>
              Biasanya terjadi jika input angka terlalu kecil (misal: 10 ton). Coba gunakan angka yang realistis.
            </li>
            <li className="text-xs text-gray-400">
              <strong className="block text-gray-200 mb-1">Sesi Hilang</strong>
              Jika chat tidak merespon, klik tombol "Reset Sesi" di pojok kanan atas halaman Tanyakan.
            </li>
          </ul>
          
          <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-white/10">
            <p className="text-[10px] text-gray-500 text-center">
              Butuh bantuan teknis lebih lanjut?<br/>
              Hubungi <strong>IT Support (Ext. 102)</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
    </PageTransition>
  );
};

export default UserGuide;