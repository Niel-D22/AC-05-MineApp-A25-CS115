import React, { useState, useEffect } from "react";
import { UseAuth } from "../context/AuthContext";
import axios from "axios";
import { Toast, ConfirmModal } from "../component/CostumAlerts";
import { MdRefresh, MdDeleteForever, MdChat, MdEmail } from "react-icons/md";
import StepBar from "../component/Tanyakan/StepBar";
import InputData from "../component/Tanyakan/InputForm";
import RecommendationDisplay, {
  AnalysisHistoryCard,
} from "../component/Tanyakan/HasilRekomendasi";
import ChatInterface from "../component/Tanyakan/ChatInterface";
import PageTransition from "../component/PageTransition";


const getFriendlyErrorMessage = (error) => {
  const message = error.message || "";
  if (message.includes("429"))
    return "⏳ Server sibuk (Kuota Habis). Tunggu 1-2 menit ya.";
  if (message.includes("500") || message.includes("parsing"))
    return "🤖 AI bingung dengan angka tersebut. Coba gunakan angka yang lebih besar.";
  if (message.includes("Failed to fetch"))
    return "🔌 Gagal koneksi ke server Backend. Pastikan Python jalan.";
  if (message.includes("404")) return "🔍 Sesi tidak valid. Coba Reset Sesi.";
  return "⚠️ Terjadi kendala teknis.";
};

const STORAGE_KEYS = {
  CHAT: "mate_chat_history",
  DATA: "mate_api_data",
  HISTORY: "mate_analysis_history",
  STEP: "mate_current_step",
  ID: "mate_session_id",
  LAST_ROLE: "mate_last_role",
  FINAL: "mate_final_plan_temp"
};

const STEPS = {
  INPUT: "Input Data",
  RECOMMENDATION: "Rekomendasi",
  FINALIZATION: "Finalisasi",
};

