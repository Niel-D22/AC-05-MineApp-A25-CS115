import React, { useState, useEffect, useRef } from "react";
import { UseAuth } from "../context/AuthContext";
// Import Custom Alert
import { Toast, ConfirmModal } from "../component/CostumAlerts";
// Import Icons
import { 
  MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, 
  MdCheckCircleOutline, MdRefresh, MdChat 
} from "react-icons/md";
import { FiCheckCircle, FiTruck, FiTool, FiAnchor, FiCloud } from "react-icons/fi"; 
import PageTransition from "../component/PageTransition";

// --- HELPER: Error Message Friendly ---
const getFriendlyErrorMessage = (error) => {
  const message = error.message || "";
  if (message.includes("429")) return "⏳ Server sibuk (Kuota Habis). Tunggu 1-2 menit ya.";
  if (message.includes("500") || message.includes("parsing")) return "🤖 AI bingung dengan angka tersebut. Coba gunakan angka yang lebih besar/kompleks.";
  if (message.includes("Failed to fetch")) return "🔌 Gagal koneksi ke server Backend. Pastikan Python jalan.";
  if (message.includes("404")) return "🔍 Sesi tidak valid. Coba Reset Sesi.";
  return "⚠️ Terjadi kendala teknis.";
};

// --- HELPER: LocalStorage Keys ---
const STORAGE_KEYS = {
  CHAT: "session_chat_history",
  DATA: "session_api_data",
  HISTORY: "session_analysis_history",
  STEP: "session_current_step",
  ID: "session_current_id"
};

// --- SUB-COMPONENTS UI ---

const StepBar = ({ currentStep }) => {
  const steps = ["Input Data", "Rekomendasi", "Finalisasi"];
  const completedSteps = steps.indexOf(currentStep) + 1;
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-800 gap-1">
        {steps.map((step, index) => (
          <div key={index} className={`h-full flex-1 transition-all duration-500 ${index < completedSteps ? "bg-purple-500" : "bg-transparent"}`} />
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((step, index) => (
          <div key={index} className={`text-center w-1/3 text-sm font-medium transition-colors ${index < completedSteps ? "text-purple-400" : "text-gray-600"}`}>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

const InputCard = ({ label, name, unit, value, onChange, minVal }) => (
  <div className="bg-[#1e1e1e] border border-white/5 p-4 rounded-xl mb-4 focus-within:border-purple-500/50 transition-colors">
    <label htmlFor={name} className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">{label}</label>
    <div className="flex items-center bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden">
      <input 
        type="number" 
        id={name} 
        name={name} 
        value={value || ""} 
        onChange={onChange} 
        required 
        min={minVal || "0"} // Support properti minVal
        className="w-full bg-transparent text-white p-3 text-sm focus:outline-none" 
      />
      <span className="bg-white/5 text-gray-400 px-4 py-3 text-xs border-l border-white/10">{unit}</span>
    </div>
  </div>
);

const SelectCard = ({ label, name, value, onChange, options }) => (
  <div className="bg-[#1e1e1e] border border-white/5 p-4 rounded-xl mb-4 focus-within:border-purple-500/50 transition-colors">
    <label htmlFor={name} className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">{label}</label>
    <div className="relative">
      <select id={name} name={name} value={value || ""} onChange={onChange} required className="w-full bg-[#0a0a0a] border border-white/10 text-white p-3 rounded-lg appearance-none focus:outline-none cursor-pointer text-sm">
        <option value="" disabled>-- Pilih Kondisi --</option>
        {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
    </div>
  </div>
);

// --- COMPONENT: INPUT DATA FORM ---
const InputData = ({ onDataProcessed, userRole, showToast }) => { 
  const API_BASE_URL = "http://localhost:8000";
  
  const WEATHER_OPTIONS = [
    { value: "Sunny", label: "Sunny (Cerah)" },
    { value: "Cloudy", label: "Cloudy (Berawan)" },
    { value: "Light Rain", label: "Rainy (Hujan)" },
  ];

  // Load last input from storage or default
  const loadInitialState = (isShipping) => {
    const saved = localStorage.getItem("current_form_data");
    if (saved) return JSON.parse(saved);
    return isShipping 
      ? { shippingTarget: 100, stock: 120, transportCapacity: 10, loadingTime: 8, weatherCondition: "Sunny" }
      : { productionVolume: 80, truckCount: 10, excavatorCount: 2, operatorCount: 15, weatherCondition: "Sunny" };
  };

  const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
  const [formData, setFormData] = useState(loadInitialState(isShippingRole));
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let storedId = localStorage.getItem("mining_fe_user_id");
    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mining_fe_user_id", storedId);
    }
    setUserId(storedId);
    
    // Update form default values if role switches and no saved data
    if (!localStorage.getItem("current_form_data")) {
        setFormData(isShippingRole 
            ? { shippingTarget: 100, stock: 120, transportCapacity: 10, loadingTime: 8, weatherCondition: "Sunny" }
            : { productionVolume: 80, truckCount: 10, excavatorCount: 2, operatorCount: 15, weatherCondition: "Sunny" }
        );
    }
  }, [userRole, isShippingRole]);

  const handleInputChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- VALIDASI FE: Mencegah Angka Kecil ---
    if (isShippingRole) {
        const { shippingTarget, stock, transportCapacity, loadingTime } = formData;
        
        // 1. Cek Kelengkapan
        if (!shippingTarget || !stock || !transportCapacity || !loadingTime) {
             setLoading(false);
             showToast("Mohon lengkapi semua data.", "warning");
             return;
        }

        // 2. CEK BATAS MINIMUM (Sesuai Request: Minimal 75)
        // Jika di bawah 75, Backend error parsing karena AI menjawab terlalu santai.
        if (shippingTarget < 75) {
             setLoading(false);
             showToast("⚠️ Target Shipping minimal 75 Ton agar analisis AI akurat.", "warning");
             return;
        }
    } else {
        // Validasi untuk Mining (Opsional, disamakan logikanya)
        const { productionVolume, truckCount, excavatorCount, operatorCount } = formData;
        if (!productionVolume || !truckCount || !excavatorCount || !operatorCount) {
            setLoading(false);
            showToast("Mohon lengkapi semua data mining.", "warning");
            return;
        }
        if (productionVolume < 50) {
             setLoading(false);
             showToast("⚠️ Target Produksi minimal 50 Ton agar analisis AI akurat.", "warning");
             return;
        }
    }

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

      localStorage.setItem("current_form_data", JSON.stringify(formData));

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(errorText || `Server Error (${response.status})`);
      }

      const data = await response.json();
      onDataProcessed(data); 
      showToast(`✅ Berhasil! Analisis target ${data.target_tonnage} Ton selesai.`, "success");

    } catch (error) {
      console.error("API Error:", error.message);
      showToast(getFriendlyErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Input Parameter Operasional</h2>
        <p className="text-sm text-gray-400">Role Aktif: <span className="text-purple-400 font-bold">{userRole || "User"}</span> • Sesi ID: <span className="font-mono bg-white/10 px-2 rounded">{userId.substring(0,8)}...</span></p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {isShippingRole ? (
            <>
                <div className="col-span-1">
                    <div className="flex items-center gap-2 text-purple-400 mb-4 font-bold"><FiAnchor/> Logistik Shipping</div>
                    {/* Tambahkan minVal={75} sebagai hint visual */}
                    <InputCard label="Target Shipping (Min 75 Ton)" name="shippingTarget" unit="Ton" value={formData.shippingTarget} onChange={handleInputChange} minVal="75" />
                    <InputCard label="Stockpile Tersedia" name="stock" unit="Ton" value={formData.stock} onChange={handleInputChange} />
                    <InputCard label="Kapasitas Transport/Trip" name="transportCapacity" unit="Ton" value={formData.transportCapacity} onChange={handleInputChange} />
                </div>
                <div className="col-span-1">
                    <div className="flex items-center gap-2 text-purple-400 mb-4 font-bold"><FiTool/> Waktu & Lingkungan</div>
                    <InputCard label="Waktu Loading" name="loadingTime" unit="Jam" value={formData.loadingTime} onChange={handleInputChange} />
                    <SelectCard label="Kondisi Cuaca" name="weatherCondition" value={formData.weatherCondition} onChange={handleInputChange} options={WEATHER_OPTIONS} />
                </div>
            </>
          ) : (
            <>
                <div className="col-span-1">
                    <div className="flex items-center gap-2 text-purple-400 mb-4 font-bold"><FiTruck/> Target & Unit Mining</div>
                    <InputCard label="Target Produksi (Min 50 Ton)" name="productionVolume" unit="Ton" value={formData.productionVolume} onChange={handleInputChange} />
                    <InputCard label="Truck Count" name="truckCount" unit="Unit" value={formData.truckCount} onChange={handleInputChange} />
                    <InputCard label="Excavator Count" name="excavatorCount" unit="Unit" value={formData.excavatorCount} onChange={handleInputChange} />
                </div>
                <div className="col-span-1">
                    <div className="flex items-center gap-2 text-purple-400 mb-4 font-bold"><FiTool/> SDM & Lingkungan</div>
                    <InputCard label="Operator Count" name="operatorCount" unit="Orang" value={formData.operatorCount} onChange={handleInputChange} />
                    <SelectCard label="Kondisi Cuaca" name="weatherCondition" value={formData.weatherCondition} onChange={handleInputChange} options={WEATHER_OPTIONS} />
                </div>
            </>
          )}
        </div>
        <div className="text-center mt-8">
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto" disabled={loading}>
            {loading ? "Sedang Menganalisis..." : <><FiCheckCircle /> PROSES ANALISIS</>}
          </button>
        </div>
      </form>
    </div>
  );
};


const AnalysisHistoryCard = ({ iteration, apiData }) => (
    <div className="bg-[#1e1e1e] border border-white/5 p-4 rounded-xl mb-3">
        <p className="text-xs text-purple-400 font-bold mb-1">Riwayat #{iteration}</p>
        <p className="text-sm text-gray-300 italic">"{apiData.initial_analysis_text.substring(0, 80)}..."</p>
    </div>
);

// --- COMPONENT UTAMA (Tanyakan) ---
const STEPS = { INPUT: "Input Data", RECOMMENDATION: "Rekomendasi", FINALIZATION: "Finalisasi" };

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth(); 

  // --- STATE INIT WITH PERSISTENCE  ---
  const [currentSessionId, setCurrentSessionId] = useState(() => localStorage.getItem(STORAGE_KEYS.ID) || null);
  const [currentStep, setCurrentStep] = useState(() => localStorage.getItem(STORAGE_KEYS.STEP) || STEPS.INPUT);
  
  const [apiResponseData, setApiResponseData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATA);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [apiHistory, setApiHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : [];
  });

  // State UI Sementara (Tidak perlu dipersisten)
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState(null); 
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const chatEndRef = useRef(null);

  // --- EFFECTS UNTUK MENYIMPAN STATE KE LOCALSTORAGE SETIAP PERUBAHAN ---
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { 
      if(apiResponseData) localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(apiResponseData)); 
      else localStorage.removeItem(STORAGE_KEYS.DATA);
  }, [apiResponseData]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(apiHistory)); }, [apiHistory]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STEP, currentStep); }, [currentStep]);
  useEffect(() => { if(currentSessionId) localStorage.setItem(STORAGE_KEYS.ID, currentSessionId); }, [currentSessionId]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const showToast = (message, type = "info") => setToast({ message, type });

  // --- LOGIC RESET SESI (BERSIH-BERSIH) ---
  const handleResetClick = () => setResetModalOpen(true);

  const confirmResetSession = () => {
    // 1. Clear State React
    setApiResponseData(null);
    setApiHistory([]);
    setChatMessages([]);
    setCurrentStep(STEPS.INPUT);
    setCurrentSessionId(null);
    
    // 2. Clear LocalStorage Sesi Ini
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);
    
    // 3. Ganti ID User untuk backend
    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);
    
    setResetModalOpen(false);
    showToast("Sesi berhasil direset bersih. Mulai dari awal.", "success");
  };

  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    // Simpan ke Global History (Untuk halaman Rekomendasi/Beranda)
    const cardRecc = data.recommendations[0];
    const isShipping = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";

    const newHistoryItem = {
      sessionId: sessionId,
      date: new Date().toLocaleDateString("en-GB"),
      type: planType,
      title: cardRecc.title,
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

    // Pesan Bot Awal
    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis ${planType} selesai! Prediksi awal: ${data.initial_prediction} Ton. Silakan cek rekomendasi di atas.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    // Merge Input Data agar tidak hilang saat refresh
    const currentFormData = JSON.parse(localStorage.getItem("current_form_data") || "{}");
    const fullData = {
      ...data,
      status: "Calculated",
      truckCount: currentFormData.truckCount,
      excavatorCount: currentFormData.excavatorCount,
      operatorCount: currentFormData.operatorCount,
      stock: currentFormData.stock,
      transportCapacity: currentFormData.transportCapacity,
      loadingTime: currentFormData.loadingTime,
      weatherCondition: currentFormData.weatherCondition,
      target_tonnage: isShipping ? currentFormData.shippingTarget : currentFormData.productionVolume,
    };

    setApiResponseData(fullData);
    setApiHistory([]); 
    setCurrentStep(STEPS.RECOMMENDATION);
    setIsRecommendationOpen(true);
  };

  const handleScenarioSelection = (scenario) => {
    setSelectedScenario(scenario);
    // Simpan snapshot data sebelumnya ke history sesi
    if (apiResponseData) {
      setApiHistory((prev) => [ ...prev, { ...apiResponseData, id: prev.length + 1 }, ]);
    }
    
    const isShippingScenario = 'stock' in scenario;
    let query = isShippingScenario 
        ? `Saya memilih skenario "${scenario.title}" (Stock: ${scenario.stock}, Trans: ${scenario.transport_capacity}). Hitung ulang.`
        : `Saya memilih skenario "${scenario.title}" (Truk: ${scenario.trucks}). Hitung ulang.`;

    const userMsg = { sender: "user", text: `Saya pilih skenario: "${scenario.title}"`, id: Date.now() };
    setChatMessages((prev) => [...prev, userMsg]);
    handleSendChat(query, true, scenario); 
  };

  const handleSendChat = async (text, isSystemGenerated = false, newScenario = null) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;

    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) { showToast("Sesi habis. Refresh halaman.", "error"); return; }

    if (!isSystemGenerated) {
      setChatMessages((prev) => [...prev, { sender: "user", text: queryText, id: Date.now() }]);
      setChatMessage(""); 
    }

    setIsChatLoading(true);
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const endpoint = isShippingRole ? `${API_BASE}/predict_shipping` : `${API_BASE}/predict_and_recommend`;
    const payload = { user_id: userId, query: queryText };
    const loadingId = Date.now() + 1;
    
    setChatMessages((prev) => [...prev, { sender: "bot", text: "...", id: loadingId, isLoading: true }]);

    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });

      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));

      if (!response.ok) throw new Error("Gagal menghubungi Agent.");

      const data = await response.json();
      
      const botMsg = { 
        sender: "bot", 
        text: data.initial_analysis_text || "Perhitungan diperbarui sesuai permintaan.", 
        id: Date.now() + 2 
      };
      setChatMessages((prev) => [...prev, botMsg]);

      // Update Data dengan tetap mempertahankan input lama jika tidak ada di response baru
      const updatedResponse = {
        ...apiResponseData, // Keep existing fields
        ...data, // Overwrite with new calc
        status: "Calculated (Revised)",
        target_tonnage: data.target_tonnage,
        // Update specific fields if present in newScenario (logic from selection)
        ...(newScenario && isShippingRole ? {
            stock: newScenario.stock,
            transportCapacity: newScenario.transport_capacity,
            loadingTime: newScenario.loading_time,
            weatherCondition: newScenario.weather
        } : {}),
        ...(newScenario && !isShippingRole ? {
            truckCount: newScenario.trucks,
            excavatorCount: newScenario.excavators,
            operatorCount: newScenario.operators,
            weatherCondition: newScenario.weather
        } : {})
      };
      
      setApiResponseData(updatedResponse);

    } catch (error) {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
      setChatMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Gagal terhubung. Coba lagi.", id: Date.now() + 3 }]);
      showToast("Gagal mengirim pesan.", "error");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!apiResponseData) { showToast("Belum ada data.", "warning"); return; }

    const finalTitle = selectedScenario ? selectedScenario.title : (apiResponseData.recommendations?.[0]?.title || "Analisis Plan");
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    
    // Konstruksi data final
    let finalData = {};
    if(isShippingRole){
        finalData = {
            stock: selectedScenario ? selectedScenario.stock : apiResponseData.stock,
            transport_capacity: selectedScenario ? selectedScenario.transport_capacity : apiResponseData.transportCapacity,
            loading_time: selectedScenario ? selectedScenario.loading_time : apiResponseData.loadingTime,
            weather: selectedScenario ? selectedScenario.weather : apiResponseData.weatherCondition
        }
    } else {
        finalData = {
            trucks: selectedScenario ? selectedScenario.trucks : apiResponseData.truckCount,
            excavators: selectedScenario ? selectedScenario.excavators : apiResponseData.excavatorCount,
            operators: selectedScenario ? selectedScenario.operators : apiResponseData.operatorCount,
            weather: selectedScenario ? selectedScenario.weather : apiResponseData.weatherCondition
        }
    }

    const planId = `SP-${Math.floor(Math.random() * 10000)}`;
    const newPlan = {
      id: planId,
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      type: isShippingRole ? "Shipping" : "Mining",
      title: finalTitle,
      prediction: apiResponseData.initial_prediction,
      gap: apiResponseData.initial_difference,        
      analysis: apiResponseData.initial_analysis_text,
      status: "Finalized",
      target: apiResponseData.target_tonnage,
      ...finalData
    };

    // Save
    const existingPlans = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");
    localStorage.setItem("finalizedPlans", JSON.stringify([newPlan, ...existingPlans]));

    // Update UI state
    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    showToast(`Plan ${newPlan.id} berhasil difinalisasi!`, "success");
  };

  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return <InputData onDataProcessed={handleInputDataProcessed} userRole={userRole} showToast={showToast} />;
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        // *** IMPORT DYNAMIC COMPONENT DISINI ***
        // Karena kode Anda panjang, saya asumsikan komponen RecommendationDisplay ada di file terpisah atau di atas
        // Pastikan RecommendationDisplay menerima prop: apiData, isOpen, setIsOpen, onFinalize, onScenarioSelect
        return (
          <>
          <PageTransition>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Analisis & Diskusi</h3>
                <button onClick={handleResetClick} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition">
                    <MdRefresh/> Reset Sesi
                </button>
            </div>
</PageTransition>
            <div className="flex gap-6 flex-col lg:flex-row">
                
                {/* KOLOM KIRI: REKOMENDASI & HISTORY */}
                <div className="w-full lg:w-2/3 space-y-6">
                    {/* Disini tempat RecommendationDisplay Anda */}
                    {/* Ganti div ini dengan <RecommendationDisplay ... /> yang asli */}
                    <div className="bg-[#1e1e1e] border border-white/5 p-6 rounded-xl text-center">
                        <p className="text-gray-400">Area Visualisasi Rekomendasi</p>
                        <p className="text-xs text-gray-500">(Pastikan komponen RecommendationDisplay dipanggil di sini)</p>
                        {/* Contoh Pemanggilan (Uncomment jika komponen tersedia): */}
                        {/* <RecommendationDisplay apiData={apiResponseData} isOpen={isRecommendationOpen} setIsOpen={setIsRecommendationOpen} onFinalize={handleFinalize} onScenarioSelect={handleScenarioSelection} /> */}
                        {/* Button Finalize Sementara jika komponen display belum dipasang */}
                        <button onClick={handleFinalize} className="mt-4 bg-green-600 px-4 py-2 rounded text-white text-sm">Finalisasi (Test)</button>
                    </div>

                    {apiHistory.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 mb-2 border-b border-white/5 pb-2">Riwayat Perubahan Skenario</h4>
                        {apiHistory.map((data, index) => <AnalysisHistoryCard key={index} iteration={index + 1} apiData={data} />)}
                      </div>
                    )}
                </div>

                {/* KOLOM KANAN: CHAT UI (Sticky) */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-[#1e1e1e] border border-white/5 rounded-xl flex flex-col h-[600px] sticky top-6">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <MdChat className="text-purple-400"/>
                            <span className="font-bold text-white text-sm">Asisten Cerdas</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                                    msg.sender === "user" 
                                    ? "bg-purple-600 text-white rounded-br-none" 
                                    : "bg-[#2a2a2a] text-gray-200 rounded-bl-none border border-white/5"
                                } ${msg.isLoading ? "animate-pulse italic text-gray-400" : ""}`}>
                                {msg.text}
                                </div>
                            </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="p-3 border-t border-white/5 bg-[#1a1a1a] rounded-b-xl">
                            <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-1 focus-within:border-purple-500/50 transition-colors">
                                <input
                                type="text"
                                placeholder="Ketik perintah revisi..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatMessage)}
                                className="flex-1 bg-transparent text-white text-sm py-2.5 focus:outline-none"
                                disabled={isChatLoading}
                                />
                                <button onClick={() => handleSendChat(chatMessage)} className="text-purple-400 hover:text-white transition-colors disabled:opacity-50" disabled={isChatLoading}>
                                    <FiCheckCircle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-white p-4 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={resetModalOpen} title="Mulai Sesi Baru?" message="Riwayat percakapan saat ini akan dihapus permanen." onConfirm={confirmResetSession} onCancel={() => setResetModalOpen(false)} confirmText="Ya, Reset" isDanger={true} />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"><StepBar currentStep={currentStep} /></div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Tanyakan;