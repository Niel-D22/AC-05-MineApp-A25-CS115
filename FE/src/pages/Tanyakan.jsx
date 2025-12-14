import React, { useState, useEffect } from "react";
import { UseAuth } from "../context/AuthContext";
import axios from "axios";
import { Toast, ConfirmModal } from "../component/CostumAlerts";
import { MdDeleteForever, MdEmail, MdSend, MdClose } from "react-icons/md";
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
  FINAL: "mate_final_plan_temp",
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
    console.warn(
      `Role mismatch (${savedRole} vs ${userRole}). Purging storage before init...`
    );
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);
  }

  // --- STATE INIT ---
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

  // --- EMAIL STATE ---
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [currentEmailInput, setCurrentEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
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
    setFinalPlanData(null); // Clear final data too

    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.ID);
    localStorage.removeItem(STORAGE_KEYS.FINAL);

    localStorage.removeItem("mining_fe_user_id");
    let newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("mining_fe_user_id", newId);
  };

  // --- EFFECTS ---
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
    if (finalPlanData)
      localStorage.setItem(STORAGE_KEYS.FINAL, JSON.stringify(finalPlanData));
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
    clearSessionData();
    setResetModalOpen(false);
    showToast("Sesi berhasil direset. Silakan mulai baru.", "success");
  };

  // --- LOGIC INPUT PROCESSED ---
  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    const isShipping =
      userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";

    const currentFormData = JSON.parse(
      localStorage.getItem("current_form_data") || "{}"
    );
    const cardRecc =
      data.recommendations && data.recommendations[0]
        ? data.recommendations[0]
        : {};

    let finalTrucks,
      finalExcavators,
      finalOperators,
      finalStock,
      finalTransport,
      finalLoading;

    if (isShipping) {
      finalTransport =
        cardRecc.transport_capacity ||
        currentFormData.transportCapacity ||
        currentFormData.truckCount ||
        0;
      finalStock =
        cardRecc.stock ||
        currentFormData.stock ||
        currentFormData.stockpileAvailable ||
        currentFormData.excavatorCount ||
        0;
      finalLoading =
        cardRecc.loading_time ||
        currentFormData.loadingTime ||
        currentFormData.operatorCount ||
        0;

      finalTrucks = finalTransport;
      finalExcavators = finalStock;
      finalOperators = finalLoading;
    } else {
      finalTrucks = cardRecc.trucks || currentFormData.truckCount || 0;
      finalExcavators =
        cardRecc.excavators || currentFormData.excavatorCount || 0;
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

    setApiResponseData({
      ...data,
      status: "Calculated",
      truckCount: finalTrucks,
      excavatorCount: finalExcavators,
      operatorCount: finalOperators,
      stock: finalStock,
      transportCapacity: finalTransport,
      loadingTime: finalLoading,
      weatherCondition: cardRecc.weather || currentFormData.weatherCondition,
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
    // 1. CEK PENGAMAN: Jika sedang proses atau sudah final, BERHENTI.
    if (isFinalizing || apiResponseData?.status === "Finalized") {
      return;
    }

    if (!apiResponseData) {
      showToast("Belum ada data.", "warning");
      return;
    }

    // 2. KUNCI TOMBOL SEGERA
    setIsFinalizing(true);

    try {
      let planType = "Mining";
      if (
        userRole &&
        (userRole === "Shipping" || userRole.includes("Shipping"))
      ) {
        planType = "Shipping";
      }

      // ... (Kode logika pembuatan planId, finalData, newPlan TETAP SAMA seperti sebelumnya) ...
      const finalTitle = selectedScenario
        ? selectedScenario.title
        : apiResponseData.recommendations?.[0]?.title || "Analisis Plan";

      const isShippingRole = planType === "Shipping";
      const planId = isShippingRole
        ? `SP-${Math.floor(Math.random() * 10000)}`
        : `MP-${Math.floor(Math.random() * 10000)}`;

      let storageTrucks, storageExcavators, storageOperators, storageWeather;

      if (isShippingRole) {
        const stock = selectedScenario
          ? selectedScenario.stock
          : apiResponseData.stock || 0;
        const transport = selectedScenario
          ? selectedScenario.transport_capacity
          : apiResponseData.transportCapacity || 0;
        const loading = selectedScenario
          ? selectedScenario.loading_time
          : apiResponseData.loadingTime || 0;
        const weather = selectedScenario
          ? selectedScenario.weather
          : apiResponseData.weatherCondition || "Sunny";

        storageTrucks = transport;
        storageExcavators = stock;
        storageOperators = loading;
        storageWeather = weather;
      } else {
        storageTrucks = selectedScenario
          ? selectedScenario.trucks
          : apiResponseData.truckCount || 0;
        storageExcavators = selectedScenario
          ? selectedScenario.excavators
          : apiResponseData.excavatorCount || 0;
        storageOperators = selectedScenario
          ? selectedScenario.operators
          : apiResponseData.operatorCount || 0;
        storageWeather = selectedScenario
          ? selectedScenario.weather
          : apiResponseData.weatherCondition || "Sunny";
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
        transport_capacity: isShippingRole ? storageTrucks : 0,
        stock: isShippingRole ? storageExcavators : 0,
        loading_time: isShippingRole ? storageOperators : 0,
      };

      const existingPlans = JSON.parse(
        localStorage.getItem("finalizedPlans") || "[]"
      );
      const updatedPlans = [newPlan, ...existingPlans];
      localStorage.setItem("finalizedPlans", JSON.stringify(updatedPlans));

      setFinalPlanData(newPlan);

      // Kirim Notifikasi
      const token = localStorage.getItem("token");
      const notifMessage = `Plan tipe ${planType} baru dengan ID ${planId} telah berhasil disetujui dan disimpan.`;
      await axios.post(
        "http://localhost:3000/api/notifications",
        {
          title: "Plan Finalized",
          message: notifMessage,
          type: "alert",
          is_read: 0,
          created_at: new Date().toISOString(),
          reference_id: planId,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (apiResponseData && apiResponseData.status !== "Finalized") {
        setApiHistory((prev) => [
          ...prev,
          { ...apiResponseData, id: prev.length + 1 },
        ]);
      }

      setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
      setCurrentStep(STEPS.FINALIZATION);
      showToast(
        `Plan ${planId} (${planType}) berhasil difinalisasi!`,
        "success"
      );

      setTimeout(() => setEmailModalOpen(true), 1500);
    } catch (error) {
      console.error("Error finalizing:", error);
      showToast("Terjadi kesalahan saat finalisasi.", "error");
      setIsFinalizing(false); // Buka kunci jika error agar bisa coba lagi
    }
    // Note: Jika sukses, kita biarkan isFinalizing = true agar tombol tetap mati.
  };

  // --- LOGIC ADD EMAIL (CHIP) ---
  const handleAddEmail = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = currentEmailInput.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (!emailList.includes(email)) {
          setEmailList([...emailList, email]);
          setCurrentEmailInput("");
        } else {
          showToast("Email sudah ada di daftar.", "warning");
        }
      } else if (email) {
        showToast("Format email tidak valid.", "error");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove));
  };

  // --- LOGIC SEND EMAIL ---
  const handleSendEmail = async () => {
    let finalRecipients = [...emailList];
    if (
      currentEmailInput &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmailInput.trim())
    ) {
      finalRecipients.push(currentEmailInput.trim());
    }

    if (finalRecipients.length === 0) {
      showToast("Masukkan setidaknya satu email tujuan.", "warning");
      return;
    }

    if (!finalPlanData) {
      showToast(
        "Data Final tidak ditemukan. Lakukan finalisasi ulang.",
        "error"
      );
      return;
    }

    setIsSendingEmail(true);

    const isShippingRole =
      userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShippingRole ? "Shipping" : "Mining";
    const weatherMap = {
      0: "Light Rain (Hujan Ringan)",
      1: "Cloudy (Berawan)",
      2: "Sunny (Cerah)",
      0: "Light Rain (Hujan Ringan)",
      1: "Cloudy (Berawan)",
      2: "Sunny (Cerah)",
    };
    const weatherLabel =
      weatherMap[finalPlanData.weather] || finalPlanData.weather;

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
               ${weatherLabel}
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
      subject: `[MATE] Laporan Harian ${planType} - ${finalPlanData.date}`,
      body_content: bodyContent,
    };

    try {
      const response = await fetch(`${API_BASE}/send_report_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal mengirim email.");

      showToast(
        `Laporan berhasil dikirim ke ${finalRecipients.length} penerima!`,
        "success"
      );
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
              <h3 className="heading-2">Analisis & Diskusi</h3>
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
              isFinalizing={isFinalizing}
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

        {/* --- MODAL INPUT EMAIL (MULTIPLE RECIPIENTS) --- */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1e1e1e] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl p-6 relative">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <MdClose size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                  <MdEmail size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Bagikan Laporan
                </h3>
              </div>

              <p className="text-sm text-gray-300 mb-4">
                Ketik email penerima lalu tekan <strong>Enter</strong> atau{" "}
                <strong>Koma</strong> untuk menambahkan.
              </p>

              {/* Area Email Chips */}
              <div className="flex flex-wrap gap-2 mb-3 bg-[#0a0a0a] border border-white/10 rounded-lg p-2 min-h-[50px]">
                {emailList.map((email, index) => (
                  <span
                    key={index}
                    className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-md text-xs flex items-center gap-2 animate-fade-in"
                  >
                    {email}
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="hover:text-white focus:outline-none"
                    >
                      <MdClose size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  placeholder={
                    emailList.length === 0
                      ? "contoh@email.com..."
                      : "Tambah lagi..."
                  }
                  className="bg-transparent text-sm text-white focus:outline-none flex-1 min-w-[120px]"
                  value={currentEmailInput}
                  onChange={(e) => setCurrentEmailInput(e.target.value)}
                  onKeyDown={handleAddEmail}
                />
              </div>
              <p className="text-[10px] text-gray-500 mb-4">
                * Tekan Enter untuk mengunci email
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition shadow-lg"
                >
                  {isSendingEmail ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <MdSend /> Kirim (
                      {emailList.length + (currentEmailInput ? 1 : 0)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
