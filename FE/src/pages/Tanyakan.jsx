import React, { useState, useEffect } from "react";
import { UseAuth } from "../context/AuthContext";
import { Toast, ConfirmModal } from "../component/CostumAlerts";
import { MdDeleteForever, MdEmail, MdSend, MdClose } from "react-icons/md";
import StepBar from "../component/Tanyakan/StepBar";
import InputData from "../component/Tanyakan/InputForm";
import RecommendationDisplay, {
  AnalysisHistoryCard,
} from "../component/Tanyakan/HasilRekomendasi";
import ChatInterface from "../component/Tanyakan/ChatInterface";
import PageTransition from "../component/PageTransition";

// --- HELPER: GENERATE UNIQUE ID ---
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getFriendlyErrorMessage = (error) => {
  const message = error.message || "";
  if (message.includes("429")) return "⏳ Server sibuk (Kuota Habis). Tunggu 1-2 menit ya.";
  if (message.includes("500") || message.includes("parsing")) return "🤖 AI bingung dengan angka tersebut. Coba gunakan angka yang lebih besar.";
  if (message.includes("Failed to fetch")) return "🔌 Gagal koneksi ke server Backend. Pastikan Python jalan.";
  if (message.includes("404")) return "🔍 Sesi tidak valid. Coba Reset Sesi.";
  return "⚠️ Terjadi kendala teknis.";
};

const STORAGE_KEYS = {
  CHAT: "mate_chat_history",
  DATA: "mate_api_data",
  HISTORY: "mate_analysis_history",
  STEP: "mate_current_step",
  ID: "mate_session_id",
  FINAL: "mate_final_plan_temp" // Key baru untuk data final sementara
};