const Tanyakan = () => {
 const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth();

  const savedRole = localStorage.getItem(STORAGE_KEYS.LAST_ROLE);
  const isRoleMismatch = savedRole && savedRole !== userRole;

  if (isRoleMismatch) {
    console.warn(`Role mismatch (${savedRole} vs ${userRole}). Purging storage before init...`);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);
  }

  const [currentSessionId, setCurrentSessionId] = useState(
    () => localStorage.getItem(STORAGE_KEYS.ID) || null
  );
  const [currentStep, setCurrentStep] = useState(
    () => localStorage.getItem(STORAGE_KEYS.STEP) || STEPS.INPUT
  );

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

  const [finalPlanData, setFinalPlanData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FINAL);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState([]); 
  const [currentEmailInput, setCurrentEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const clearSessionData = () => {
    setApiResponseData(null);
    setApiHistory([]);
    setChatMessages([]);
    setCurrentStep(STEPS.INPUT);
    setCurrentSessionId(null);
    setSelectedScenario(null);

    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);
    
    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);
  };

  useEffect(() => {
    const lastSavedRole = localStorage.getItem(STORAGE_KEYS.LAST_ROLE);
    if (lastSavedRole && lastSavedRole !== userRole) {
       console.log("Triggering State Reset due to Role Change...");
       clearSessionData();
    }
    
    if (userRole) {
      localStorage.setItem(STORAGE_KEYS.LAST_ROLE, userRole);
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    if (apiResponseData)
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(apiResponseData));
    else localStorage.removeItem(STORAGE_KEYS.DATA);
  }, [apiResponseData]);
  useEffect(() => {
    if (finalPlanData) localStorage.setItem(STORAGE_KEYS.FINAL, JSON.stringify(finalPlanData));
    else localStorage.removeItem(STORAGE_KEYS.FINAL);
  }, [finalPlanData]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(apiHistory));
  }, [apiHistory]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEP, currentStep);
  }, [currentStep]);
  useEffect(() => {
    if (currentSessionId)
      localStorage.setItem(STORAGE_KEYS.ID, currentSessionId);
  }, [currentSessionId]);

  const showToast = (message, type = "info") => setToast({ message, type });

  // --- LOGIC RESET ---
  const handleResetClick = () => setResetModalOpen(true);

  const confirmResetSession = () => {
    setApiResponseData(null);
    setApiHistory([]);
    setChatMessages([]);
    setCurrentStep(STEPS.INPUT);
    setCurrentSessionId(null);

    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);

    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);

    clearSessionData();
    setResetModalOpen(false);
    showToast("Sesi berhasil direset. Silakan mulai baru.", "success");
  };

  // --- LOGIC INPUT PROCESSED ---
  // --- LOGIC INPUT PROCESSED (PERBAIKAN DATA 0) ---
  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    const isShipping = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";

    // 1. Ambil Data Input Mentah dari LocalStorage
    const currentFormData = JSON.parse(localStorage.getItem("current_form_data") || "{}");

    // 2. Ambil Rekomendasi Pertama dari Agent (jika ada)
    const cardRecc = data.recommendations && data.recommendations[0] ? data.recommendations[0] : {};
    
    let finalTrucks, finalExcavators, finalOperators, finalStock, finalTransport, finalLoading;

    if (isShipping) {
        // --- LOGIKA MAPPING SHIPPING YANG LEBIH KUAT ---
        // Cek data dari Agent ATAU dari Form Input (Fallback ke nama variabel mining jika perlu)
        
        // Transport: Cek 'transport_capacity' (API) -> 'transportCapacity' (Form) -> 'truckCount' (Form Fallback)
        finalTransport = cardRecc.transport_capacity || currentFormData.transportCapacity || currentFormData.truckCount || 0;
        
        // Stock: Cek 'stock' (API) -> 'stockpileAvailable' (Form) -> 'excavatorCount' (Form Fallback)
        finalStock = cardRecc.stock || currentFormData.stock || currentFormData.stockpileAvailable || currentFormData.excavatorCount || 0;
        
        // Loading: Cek 'loading_time' (API) -> 'loadingTime' (Form) -> 'operatorCount' (Form Fallback)
        finalLoading = cardRecc.loading_time || currentFormData.loadingTime || currentFormData.operatorCount || 0;
        
        // Masukkan ke variabel display standar
        finalTrucks = finalTransport; 
        finalExcavators = finalStock;
        finalOperators = finalLoading;
    } else {
        // Logika Mining
        finalTrucks = cardRecc.trucks || currentFormData.truckCount || 0;
        finalExcavators = cardRecc.excavators || currentFormData.excavatorCount || 0;
        finalOperators = cardRecc.operators || currentFormData.operatorCount || 0;
    }

    const newHistoryItem = {
      sessionId: sessionId,
      date: new Date().toLocaleDateString("en-GB"),
      type: planType,
      title: cardRecc.title || "Analisis Awal",
      trucks: finalTrucks, 
      excavators: finalExcavators,
      operators: finalOperators,
      weather: cardRecc.weather || currentFormData.weatherCondition || "Sunny",
      target: data.target_tonnage,
      prediction: data.initial_prediction,
      gap: data.initial_difference,
      analysis: data.initial_analysis_text,
      summaryId: null,
    };

    const existingHistory = JSON.parse(localStorage.getItem("aiHistory") || "[]");
    localStorage.setItem("aiHistory", JSON.stringify([newHistoryItem, ...existingHistory]));

    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis ${planType} selesai! Prediksi awal: ${data.initial_prediction} Ton.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    // Simpan ke State Utama (Pastikan nama key konsisten untuk handleFinalize)
    setApiResponseData({
      ...data,
      status: "Calculated",
      // Field Mining Standard
      truckCount: finalTrucks,
      excavatorCount: finalExcavators,
      operatorCount: finalOperators,
      // Field Shipping Specific (PENTING!)
      stock: finalStock,
      transportCapacity: finalTransport,
      loadingTime: finalLoading,
      // Common
      weatherCondition: cardRecc.weather || currentFormData.weatherCondition,
      target_tonnage: isShipping ? currentFormData.shippingTarget : currentFormData.productionVolume,
    });
    
    setApiHistory([]);
    setCurrentStep(STEPS.RECOMMENDATION);
    setIsRecommendationOpen(true);
  };

  // --- LOGIC SCENARIO SELECTION ---
  const handleScenarioSelection = (scenario) => {
    setSelectedScenario(scenario);
    if (apiResponseData) {
      setApiHistory((prev) => [
        ...prev,
        { ...apiResponseData, id: prev.length + 1 },
      ]);
    }

    const isShippingScenario = "stock" in scenario;
    let query = isShippingScenario
      ? `Saya memilih skenario "${scenario.title}" (Stock: ${scenario.stock}, Trans: ${scenario.transport_capacity}). Hitung ulang.`
      : `Saya memilih skenario "${scenario.title}" (Truk: ${scenario.trucks}). Hitung ulang.`;

    const userMsg = {
      sender: "user",
      text: `Saya pilih skenario: "${scenario.title}"`,
      id: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    handleSendChat(query, true, scenario);
  };

  // --- LOGIC CHAT ---
  const handleSendChat = async (
    text,
    isSystemGenerated = false,
    newScenario = null
  ) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;

    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) {
      showToast("Sesi habis.", "error");
      return;
    }

    if (!isSystemGenerated) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "user", text: queryText, id: Date.now() },
      ]);
      setChatMessage("");
    }

    setIsChatLoading(true);
    const isShippingRole =
      userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const endpoint = isShippingRole
      ? `${API_BASE}/predict_shipping`
      : `${API_BASE}/predict_and_recommend`;
    const payload = { user_id: userId, query: queryText };

    const loadingId = Date.now() + 1;
    setChatMessages((prev) => [
      ...prev,
      { sender: "bot", text: "...", id: loadingId, isLoading: true },
    ]);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
      if (!response.ok) {
        const errTxt = await response.text();
        throw new Error(errTxt);
      }
      const data = await response.json();
      const botMsg = {
        sender: "bot",
        text: data.initial_analysis_text || "Data diperbarui.",
        id: Date.now() + 2,
      };
      setChatMessages((prev) => [...prev, botMsg]);

      const updatedResponse = {
        ...apiResponseData,
        ...data,
        status: "Calculated (Revised)",
        target_tonnage: data.target_tonnage,
        weatherCondition:
          newScenario?.weather || apiResponseData?.weatherCondition,
        ...(newScenario && isShippingRole
          ? {
              stock: newScenario.stock,
              transportCapacity: newScenario.transport_capacity,
              loadingTime: newScenario.loading_time,
            }
          : {}),
        ...(newScenario && !isShippingRole
          ? {
              truckCount: newScenario.trucks,
              excavatorCount: newScenario.excavators,
              operatorCount: newScenario.operators,
            }
          : {}),
      };

      if (!updatedResponse.truckCount)
        updatedResponse.truckCount = apiResponseData.truckCount || 0;
      if (!updatedResponse.stock)
        updatedResponse.stock = apiResponseData.stock || 0;

      setApiResponseData(updatedResponse);
    } catch (error) {
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: getFriendlyErrorMessage(error),
          id: Date.now() + 3,
        },
      ]);
      showToast("Gagal mengirim pesan.", "error");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!apiResponseData) {
      showToast("Belum ada data.", "warning");
      return;
    }

    let planType = "Mining";
    if (userRole && (userRole === "Shipping" || userRole.includes("Shipping"))) {
      planType = "Shipping";
    }

    const finalTitle = selectedScenario
      ? selectedScenario.title
      : apiResponseData.recommendations?.[0]?.title || "Analisis Plan";

    const isShippingRole = planType === "Shipping";
    
    const planId = isShippingRole 
        ? `SP-${Math.floor(Math.random() * 10000)}` 
        : `MP-${Math.floor(Math.random() * 10000)}`;

    let storageTrucks, storageExcavators, storageOperators, storageWeather;

    if (isShippingRole) {
        
        const stock = selectedScenario ? selectedScenario.stock : (apiResponseData.stock || 0);
        const transport = selectedScenario ? selectedScenario.transport_capacity : (apiResponseData.transportCapacity || 0);
        const loading = selectedScenario ? selectedScenario.loading_time : (apiResponseData.loadingTime || 0);
        const weather = selectedScenario ? selectedScenario.weather : (apiResponseData.weatherCondition || "Sunny");

        storageTrucks = transport; 
        storageExcavators = stock;  
        storageOperators = loading; 
        storageWeather = weather;
    } else {
        storageTrucks = selectedScenario ? selectedScenario.trucks : (apiResponseData.truckCount || 0);
        storageExcavators = selectedScenario ? selectedScenario.excavators : (apiResponseData.excavatorCount || 0);
        storageOperators = selectedScenario ? selectedScenario.operators : (apiResponseData.operatorCount || 0);
        storageWeather = selectedScenario ? selectedScenario.weather : (apiResponseData.weatherCondition || "Sunny");
    }

    const newPlan = {
      id: planId,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      type: planType,
      title: finalTitle,
      prediction: apiResponseData.initial_prediction,
      gap: apiResponseData.initial_difference,
      analysis: apiResponseData.initial_analysis_text,
      status: "Finalized",
      target: apiResponseData.target_tonnage,
      trucks: storageTrucks,
      excavators: storageExcavators,
      operators: storageOperators,
      weather: storageWeather,
    };

    const existingPlans = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");
    const updatedPlans = [newPlan, ...existingPlans];
    localStorage.setItem("finalizedPlans", JSON.stringify(updatedPlans));

    try {
        const token = localStorage.getItem("token"); 
        const notifMessage = `Plan tipe ${planType} baru dengan ID ${planId} telah berhasil disetujui dan disimpan.`;

        await axios.post("http://localhost:3000/api/notifications", {
            title: "Plan Finalized",
            message: notifMessage,
            type: "alert", 
            is_read: 0,  
            created_at: new Date().toISOString(),
            reference_id: planId 
        }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {} 
        });
        console.log("✅ Notifikasi berhasil dikirim!");
    } catch (error) {
        console.error("❌ Gagal mengirim notifikasi:", error);
    }

    if (apiResponseData && apiResponseData.status !== "Finalized") {
      setApiHistory((prev) => [...prev, { ...apiResponseData, id: prev.length + 1 }]);
    }
    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    showToast(`Plan ${planId} (${planType}) berhasil difinalisasi!`, "success");
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return (
          <InputData
            onDataProcessed={handleInputDataProcessed}
            userRole={userRole}
            showToast={showToast}
          />
        );
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="heading-2">
                Analisis & Diskusi
              </h3>
              <button
                onClick={handleResetClick}
                className="date !bg-red-500/10 !hover:bg-red-500/20 hover:cursor-pointer hover:scale-110 !text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2 transition"
              >
                <MdDeleteForever /> Reset Sesi
              </button>
            </div>

            <RecommendationDisplay
              apiData={apiResponseData}
              isOpen={isRecommendationOpen}
              setIsOpen={setIsRecommendationOpen}
              onFinalize={handleFinalize}
              onScenarioSelect={handleScenarioSelection}
            />

            {apiHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-500 mb-2 border-b border-white/5 pb-2">
                  Riwayat Perubahan Skenario
                </h4>
                {apiHistory.map((data, index) => (
                  <AnalysisHistoryCard
                    key={index}
                    iteration={index + 1}
                    apiData={data}
                  />
                ))}
              </div>
            )}

            <ChatInterface
              chatMessages={chatMessages}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              handleSendChat={handleSendChat}
              isChatLoading={isChatLoading}
              userRole={userRole}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-white p-4 pb-20">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <ConfirmModal
          isOpen={resetModalOpen}
          title="Mulai Sesi Baru?"
          message="Riwayat percakapan saat ini akan dihapus permanen."
          onConfirm={confirmResetSession}
          onCancel={() => setResetModalOpen(false)}
          confirmText="Ya, Reset"
          isDanger={true}
        />

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <StepBar currentStep={currentStep} />
          </div>
          {renderContent()}
        </div>
      </div>
    </PageTransition>
  );
};

export default Tanyakan;
