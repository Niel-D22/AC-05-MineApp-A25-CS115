import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// --- 1. IMPORT ICONS (Material Design) ---
import { 
  MdDeleteOutline, 
  MdLocalShipping,    // Icon Truk
  MdConstruction,     // Icon Ekskavator
  MdEngineering,      // Icon Operator
  MdDirectionsBoat,   // Icon Kapal (Transport)
  MdInventory2,       // Icon Stock
  MdAccessTime,       // Icon Loading Time
  MdWbSunny,          // Icon Cerah
  MdCloud,            // Icon Berawan
  MdGrain,            // Icon Hujan
  MdWarning,          // Icon Warning
  MdCheckCircle       // Icon Success
} from "react-icons/md";

// --- 2. IMPORT CUSTOM ALERTS ---
// Pastikan file CustomAlerts.jsx sudah dibuat di folder component/UI/
import { Toast, ConfirmModal } from "../../component/CostumAlerts";

// --- HELPER: ICON CUACA ---
const getWeatherIcon = (val) => {
  // Mapping nilai string atau angka ke Icon
  if (val == 0 || val === "Rain" || val === "Light Rain") {
    return <div className="flex items-center gap-2 text-blue-300"><MdGrain className="text-xl"/> <span className="text-sm">Hujan</span></div>;
  }
  if (val == 1 || val === "Cloudy") {
    return <div className="flex items-center gap-2 text-gray-400"><MdCloud className="text-xl"/> <span className="text-sm">Berawan</span></div>;
  }
  if (val == 2 || val === "Sunny") {
    return <div className="flex items-center gap-2 text-yellow-400"><MdWbSunny className="text-xl"/> <span className="text-sm">Cerah</span></div>;
  }
  return <div className="flex items-center gap-2 text-white"><MdWarning className="text-xl"/> <span className="text-sm">{val || "-"}</span></div>;
};

