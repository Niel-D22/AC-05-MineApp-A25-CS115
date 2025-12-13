import React, { useState, useEffect } from "react";
import { UseAuth } from "../context/AuthContext";

// --- PERBAIKAN IMPORT PATH (Sesuaikan dengan lokasi file Anda) ---
// Pastikan file CostumAlerts ada di folder component
import { Toast, ConfirmModal } from "../component/CostumAlerts";

// Import Ikon
import { MdRefresh, MdDeleteForever, MdChat } from "react-icons/md";

// Import Komponen Pecahan (Pastikan file-file ini sudah dibuat di folder component/Tanyakan)
import StepBar from "../component/Tanyakan/StepBar";
import InputData from "../component/Tanyakan/InputForm";
// Perhatikan: AnalysisHistoryCard harus diekspor dari file RecommendationDisplay
import RecommendationDisplay, {
  AnalysisHistoryCard,
} from "../component/Tanyakan/HasilRekomendasi";
import ChatInterface from "../component/Tanyakan/ChatInterface";

// Opsional: PageTransition (Hapus jika tidak pakai)
import PageTransition from "../component/PageTransition";

// --- HELPER: Error Message Friendly ---
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
};

const STEPS = {
  INPUT: "Input Data",
  RECOMMENDATION: "Rekomendasi",
  FINALIZATION: "Finalisasi",
};

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth();

  // --- STATE INIT WITH PERSISTENCE ---
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

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    if (apiResponseData)
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(apiResponseData));
    else localStorage.removeItem(STORAGE_KEYS.DATA);
  }, [apiResponseData]);
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

    setResetModalOpen(false);
    showToast("Sesi berhasil direset. Silakan mulai baru.", "success");
  };

  // --- LOGIC INPUT PROCESSED ---
  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    const cardRecc = data.recommendations[0];
    const isShipping =
      userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
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
      summaryId: null,
    };

    const existingHistory = JSON.parse(
      localStorage.getItem("aiHistory") || "[]"
    );
    localStorage.setItem(
      "aiHistory",
      JSON.stringify([newHistoryItem, ...existingHistory])
    );

    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis ${planType} selesai! Prediksi awal: ${data.initial_prediction} Ton.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    const currentFormData = JSON.parse(
      localStorage.getItem("current_form_data") || "{}"
    );

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
      target_tonnage: isShipping
        ? currentFormData.shippingTarget
        : currentFormData.productionVolume,
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

      // Safety check agar UI tidak blank jika field kosong
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

  // --- LOGIC FINALISASI ---
  const handleFinalize = async () => {
    if (!apiResponseData) {
      showToast("Belum ada data.", "warning");
      return;
    }
    const finalTitle = selectedScenario
      ? selectedScenario.title
      : apiResponseData.recommendations?.[0]?.title || "Analisis Plan";
    const isShippingRole =
      userRole && (userRole === "Shipping" || userRole.includes("Shipping"));

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

    const newPlan = {
      id: `SP-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
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

    const existingPlans = JSON.parse(
      localStorage.getItem("finalizedPlans") || "[]"
    );
    localStorage.setItem(
      "finalizedPlans",
      JSON.stringify([newPlan, ...existingPlans])
    );
    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    showToast(`Plan berhasil difinalisasi!`, "success");
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
              <h3 className="text-xl font-bold text-white">
                Analisis & Diskusi
              </h3>
              <button
                onClick={handleResetClick}
                className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition"
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