const STEPS = {
  INPUT: "Input Data",
  RECOMMENDATION: "Rekomendasi",
  FINALIZATION: "Finalisasi",
};

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth();

  // --- STATE INIT ---
  const [currentSessionId, setCurrentSessionId] = useState(() => localStorage.getItem(STORAGE_KEYS.ID) || null);
  const [currentStep, setCurrentStep] = useState(() => localStorage.getItem(STORAGE_KEYS.STEP) || STEPS.INPUT);

  const [apiResponseData, setApiResponseData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATA);
    return saved ? JSON.parse(saved) : null;
  });

  // State untuk menyimpan Data Plan Final (agar ID di email konsisten)
  const [finalPlanData, setFinalPlanData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FINAL);
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

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // --- EMAIL STATE ---
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState([]); 
  const [currentEmailInput, setCurrentEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // --- EFFECTS ---
  useEffect(() => localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages)), [chatMessages]);
  
  useEffect(() => {
    if (apiResponseData) localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(apiResponseData));
    else localStorage.removeItem(STORAGE_KEYS.DATA);
  }, [apiResponseData]);

  // Simpan final plan ke storage sementara
  useEffect(() => {
    if (finalPlanData) localStorage.setItem(STORAGE_KEYS.FINAL, JSON.stringify(finalPlanData));
    else localStorage.removeItem(STORAGE_KEYS.FINAL);
  }, [finalPlanData]);
  
  useEffect(() => localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(apiHistory)), [apiHistory]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.STEP, currentStep), [currentStep]);
  useEffect(() => { if (currentSessionId) localStorage.setItem(STORAGE_KEYS.ID, currentSessionId); }, [currentSessionId]);

  const showToast = (message, type = "info") => setToast({ message, type });

  // --- LOGIC RESET ---
  const handleResetClick = () => setResetModalOpen(true);

  const confirmResetSession = () => {
    setApiResponseData(null);
    setFinalPlanData(null); // Reset juga final data
    setApiHistory([]);
    setChatMessages([]);
    setCurrentStep(STEPS.INPUT);
    setCurrentSessionId(null);

    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);

    setResetModalOpen(false);
    showToast("Sesi berhasil direset. Silakan mulai baru.", "success");
  };

  // --- LOGIC INPUT & CHAT (SAMA SEPERTI SEBELUMNYA) ---
  // ... (Saya persingkat bagian ini karena tidak berubah logikanya, hanya copy paste dari kode sebelumnya) ...
  const handleInputDataProcessed = (data) => {
    const sessionId = generateId();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);
    const cardRecc = data.recommendations[0];
    const isShipping = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";
    
    // Simpan History & Chat Awal
    const initialBotMessage = { sender: "bot", text: `✅ Analisis ${planType} selesai! Prediksi awal: ${data.initial_prediction} Ton.`, id: generateId() };
    setChatMessages([initialBotMessage]);

    const currentFormData = JSON.parse(localStorage.getItem("current_form_data") || "{}");
    setApiResponseData({
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
    });
    setApiHistory([]);
    setCurrentStep(STEPS.RECOMMENDATION);
    setIsRecommendationOpen(true);
  };

  const handleScenarioSelection = (scenario) => {
    setSelectedScenario(scenario);
    if (apiResponseData) setApiHistory((prev) => [...prev, { ...apiResponseData, id: generateId() }]);
    const isShippingScenario = "stock" in scenario;
    let query = isShippingScenario
      ? `Saya memilih skenario "${scenario.title}" (Stock: ${scenario.stock}, Trans: ${scenario.transport_capacity}). Hitung ulang.`
      : `Saya memilih skenario "${scenario.title}" (Truk: ${scenario.trucks}). Hitung ulang.`;
    const userMsg = { sender: "user", text: `Saya pilih skenario: "${scenario.title}"`, id: generateId() };
    setChatMessages((prev) => [...prev, userMsg]);
    handleSendChat(query, true, scenario);
  };

  const handleSendChat = async (text, isSystemGenerated = false, newScenario = null) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;
    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) { showToast("Sesi habis.", "error"); return; }

    if (!isSystemGenerated) {
      setChatMessages((prev) => [...prev, { sender: "user", text: queryText, id: generateId() }]);
      setChatMessage("");
    }

    setIsChatLoading(true);
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const endpoint = isShippingRole ? `${API_BASE}/predict_shipping` : `${API_BASE}/predict_and_recommend`;
    const payload = { user_id: userId, query: queryText };
    const loadingId = generateId();
    setChatMessages((prev) => [...prev, { sender: "bot", text: "...", id: loadingId, isLoading: true }]);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.initial_analysis_text || "Data diperbarui.", id: generateId() }]);

      const updatedResponse = {
        ...apiResponseData, ...data,
        status: "Calculated (Revised)",
        target_tonnage: data.target_tonnage,
        weatherCondition: newScenario?.weather || apiResponseData?.weatherCondition,
        ...(newScenario && isShippingRole ? { stock: newScenario.stock, transportCapacity: newScenario.transport_capacity, loadingTime: newScenario.loading_time } : {}),
        ...(newScenario && !isShippingRole ? { truckCount: newScenario.trucks, excavatorCount: newScenario.excavators, operatorCount: newScenario.operators } : {}),
      };
      if (!updatedResponse.truckCount) updatedResponse.truckCount = apiResponseData.truckCount || 0;
      if (!updatedResponse.stock) updatedResponse.stock = apiResponseData.stock || 0;
      setApiResponseData(updatedResponse);
    } catch (error) {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
      setChatMessages((prev) => [...prev, { sender: "bot", text: getFriendlyErrorMessage(error), id: generateId() }]);
      showToast("Gagal mengirim pesan.", "error");
    } finally { setIsChatLoading(false); }
  };

  // --- LOGIC FINALISASI (FIX DATA REAL) ---
  const handleFinalize = async () => {
    if (!apiResponseData) {
      showToast("Belum ada data.", "warning");
      return;
    }
    const finalTitle = selectedScenario
      ? selectedScenario.title
      : apiResponseData.recommendations?.[0]?.title || "Analisis Plan";
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));

    let finalData = {};
    if (isShippingRole) {
      finalData = {
        stock: apiResponseData.stock,
        transport_capacity: apiResponseData.transportCapacity,
        loading_time: apiResponseData.loadingTime,
        weather: apiResponseData.weatherCondition,
      };
    } else {
      finalData = {
        trucks: apiResponseData.truckCount,
        excavators: apiResponseData.excavatorCount,
        operators: apiResponseData.operatorCount,
        weather: apiResponseData.weatherCondition,
      };
    }

    // MEMBUAT OBJEK REAL PLAN
    const newPlan = {
      id: `SP-${Math.floor(1000 + Math.random() * 9000)}`, // ID 4 Digit Acak
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      }),
      type: isShippingRole ? "Shipping" : "Mining",
      title: finalTitle,
      prediction: apiResponseData.initial_prediction,
      gap: apiResponseData.initial_difference,
      analysis: apiResponseData.initial_analysis_text,
      status: "Finalized",
      target: apiResponseData.target_tonnage,
      ...finalData,
    };

    // 1. Simpan ke LocalStorage Utama (Summary Plan)
    const existingPlans = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");
    localStorage.setItem("finalizedPlans", JSON.stringify([newPlan, ...existingPlans]));
    
    // 2. SIMPAN KE STATE FINAL PLAN (Agar bisa dipakai Email)
    setFinalPlanData(newPlan);

    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    showToast(`Plan berhasil difinalisasi!`, "success");
    
    // Buka modal email
    setTimeout(() => setEmailModalOpen(true), 1500);
  };

  // --- LOGIC EMAIL (GUNAKAN DATA FINAL) ---
  const handleAddEmail = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = currentEmailInput.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (!emailList.includes(email)) {
          setEmailList([...emailList, email]);
          setCurrentEmailInput("");
        } else { showToast("Email sudah ada di daftar.", "warning"); }
      } else if (email) { showToast("Format email tidak valid.", "error"); }
    }
  };

  const handleRemoveEmail = (emailToRemove) => setEmailList(emailList.filter((email) => email !== emailToRemove));

  const handleSendEmail = async () => {
    let finalRecipients = [...emailList];
    if (currentEmailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmailInput.trim())) {
      finalRecipients.push(currentEmailInput.trim());
    }

    if (finalRecipients.length === 0) {
      showToast("Masukkan setidaknya satu email tujuan.", "warning");
      return;
    }

    // Validasi Data Final
    if (!finalPlanData) {
        showToast("Data final belum tersedia. Lakukan finalisasi ulang.", "error");
        return;
    }

    setIsSendingEmail(true);

    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShippingRole ? "Shipping" : "Mining";

    // MENGGUNAKAN DATA REAL DARI `finalPlanData`
    const bodyContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #6d28d9; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; }
        .header p { margin: 5px 0 0; font-size: 12px; opacity: 0.8; }
        .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-label { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
        .stat-value { font-size: 18px; font-weight: bold; color: #6d28d9; }
        .section-title { font-size: 14px; font-weight: bold; color: #444; margin: 20px 20px 10px; text-transform: uppercase; border-left: 4px solid #6d28d9; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        td { padding: 8px 0; border-bottom: 1px solid #eee; }
        td:last-child { text-align: right; font-weight: 600; }
        .analysis-box { margin: 20px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 15px; font-size: 13px; color: #92400e; font-style: italic; }
        .footer { background-color: #1f2937; color: #9ca3af; text-align: center; padding: 15px; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MATE</h1>
          <p>MINING ASSISTANT SYSTEM</p>
        </div>

        <div style="padding: 15px; background: #f8f8f8; border-bottom: 1px solid #eee;">
          <table width="100%">
            <tr>
              <td style="border:none; text-align:left;">
                <span style="color:#666; font-size:11px;">PLAN ID</span><br/>
                <strong>${finalPlanData.id}</strong> 
              </td>
              <td style="border:none; text-align:right;">
                <span style="color:#666; font-size:11px;">TANGGAL</span><br/>
                <strong>${finalPlanData.date}</strong>
              </td>
            </tr>
          </table>
        </div>

        <div class="section-title">Ringkasan ${planType.toUpperCase()}</div>
        <table width="100%" style="text-align: center; padding: 0 10px;">
          <tr>
            <td style="border:none; padding: 10px;">
              <div class="stat-card">
                <div class="stat-label">Target</div>
                <div class="stat-value">${finalPlanData.target} <span style="font-size:10px">Ton</span></div>
              </div>
            </td>
            <td style="border:none; padding: 10px;">
              <div class="stat-card">
                <div class="stat-label">Prediksi</div>
                <div class="stat-value" style="color: #2563eb;">${finalPlanData.prediction} <span style="font-size:10px">Ton</span></div>
              </div>
            </td>
            <td style="border:none; padding: 10px;">
              <div class="stat-card">
                <div class="stat-label">Gap (Selisih)</div>
                <div class="stat-value" style="${finalPlanData.gap > 0 ? "color: #dc2626;" : "color: #16a34a;"}">
                  ${finalPlanData.gap} <span style="font-size:10px">Ton</span>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div class="section-title">Parameter Operasional</div>
        <div style="padding: 0 20px;">
          <table>
            <tr>
              <td>${isShippingRole ? "Stockpile Tersedia" : "Unit Truk Aktif"}</td>
              <td>${isShippingRole ? finalPlanData.stock + " Ton" : finalPlanData.trucks + " Unit"}</td>
            </tr>
            <tr>
              <td>${isShippingRole ? "Kapasitas Transport" : "Unit Ekskavator"}</td>
              <td>${isShippingRole ? finalPlanData.transport_capacity + " Ton/Trip" : finalPlanData.excavators + " Unit"}</td>
            </tr>
            <tr>
              <td>${isShippingRole ? "Waktu Loading" : "Jumlah Operator"}</td>
              <td>${isShippingRole ? finalPlanData.loading_time + " Jam" : finalPlanData.operators + " Orang"}</td>
            </tr>
            <tr>
              <td>Kondisi Cuaca</td>
              <td>
                <span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                  ${finalPlanData.weather}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div class="section-title">Analisis AI Agent</div>
        <div class="analysis-box">
          "${finalPlanData.analysis}"
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} MATE System. Laporan ini digenerate otomatis oleh AI.
        </div>
      </div>
    </body>
    </html>
    `;

    const payload = {
      recipients: finalRecipients,
      subject: `[MATE] Laporan ${planType} - ${finalPlanData.date}`,
      body_content: bodyContent,
    };

    try {
      const response = await fetch(`${API_BASE}/send_report_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal mengirim email.");

      showToast(`Laporan berhasil dikirim ke ${finalRecipients.length} penerima!`, "success");
      setEmailModalOpen(false);
      setEmailList([]);
      setCurrentEmailInput("");
    } catch (error) {
      showToast("Gagal mengirim email. Cek koneksi.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return <InputData onDataProcessed={handleInputDataProcessed} userRole={userRole} showToast={showToast} />;
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        return (
          <>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Analisis & Diskusi</h3>
              <button onClick={handleResetClick} className="text-[10px] sm:text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-2 transition">
                <MdDeleteForever className="text-sm sm:text-base" /> <span className="hidden sm:inline">Reset Sesi</span><span className="sm:hidden">Reset</span>
              </button>
            </div>
            <RecommendationDisplay apiData={apiResponseData} isOpen={isRecommendationOpen} setIsOpen={setIsRecommendationOpen} onFinalize={handleFinalize} onScenarioSelect={handleScenarioSelection} />
            {apiHistory.length > 0 && (
              <div className="mt-4 sm:mt-5 md:mt-6">
                <h4 className="text-xs sm:text-sm font-bold text-gray-500 mb-2 border-b border-white/5 pb-2">Riwayat Perubahan Skenario</h4>
                {apiHistory.map((data, index) => (<AnalysisHistoryCard key={index} iteration={index + 1} apiData={data} />))}
              </div>
            )}
            <ChatInterface chatMessages={chatMessages} chatMessage={chatMessage} setChatMessage={setChatMessage} handleSendChat={handleSendChat} isChatLoading={isChatLoading} userRole={userRole} />
          </>
        );
      default: return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-white p-3 sm:p-4 md:p-6 pb-20">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <ConfirmModal isOpen={resetModalOpen} title="Mulai Sesi Baru?" message="Riwayat percakapan saat ini akan dihapus permanen." onConfirm={confirmResetSession} onCancel={() => setResetModalOpen(false)} confirmText="Ya, Reset" isDanger={true} />

        {/* --- MODAL INPUT EMAIL --- */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1e1e1e] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl p-6 relative">
              <button onClick={() => setEmailModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><MdClose size={20} /></button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400"><MdEmail size={24} /></div>
                <h3 className="text-lg font-bold text-white">Bagikan Laporan</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">Ketik email penerima lalu tekan <strong>Enter</strong> atau <strong>Koma</strong> untuk menambahkan.</p>
              <div className="flex flex-wrap gap-2 mb-3 bg-[#0a0a0a] border border-white/10 rounded-lg p-2 min-h-[50px]">
                {emailList.map((email, index) => (
                  <span key={index} className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-md text-xs flex items-center gap-2 animate-fade-in">
                    {email}
                    <button onClick={() => handleRemoveEmail(email)} className="hover:text-white focus:outline-none"><MdClose size={14} /></button>
                  </span>
                ))}
                <input type="email" placeholder={emailList.length === 0 ? "contoh@email.com..." : "Tambah lagi..."} className="bg-transparent text-sm text-white focus:outline-none flex-1 min-w-[120px]" value={currentEmailInput} onChange={(e) => setCurrentEmailInput(e.target.value)} onKeyDown={handleAddEmail} />
              </div>
              <p className="text-[10px] text-gray-500 mb-4">* Tekan Enter untuk mengunci email</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setEmailModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white text-sm">Batal</button>
                <button onClick={handleSendEmail} disabled={isSendingEmail} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition shadow-lg">
                  {isSendingEmail ? "Mengirim..." : <><MdSend /> Kirim ({emailList.length + (currentEmailInput ? 1 : 0)})</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-7 md:mb-8"><StepBar currentStep={currentStep} /></div>
          {renderContent()}
        </div>
      </div>
    </PageTransition>
  );
};

export default Tanyakan;