const SummaryPlan = () => {
  const location = useLocation();
  
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("mining");
  const [allPlans, setAllPlans] = useState([]);
  
  // State untuk Alert Kustom
  const [toast, setToast] = useState(null); // format: { message, type }
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // --- EFFECTS ---
  
  // 1. Cek navigasi dari halaman lain (jika ada state activeTab dikirim)
  useEffect(() => {
      if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
    }, [location.state]);

  // 2. Load data dari LocalStorage saat component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem("finalizedPlans");
    if (savedPlans) {
      setAllPlans(JSON.parse(savedPlans));
    }
  }, []);

  // --- HANDLERS ---

  // Buka Modal Konfirmasi Hapus
  const requestDelete = (id) => {
    setDeleteModal({ open: true, id });
  };

  // Eksekusi Hapus setelah dikonfirmasi di Modal
  const confirmDelete = () => {
    const idToDelete = deleteModal.id;
    
    // Filter data (hapus ID yang dipilih)
    const updatedPlans = allPlans.filter(plan => plan.id !== idToDelete);
    
    // Update State & LocalStorage
    setAllPlans(updatedPlans);
    localStorage.setItem("finalizedPlans", JSON.stringify(updatedPlans));
    
    // Reset Modal & Tampilkan Toast Sukses
    setDeleteModal({ open: false, id: null });
    setToast({ message: "Plan berhasil dihapus dari riwayat.", type: "success" });
  };

  // Filter Data berdasarkan Tab (Mining / Shipping)
  const filteredData = allPlans.filter(
    (item) => (item.type || 'Mining').toLowerCase() === activeTab
  );

  return (
    <div className="w-full animate-fade-in-up pb-20">
      
      {/* --- KOMPONEN ALERT GLOBAL (Overlay) --- */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <ConfirmModal 
        isOpen={deleteModal.open}
        title="Hapus Summary Plan?"
        message={`Apakah Anda yakin ingin menghapus data Plan ID: ${deleteModal.id}? Data yang dihapus tidak dapat dikembalikan.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDanger={true}
      />

      {/* --- HEADER & TABS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="heading-1">Finalized Summary Plan</h2>
          <p className="note text-center max-w-lg">
            Daftar rencana kerja operasional yang telah divalidasi oleh Agent AI dan disetujui untuk eksekusi.
          </p>
          
          {/* Switcher Tab */}
          <div className="flex bg-[#181818] p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("mining")}
              className={`px-8 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "mining" 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Mining Plan
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-8 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "shipping" 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Shipping Plan
            </button>
          </div>
        </div>
      </div>

      {/* --- LIST KARTU SUMMARY PLAN --- */}
      <div className="space-y-6 max-w-5xl mx-auto">
        {filteredData.length > 0 ? (
          filteredData.map((plan, index) => {
            
            // --- LOGIKA MAPPING UNTUK TAMPILAN KARTU ---
            // Menentukan label dan icon berdasarkan tipe plan (Mining vs Shipping)
            const isShipping = (plan.type || '').toLowerCase() === 'shipping';
            
            // Konfigurasi Kolom 1
            const col1 = isShipping 
                ? { label: "Stockpile", val: plan.stock, icon: <MdInventory2 className="text-orange-400 text-xl"/>, unit: "Ton" }
                : { label: "Unit Truk", val: plan.trucks, icon: <MdLocalShipping className="text-red-400 text-xl"/>, unit: "Unit" };

            // Konfigurasi Kolom 2
            const col2 = isShipping 
                ? { label: "Transport", val: plan.transport_capacity, icon: <MdDirectionsBoat className="text-blue-400 text-xl"/>, unit: "Ton" }
                : { label: "Ekskavator", val: plan.excavators, icon: <MdConstruction className="text-yellow-400 text-xl"/>, unit: "Unit" };

            // Konfigurasi Kolom 3
            const col3 = isShipping 
                ? { label: "Loading Time", val: plan.loading_time, icon: <MdAccessTime className="text-purple-400 text-xl"/>, unit: "Jam" }
                : { label: "Operator", val: plan.operators, icon: <MdEngineering className="text-green-400 text-xl"/>, unit: "Orang" };

            // Hitung Gap Logic (Untuk warna)
            // Asumsi: Jika Prediksi < Target = Merah (Kurang). Jika Prediksi >= Target = Hijau (Aman).
            const isGapBad = parseFloat(plan.prediction) < parseFloat(plan.target || plan.target_tonnage);

            return (
              <div key={index} className="bg-[#1e1e1e] border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-colors shadow-xl">
                
                {/* 1. HEADER KARTU */}
                <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isShipping ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {plan.type || 'Mining'}
                        </span>
                        <h3 className="text-lg font-bold text-white font-mono">
                            {plan.id}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-400">
                      Dibuat pada: <span className="text-gray-300">{plan.date}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                      <MdCheckCircle /> {plan.status || "Finalized"}
                    </div>
                    
                    {/* Tombol Hapus dengan Icon */}
                    <button
                      onClick={() => requestDelete(plan.id)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                      title="Hapus Plan Ini"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                </div>

                {/* 2. HASIL ANALISIS */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    📝 Analisis AI Agent
                  </h4>
                  <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                    <p className="text-sm text-gray-300 italic leading-relaxed">
                      "{plan.analysis || "Tidak ada data analisis detail."}"
                    </p>
                  </div>
                </div>

                {/* 3. DETAIL RESOURCES (GRID 4 KOLOM) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {/* Resource 1 */}
                  <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col1.label}</p>
                    <div className="flex items-center gap-2">
                        {col1.icon}
                        <span className="text-white font-bold">{col1.val || 0} <span className="text-xs font-normal text-gray-400">{col1.unit}</span></span>
                    </div>
                  </div>

                  {/* Resource 2 */}
                  <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col2.label}</p>
                    <div className="flex items-center gap-2">
                        {col2.icon}
                        <span className="text-white font-bold">{col2.val || 0} <span className="text-xs font-normal text-gray-400">{col2.unit}</span></span>
                    </div>
                  </div>

                  {/* Resource 3 */}
                  <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{col3.label}</p>
                    <div className="flex items-center gap-2">
                        {col3.icon}
                        <span className="text-white font-bold">{col3.val || 0} <span className="text-xs font-normal text-gray-400">{col3.unit}</span></span>
                    </div>
                  </div>

                  {/* Resource 4 (Cuaca) */}
                  <div className="bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Cuaca</p>
                    <div className="mt-1">
                        {getWeatherIcon(plan.weather)}
                    </div>
                  </div>
                </div>

                {/* 4. STATUS OPERASIONAL (Footer Grid) */}
                <div className="border-t border-white/10 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-lg font-bold text-white">
                        {plan.target || plan.target_tonnage || 0} <span className="text-xs font-normal text-gray-400">Ton</span>
                      </p> 
                    </div>

                    <div className="text-center border-l border-r border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Prediksi Output</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {plan.prediction} <span className="text-xs font-normal text-gray-400">Ton</span>
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Gap (Selisih)</p>
                      <p className={`text-lg font-bold ${isGapBad ? "text-red-500" : "text-green-500"}`}>
                        {plan.gap} <span className="text-xs font-normal text-gray-400">Ton</span>
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            );
          })
        ) : (
          // --- EMPTY STATE ---
          <div className="flex flex-col items-center justify-center p-16 bg-[#1e1e1e] rounded-xl border border-dashed border-gray-700">
            <div className="bg-gray-800 p-4 rounded-full mb-4 text-gray-500">
                {activeTab === 'mining' ? <MdLocalShipping size={40}/> : <MdDirectionsBoat size={40}/>}
            </div>
            <p className="text-gray-300 text-lg font-medium">Belum ada {activeTab === 'mining' ? 'Mining' : 'Shipping'} Plan.</p>
            <p className="text-gray-500 text-sm mt-2 max-w-xs text-center">
                Silakan lakukan analisis di halaman "Tanyakan", pilih skenario terbaik, dan klik Finalisasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPlan;