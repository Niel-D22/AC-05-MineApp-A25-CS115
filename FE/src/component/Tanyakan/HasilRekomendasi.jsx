import React, { useState, useEffect, useRef } from "react";
import { UseAuth } from "../../context/AuthContext";
// Import Custom Alerts
import { Toast, ConfirmModal } from "../CostumAlerts";
// Import Icons
import { 
  MdInventory, MdAccessTime, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, 
  MdCheckCircleOutline, MdClose, MdRefresh, MdErrorOutline 
} from "react-icons/md";
import { FiCheckCircle, FiTruck, FiTool, FiAnchor, FiCloud } from "react-icons/fi"; 

// --- Helper: Menerjemahkan Error Teknis ke Bahasa Manusia ---
const getFriendlyErrorMessage = (error) => {
  const message = error.message || "";
  
  // 1. Error Kuota Habis (429)
  if (message.includes("429") || message.includes("Resource has been exhausted")) {
    return "⏳ Server sedang sibuk. Mohon tunggu 1-2 menit, lalu coba kirim lagi ya.";
  }

  // 2. Error Parsing / AI Bingung (500)
  if (message.includes("500") || message.includes("Gagal mem-parsing")) {
    return "🤖 Maaf, AI sedikit kebingungan dengan angka tersebut. Coba naikkan sedikit angkanya agar analisis lebih akurat.";
  }

  // 3. Error Koneksi / Server Mati (Failed to fetch)
  if (message.includes("Failed to fetch") || message.includes("Network Error")) {
    return "🔌 Gagal terhubung ke server. Pastikan Backend (Python) sudah berjalan dan koneksi internet aman.";
  }

  // 4. Error Sesi Tidak Valid (404/401)
  if (message.includes("404") || message.includes("401")) {
    return "🔍 Sesi Anda tidak ditemukan. Silakan tekan tombol 'Reset Sesi' di pojok kanan atas.";
  }

  // Default Error
  return "⚠️ Terjadi kendala teknis. Silakan coba sesaat lagi.";
};

// ... (Bagian IconPlaceholder & Helper mapWeather TETAP SAMA, tidak perlu diubah) ...
// --- Copy ulang bagian IconPlaceholder, FiCheckCircle, mapWeather, StepBar, InputCard, SelectCard dari kode lama --- 
const IconPlaceholder = ({ name, className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* ... Isi IconPlaceholder SAMA ... */}
    {!name && <circle cx="12" cy="12" r="10" />}
  </svg>
);
const FiCheckCircleUI = (props) => <IconPlaceholder name="Check" {...props} />; // Rename biar gak bentrok import
// ... Anggap komponen UI kecil lainnya sama persis ...

const StepBar = ({ currentStep }) => {
  const steps = ["Input Data", "Rekomendasi", "Finalisasi"];
  const completedSteps = steps.indexOf(currentStep) + 1;
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex w-full h-4 rounded-lg overflow-hidden gap-x-2 ">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-full flex-1 transition-colors duration-300
              ${index < completedSteps ? "bg-primary" : "bg-gray-700"}
              ${index < steps.length - 1 ? "border-r border-black border-opacity-30" : ""}
            `}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="w-1/3 text-center px-1 font-p hover:cursor-pointer">
            <p className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${index < completedSteps ? "text-purple-400" : "text-gray-500"}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... (InputCard & SelectCard SAMA PERSIS) ...
const InputCard = ({ label, name, unit, value, onChange }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label htmlFor={name} className="text-sm text-gray-400 block mb-1 font-sans">{label}</label>
    <div className="flex items-center">
      <input type="number" id={name} name={name} value={value || ""} onChange={onChange} required min="0" className="w-full bg-[#404040] text-white p-2 rounded-l-md border-r-0 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-600 outline-none" />
      <span className="bg-[#404040] text-gray-400 p-2 rounded-r-md text-sm border-l border-gray-600">{unit}</span>
    </div>
  </div>
);
const SelectCard = ({ label, name, value, onChange, options }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label htmlFor={name} className="text-sm text-gray-400 block mb-1 font-sans">{label}</label>
    <div className="relative">
      <select id={name} name={name} value={value || ""} onChange={onChange} required className="w-full bg-[#404040] text-white p-2 rounded-md appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-600 outline-none pr-8">
        <option value="" disabled>-- Pilih Kondisi --</option>
        {options.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><FiCloud className="text-gray-400" /></div>
    </div>
  </div>
);


// --- KOMPONEN INPUT UTAMA ---
const InputData = ({ onDataProcessed, userRole, showToast }) => { 
  const API_BASE_URL = "http://localhost:8000";
  
  const WEATHER_OPTIONS = [
    { value: "Sunny", label: "Sunny (Cerah)" },
    { value: "Cloudy", label: "Cloudy (Berawan)" },
    { value: "Light Rain", label: "Rainy (Hujan)" },
  ];

  const initialMinePlannerState = { productionVolume: 80, truckCount: 10, excavatorCount: 2, operatorCount: 15, weatherCondition: "Sunny" };
  const initialShippingPlannerState = { shippingTarget: 100, stock: 120, transportCapacity: 10, loadingTime: 8, weatherCondition: "Sunny" };

  const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
  const [formData, setFormData] = useState(isShippingRole ? initialShippingPlannerState : initialMinePlannerState);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let storedId = localStorage.getItem("mining_fe_user_id");
    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mining_fe_user_id", storedId);
    }
    setUserId(storedId);
    setFormData(isShippingRole ? initialShippingPlannerState : initialMinePlannerState);
  }, [userRole]);

  const handleInputChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validasi Input (Cek jika ada yang 0 atau kosong)
    if (isShippingRole) {
        const { shippingTarget, stock, transportCapacity, loadingTime } = formData;
        if (!shippingTarget || !stock || !transportCapacity || !loadingTime) {
             setLoading(false); 
             showToast("Mohon lengkapi semua angka. Nilai tidak boleh 0 ya.", "warning");
             return;
        }
    } else {
        const { productionVolume, truckCount, excavatorCount, operatorCount } = formData;
        if (!productionVolume || !truckCount || !excavatorCount || !operatorCount) {
            setLoading(false); 
            showToast("Mohon lengkapi semua data alat berat dan target.", "warning");
            return;
        }
    }

    // 2. Persiapan Data
    let payload = {};
    let endpoint = "";
    
    if (isShippingRole) {
        const query = `Target shipping saya ${formData.shippingTarget} ton. Saya punya Stock ${formData.stock}, Kapasitas Transport ${formData.transportCapacity}, Loading Time ${formData.loadingTime} jam, Cuaca ${formData.weatherCondition}. Beri 3 rekomendasi!`;
        payload = { user_id: userId, query: query };
        endpoint = `${API_BASE_URL}/predict_shipping`;
    } else {
        const query = `Saya ingin target ${formData.productionVolume} ton. Saat ini pakai ${formData.truckCount} Truk, ${formData.excavatorCount} Ekskavator, ${formData.operatorCount} Operator, cuaca ${formData.weatherCondition}. Beri 3 rekomendasi!`;
        payload = { user_id: userId, query: query };
        endpoint = `${API_BASE_URL}/predict_and_recommend`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Simpan input terakhir ke storage
      localStorage.setItem("current_form_data", JSON.stringify(formData));

      if (!response.ok) {
        // Coba baca pesan error dari server jika ada
        const errorText = await response.text(); 
        throw new Error(errorText || `Server Error (${response.status})`);
      }

      const data = await response.json();
      onDataProcessed(data); 
      showToast(`✅ Berhasil! Analisis untuk target ${data.target_tonnage} Ton selesai.`, "success");

    } catch (error) {
      console.error("API Error Detail:", error.message);
      // Tampilkan pesan error yang RAMAH
      const friendlyMessage = getFriendlyErrorMessage(error);
      showToast(friendlyMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER INPUT (Mining / Shipping) ---
  const renderMinePlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 "><FiTruck className="mr-2" /> Target & Unit (Mining)</div>
        <InputCard label="Target Produksi (Ton)" name="productionVolume" unit="Ton" value={formData.productionVolume} onChange={handleInputChange} />
        <InputCard label="Truck Count (Aktif)" name="truckCount" unit="Unit" value={formData.truckCount} onChange={handleInputChange} />
        <InputCard label="Excavator Count" name="excavatorCount" unit="Unit" value={formData.excavatorCount} onChange={handleInputChange} />
      </div>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2"><FiTool className="mr-2" /> SDM & Lingkungan</div>
        <InputCard label="Operator (Orang)" name="operatorCount" unit="Orang" value={formData.operatorCount} onChange={handleInputChange} />
        <SelectCard label="Kondisi Cuaca Tambang" name="weatherCondition" value={formData.weatherCondition} onChange={handleInputChange} options={WEATHER_OPTIONS} />
      </div>
    </>
  );

  const renderShippingPlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 "><FiAnchor className="mr-2" /> Logistik (Shipping)</div>
        <InputCard label="Target Shipping (Ton)" name="shippingTarget" unit="Ton" value={formData.shippingTarget} onChange={handleInputChange} />
        <InputCard label="Stockpile Tersedia" name="stock" unit="Ton" value={formData.stock} onChange={handleInputChange} />
        <InputCard label="Kapasitas Transport/Trip" name="transportCapacity" unit="Ton" value={formData.transportCapacity} onChange={handleInputChange} />
      </div>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2"><FiTool className="mr-2" /> Waktu & Lingkungan</div>
        <InputCard label="Waktu Loading (Jam)" name="loadingTime" unit="Jam" value={formData.loadingTime} onChange={handleInputChange} />
        <SelectCard label="Kondisi Cuaca Pelabuhan" name="weatherCondition" value={formData.weatherCondition} onChange={handleInputChange} options={WEATHER_OPTIONS} />
      </div>
    </>
  );

  return (
    <div className="kode-mono min-h-screen p-1 ">
      <header className="text-center mb-7">
        <p className="heading-1 mt-2 text-primary"> Input Data : Role {userRole || "User"}</p>
        <p className="note">Sesi ID: {userId}</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="card-input-grid grid md:grid-cols-2 gap-6">
          {isShippingRole ? renderShippingPlannerInputs() : renderMinePlannerInputs()}
        </div>
        <div className="text-center mt-10">
          <button type="submit" className="px-10 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition duration-200 shadow-lg disabled:bg-gray-500 flex items-center justify-center mx-auto" disabled={loading}>
            {loading ? "Sedang Menganalisis..." : <><FiCheckCircle className="mr-2" /> KIRIM DATA & HITUNG</>}
          </button>
        </div>
      </form>
    </div>
  );
};

// ... (RecommendationCard, RecommendationDisplay, AnalysisHistoryCard TETAP SAMA, tidak perlu diubah) ...
// Supaya kode tidak terlalu panjang, bagian ini saya skip. Pastikan Anda TETAP MENYERTAKANNYA.
// Gunakan komponen yang sudah ada dari kode sebelumnya.
// (Disini saya buat dummy function agar tidak error saat dicopy, tapi ANDA HARUS PAKAI YANG ASLI)
const RecommendationCard = ({ recommendation, index, onScenarioSelect }) => null; 
const RecommendationDisplay = ({ apiData, isOpen, setIsOpen, onFinalize, onScenarioSelect }) => null;
const AnalysisHistoryCard = ({ iteration, apiData }) => null;


// --- COMPONENT UTAMA (Tanyakan) ---
const STEPS = { INPUT: "Input Data", RECOMMENDATION: "Rekomendasi", FINALIZATION: "Finalisasi" };

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth(); 

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(STEPS.INPUT);
  const [apiResponseData, setApiResponseData] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  
  // Chat States
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Custom Alerts States
  const [toast, setToast] = useState(null); 
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Helper Toast
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleResetClick = () => {
    setResetModalOpen(true);
  };

  const confirmResetSession = () => {
    setApiResponseData(null);
    setApiHistory([]);
    setChatMessages([]);
    setCurrentStep(STEPS.INPUT);
    
    // Refresh User ID
    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);
    
    setResetModalOpen(false);
    showToast("Sesi berhasil direset. Silakan mulai analisis baru.", "success");
  };

  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    const cardRecc = data.recommendations[0];
    const isShipping = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";

    // Simpan History ke LocalStorage
    const newHistoryItem = {
      sessionId: sessionId,
      date: new Date().toLocaleDateString("en-GB"),
      type: planType,
      title: cardRecc.title,
      // Mapping Data agar dinamis
      trucks: isShipping ? cardRecc.transport_capacity : cardRecc.trucks,
      excavators: isShipping ? cardRecc.stock : cardRecc.excavators,
      operators: isShipping ? cardRecc.loading_time : cardRecc.operators,
      weather: cardRecc.weather,
      target: data.target_tonnage,        
      prediction: data.initial_prediction,  
      gap: data.initial_difference,
      analysis: data.initial_analysis_text, 
      summaryId: null 
    };
    
    const existingHistory = JSON.parse(localStorage.getItem("aiHistory") || "[]");
    localStorage.setItem("aiHistory", JSON.stringify([newHistoryItem, ...existingHistory]));

    // Update State Utama
    setApiResponseData({ ...data, status: "Calculated" });
    
    // Pesan Bot Pertama
    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis ${planType} selesai! Prediksi awal: ${data.initial_prediction} Ton. Cek rekomendasi di atas ya.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    // Merge Input Data (Penting untuk UI History nanti)
    const currentFormData = JSON.parse(localStorage.getItem("current_form_data") || "{}");
    setApiResponseData({
      ...data,
      status: "Calculated",
      // Generic Fields
      truckCount: currentFormData.truckCount,
      excavatorCount: currentFormData.excavatorCount,
      operatorCount: currentFormData.operatorCount,
      // Shipping Fields
      stock: currentFormData.stock,
      transportCapacity: currentFormData.transportCapacity,
      loadingTime: currentFormData.loadingTime,
      // Common
      weatherCondition: currentFormData.weatherCondition,
      target_tonnage: isShipping ? currentFormData.shippingTarget : currentFormData.productionVolume,
    });

    setApiHistory([]); 
    setCurrentStep(STEPS.RECOMMENDATION);
    setIsRecommendationOpen(true);
  };

  const handleSendChat = async (text, isSystemGenerated = false, newScenario = null) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;

    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) { showToast("Waduh, sesi kamu hilang. Coba refresh halaman ya.", "error"); return; }

    if (!isSystemGenerated) {
      setChatMessages((prev) => [...prev, { sender: "user", text: queryText, id: Date.now() }]);
      setChatMessage(""); 
    }

    setIsChatLoading(true);
    
    // Tentukan Endpoint
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const endpoint = isShippingRole ? `${API_BASE}/predict_shipping` : `${API_BASE}/predict_and_recommend`;
    
    const payload = { user_id: userId, query: queryText };
    const loadingId = Date.now() + 1;
    
    setChatMessages((prev) => [...prev, { sender: "bot", text: "Sebentar, AI sedang berpikir...", id: loadingId, isLoading: true }]);

    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));

      if (!response.ok) throw new Error("Gagal menghubungi Agent.");

      const data = await response.json();
      
      const botMsg = { 
        sender: "bot", 
        text: data.initial_analysis_text || "Saya sudah memperbarui perhitungan berdasarkan permintaan Anda.", 
        id: Date.now() + 2 
      };
      setChatMessages((prev) => [...prev, botMsg]);

      // Update Data Rekomendasi di Layar
      const updatedResponse = {
        ...data,
        status: "Calculated (Revised)",
        target_tonnage: data.target_tonnage,
        weatherCondition: newScenario?.weather || apiResponseData?.weatherCondition,
      };
      
      // Preserve existing input data
      if (isShippingRole) {
          updatedResponse.stock = newScenario?.stock || apiResponseData?.stock;
          updatedResponse.transportCapacity = newScenario?.transport_capacity || apiResponseData?.transportCapacity;
          updatedResponse.loadingTime = newScenario?.loading_time || apiResponseData?.loadingTime;
      } else {
          updatedResponse.truckCount = newScenario?.trucks || apiResponseData?.truckCount;
          updatedResponse.excavatorCount = newScenario?.excavators || apiResponseData?.excavatorCount;
          updatedResponse.operatorCount = newScenario?.operators || apiResponseData?.operatorCount;
      }
      
      setApiResponseData(updatedResponse);

    } catch (error) {
      setChatMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Maaf, ada gangguan koneksi. Bisa ulangi pesannya?", id: Date.now() + 3 }]);
      showToast("Gagal mengirim pesan.", "error");
    } finally {
      setIsChatLoading(false);
    }
  };

  // ... (Logic handleScenarioSelection & handleFinalize TETAP SAMA, gunakan showToast) ...
  // Saya singkat disini, pastikan Anda copy dari kode sebelumnya
  const handleScenarioSelection = (scenario) => {/* ...kode lama... */};
  const handleFinalize = async () => {
      // ...kode lama... 
      showToast("Rencana kerja berhasil difinalisasi!", "success");
  };

  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return <InputData onDataProcessed={handleInputDataProcessed} userRole={userRole} showToast={showToast} />;
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        return (
          <>
            <div className="flex justify-end mb-2">
                <button onClick={handleResetClick} className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-400 transition">
                    <MdRefresh/> Reset Sesi
                </button>
            </div>

            {/* --- Bagian History & Display Rekomendasi (Paste komponen asli disini) --- */}
            {/* ... <RecommendationDisplay ... /> ... */}
            
            {/* --- Chat UI --- */}
            <div className="mt-5 text-left flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-700 p-4 rounded-xl bg-gray-900">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Diskusi Lanjutan</h3>
              <div className="flex-1 space-y-4 mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-3 rounded-xl max-w-xs text-sm ${msg.sender === "user" ? "bg-purple-600" : "bg-gray-700"} ${msg.isLoading ? "animate-pulse" : ""}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>
            </div>

            <div className="sticky bottom-0 w-full z-10 p-4">
              <div className="max-w-4xl mx-auto flex items-center space-x-2 p-3 rounded-xl">
                <input
                  type="text"
                  placeholder="Ketik disini (misal: 'tambah 2 truk', 'kurangi loading time')"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatMessage)}
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isChatLoading}
                />
                <button onClick={() => handleSendChat(chatMessage)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-500">
                  {isChatLoading ? "..." : "Kirim"}
                </button>
              </div>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={resetModalOpen} title="Reset Sesi?" message="Yakin mau mulai dari nol? Chat sebelumnya akan dihapus ya." onConfirm={confirmResetSession} onCancel={() => setResetModalOpen(false)} confirmText="Ya, Reset" isDanger={true} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4"><StepBar currentStep={currentStep} /></div>
        <div className="mt-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Tanyakan;