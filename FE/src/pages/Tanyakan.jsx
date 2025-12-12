import React, { useState, useEffect, useRef } from "react";
import { UseAuth } from "../context/AuthContext";
import axios from "axios";

// --- Komponen/Helper Pendukung (Ikon & UI) ---

// Ikon Placeholder (Sama seperti sebelumnya)
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
    {name === "Check" && <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />}
    {name === "Cloud" && <path d="M18 10h-1.26a8 8 0 1 0-14.73 6h.02" />}
    {name === "Truck" && (
      <path d="M1 3h15v12H1zM16 8h4l2 3v5h-2M15 19h-5M8 19h-5" />
    )}
    {name === "Tool" && (
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    )}
    {name === "Anchor" && (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    )}
    {name === "Person" && <circle cx="12" cy="7" r="4" />}
    {name === "Sunny" && <circle cx="12" cy="12" r="5" />}
    {name === "Warning" && <path d="M12 2L1 21h22L12 2zm0 13V9" />}
    {name === "Time" && <circle cx="12" cy="12" r="10" />} 
    {name === "Box" && <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />}
    {!name && <circle cx="12" cy="12" r="10" />}
  </svg>
);

const FiCheckCircle = (props) => <IconPlaceholder name="Check" {...props} />;
const FiCloud = (props) => <IconPlaceholder name="Cloud" {...props} />;
const FiTruck = (props) => <IconPlaceholder name="Truck" {...props} />;
const FiTool = (props) => <IconPlaceholder name="Tool" {...props} />;
const FiAnchor = (props) => <IconPlaceholder name="Anchor" {...props} />; // Ikon Shipping

const MdOutlineKeyboardArrowDown = (props) => (
  <IconPlaceholder name="Down" {...props} />
);
const MdOutlineKeyboardArrowUp = (props) => (
  <IconPlaceholder name="Up" {...props} />
);
const MdCheckCircleOutline = (props) => (
  <IconPlaceholder name="Check" {...props} />
);
const MdClose = (props) => <IconPlaceholder name="Close" {...props} />;
const MdTruck = (props) => <IconPlaceholder name="Truck" {...props} />;
const MdEngineering = (props) => <IconPlaceholder name="Tool" {...props} />;
const MdPerson = (props) => <IconPlaceholder name="Person" {...props} />;
const MdWbSunny = (props) => <IconPlaceholder name="Sunny" {...props} />;
const MdWarning = (props) => <IconPlaceholder name="Warning" {...props} />;
// Ikon tambahan untuk Shipping Mapping
const MdInventory = (props) => <IconPlaceholder name="Box" {...props} />; 
const MdAccessTime = (props) => <IconPlaceholder name="Time" {...props} />;

// --- Helper Functions ---
const mapWeather = (val) => {
  if (val == 0 || val === "0" || val === "Light Rain")
    return {
      label: "Light Rain (Hujan)",
      icon: <MdWarning className="text-yellow-500" />,
    };
  if (val == 1 || val === "1" || val === "Cloudy")
    return {
      label: "Cloudy (Berawan)",
      icon: <MdWbSunny className="text-gray-400" />,
    };
  if (val == 2 || val === "2" || val === "Sunny")
    return {
      label: "Sunny (Cerah)",
      icon: <MdWbSunny className="text-yellow-500" />,
    };
  return { label: val, icon: <MdWbSunny className="text-white" /> };
};

// --- StepBar Component ---
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
            <p
              className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                index < completedSteps ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Input Component (InputData) ---
const InputCard = ({ label, name, unit, value, onChange }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label
      htmlFor={name}
      className="text-sm text-gray-400 block mb-1 font-sans"
    >
      {label}
    </label>
    <div className="flex items-center">
      <input
        type="number"
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required
        min="0"
        className="w-full bg-[#404040] text-white p-2 rounded-l-md border-r-0 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-600 outline-none"
      />
      <span className="bg-[#404040] text-gray-400 p-2 rounded-r-md text-sm border-l border-gray-600">
        {unit}
      </span>
    </div>
  </div>
);

const SelectCard = ({ label, name, value, onChange, options }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label
      htmlFor={name}
      className="text-sm text-gray-400 block mb-1 font-sans"
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required
        className="w-full bg-[#404040] text-white p-2 rounded-md appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-600 outline-none pr-8"
      >
        <option value="" disabled>
          -- Pilih Kondisi --
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FiCloud className="text-gray-400" />
      </div>
    </div>
  </div>
);

const InputData = ({ onDataProcessed, userRole }) => {
  const API_BASE_URL = "http://localhost:8000";
  
  const WEATHER_OPTIONS = [
    { value: "Sunny", label: "Sunny (Cerah)" },
    { value: "Cloudy", label: "Cloudy (Berawan)" },
    { value: "Light Rain", label: "Rainy (Hujan)" },
  ];

  // State untuk Mining
  const initialMinePlannerState = {
    productionVolume: 80,
    truckCount: 10,
    excavatorCount: 2,
    operatorCount: 15,
    weatherCondition: "Sunny",
  };

  // State untuk Shipping
  const initialShippingPlannerState = {
    shippingTarget: 100,
    stock: 120,
    transportCapacity: 10,
    loadingTime: 8,
    weatherCondition: "Sunny",
  };

  const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
  
  const [formData, setFormData] = useState(isShippingRole ? initialShippingPlannerState : initialMinePlannerState);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let storedId = localStorage.getItem("mining_fe_user_id");
    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mining_fe_user_id", storedId);
    }
    setUserId(storedId);
    // Reset form jika role berubah
    setFormData(isShippingRole ? initialShippingPlannerState : initialMinePlannerState);
  }, [userRole]);

  const handleInputChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    let payload = {};
    let endpoint = "";

    if (isShippingRole) {
        // --- LOGIKA SHIPPING ---
        const { shippingTarget, stock, transportCapacity, loadingTime, weatherCondition } = formData;
        if (!shippingTarget || !stock || !transportCapacity || !loadingTime || !weatherCondition) {
             setLoading(false); setStatusMessage("❌ Semua input shipping harus diisi."); return;
        }
        const query = `Target shipping saya ${shippingTarget} ton. Saya punya Stock ${stock}, Kapasitas Transport ${transportCapacity}, Loading Time ${loadingTime} jam, Cuaca ${weatherCondition}. Beri 3 rekomendasi!`;
        
        payload = { user_id: userId, query: query };
        endpoint = `${API_BASE_URL}/predict_shipping`;

    } else {
        // --- LOGIKA MINING ---
        const { productionVolume, truckCount, excavatorCount, operatorCount, weatherCondition } = formData;
        if (!productionVolume || !truckCount || !excavatorCount || !operatorCount || !weatherCondition) {
            setLoading(false); setStatusMessage("❌ Semua input mining harus diisi."); return;
        }
        const query = `Saya ingin target ${productionVolume} ton. Saat ini pakai ${truckCount} Truk, ${excavatorCount} Ekskavator, ${operatorCount} Operator, cuaca ${weatherCondition}. Beri 3 rekomendasi!`;
        
        payload = { user_id: userId, query: query };
        endpoint = `${API_BASE_URL}/predict_and_recommend`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Simpan form data saat ini untuk riwayat
      localStorage.setItem("current_form_data", JSON.stringify(formData));

      if (!response.ok) {
        let errorDetail = { detail: "Gagal mengambil detail error." };
        try { const text = await response.text(); errorDetail = JSON.parse(text); } catch (e) {}
        throw new Error(`API Error: ${response.status} - ${errorDetail.detail || "Server Error"}`);
      }

      const data = await response.json();
      onDataProcessed(data); // Kirim data kembali ke Parent
      setStatusMessage(`✅ Data Berhasil Diproses! Target: ${data.target_tonnage} Ton.`);

    } catch (error) {
      console.error("Error mengirim data ke AI Agent:", error.message);
      setStatusMessage(`Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER INPUT MINING ---
  const renderMinePlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 ">
          <FiTruck className="mr-2" /> Target & Unit (Mining)
        </div>
        <InputCard
          label="Target Produksi Harian (Ton)"
          name="productionVolume"
          unit="Ton"
          value={formData.productionVolume}
          onChange={handleInputChange}
        />
        <InputCard
          label="Truck Count (Aktif)"
          name="truckCount"
          unit="Unit"
          value={formData.truckCount}
          onChange={handleInputChange}
        />
        <InputCard
          label="Excavator Count (Aktif)"
          name="excavatorCount"
          unit="Unit"
          value={formData.excavatorCount}
          onChange={handleInputChange}
        />
      </div>

      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2">
          <FiTool className="mr-2" /> SDM & Lingkungan
        </div>
        <InputCard
          label="Operator Count (On Shift)"
          name="operatorCount"
          unit="Orang"
          value={formData.operatorCount}
          onChange={handleInputChange}
        />
        <SelectCard
          label="Kondisi Cuaca Area Tambang"
          name="weatherCondition"
          value={formData.weatherCondition}
          onChange={handleInputChange}
          options={WEATHER_OPTIONS}
        />
      </div>
    </>
  );

  // --- RENDER INPUT SHIPPING (BARU - Diimplementasikan) ---
  const renderShippingPlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 ">
          <FiAnchor className="mr-2" /> Target & Logistik (Shipping)
        </div>
        <InputCard
          label="Target Shipping (Ton)"
          name="shippingTarget"
          unit="Ton"
          value={formData.shippingTarget}
          onChange={handleInputChange}
        />
        <InputCard
          label="Stockpile Tersedia"
          name="stock"
          unit="Ton"
          value={formData.stock}
          onChange={handleInputChange}
        />
        <InputCard
          label="Kapasitas Transport/Trip"
          name="transportCapacity"
          unit="Ton"
          value={formData.transportCapacity}
          onChange={handleInputChange}
        />
      </div>

      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2">
          <FiTool className="mr-2" /> Waktu & Lingkungan
        </div>
        <InputCard
          label="Waktu Loading (Jam)"
          name="loadingTime"
          unit="Jam"
          value={formData.loadingTime}
          onChange={handleInputChange}
        />
        <SelectCard
          label="Kondisi Cuaca Pelabuhan"
          name="weatherCondition"
          value={formData.weatherCondition}
          onChange={handleInputChange}
          options={WEATHER_OPTIONS}
        />
      </div>
    </>
  );

  return (
    <div className="kode-mono min-h-screen p-1 ">
      <header className="text-center mb-7">
        <p className="heading-1 mt-2 text-primary">
          {" "}
          Input Data : Role {userRole || "User"}
        </p>
        <p className="note">User ID Sesi: {userId}</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="card-input-grid grid md:grid-cols-2 gap-6">
          {/* Render dinamis berdasarkan Role */}
          {isShippingRole ? renderShippingPlannerInputs() : renderMinePlannerInputs()}
        </div>

        <div className="text-center mt-10">
          <button
            type="submit"
            className="px-10 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition duration-200 shadow-lg disabled:bg-gray-500 flex items-center justify-center mx-auto"
            disabled={loading}
          >
            {loading ? (
              "Mengirim..."
            ) : (
              <>
                <FiCheckCircle className="mr-2" /> KIRIM DATA & HITUNG REKOMENDASI
              </>
            )}
          </button>

          {statusMessage && (
            <p
              className={`mt-4 text-sm ${statusMessage.startsWith("✅") ? "text-green-400" : "text-yellow-400"}`}
            >
              {statusMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Component RecommendationDisplay (HasilRekomendasi) ---

const RecommendationCard = ({ recommendation, index, onScenarioSelect }) => {
  const weatherInfo = mapWeather(recommendation.weather);
  const differenceColor =
    recommendation.difference_from_target < 1.0
      ? "text-green-400"
      : "text-yellow-400";

  // --- LOGIKA MAPPING UNIVERSAL (MINING & SHIPPING) ---
  // Backend mengembalikan key berbeda untuk Mining vs Shipping.
  // Kita cek keberadaan key untuk menentukan apa yang ditampilkan agar Layout Card tetap sama.
  
  const isShipping = 'stock' in recommendation;

  // Mapping Variable untuk Tampilan
  const param1 = {
      label: isShipping ? "Stock" : "Truk",
      value: isShipping ? recommendation.stock : recommendation.trucks,
      unit: isShipping ? "Ton" : "Unit",
      icon: isShipping ? <MdInventory className="text-xl text-red-400" /> : <MdTruck className="text-xl text-red-400" />
  };

  const param2 = {
      label: isShipping ? "Kapasitas Transport" : "Eskavator",
      value: isShipping ? recommendation.transport_capacity : recommendation.excavators,
      unit: isShipping ? "Ton" : "Unit",
      icon: isShipping ? <FiTruck className="text-xl text-yellow-400" /> : <MdEngineering className="text-xl text-yellow-400" />
  };

  const param3 = {
      label: isShipping ? "Waktu Loading" : "Operator",
      value: isShipping ? recommendation.loading_time : recommendation.operators,
      unit: isShipping ? "Jam" : "Orang",
      icon: isShipping ? <MdAccessTime className="text-xl text-blue-400" /> : <MdPerson className="text-xl text-blue-400" />
  };

  // Data yang dikirim saat tombol diklik (harus mencakup semua kemungkinan)
  const scenarioData = {
    title: recommendation.title,
    weather: recommendation.weather,
    // Mining properties
    trucks: recommendation.trucks,
    excavators: recommendation.excavators,
    operators: recommendation.operators,
    // Shipping properties
    stock: recommendation.stock,
    transport_capacity: recommendation.transport_capacity,
    loading_time: recommendation.loading_time
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl min-w-[280px] max-w-xs flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-bold text-purple-400 mb-2 border-b border-gray-700 pb-2">
          #{index + 1}: {recommendation.title}
        </h4>

        <div className="space-y-1 text-sm mb-4">
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
              {param1.icon} {param1.label}:
            </span>
            <span className="font-semibold text-white">
              {param1.value} {param1.unit}
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
               {param2.icon} {param2.label}:
            </span>
            <span className="font-semibold text-white">
              {param2.value} {param2.unit}
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
               {param3.icon} {param3.label}:
            </span>
            <span className="font-semibold text-white">
              {param3.value} {param3.unit}
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
              {weatherInfo.icon} Cuaca:
            </span>
            <span className="font-semibold text-white">
              {weatherInfo.label}
            </span>
          </p>
        </div>

        <p className="text-md font-bold mt-3 border-t border-gray-700 pt-2">
          <span className="text-green-400">📈 Output: </span>
          <span className="text-white">
            {recommendation.predicted_tonnage} Ton
          </span>
        </p>
        <p className="text-xs font-medium mt-1">
          <span className="text-gray-400">Gap dari Target: </span>
          <span className={differenceColor}>
            {recommendation.difference_from_target} Ton
          </span>
        </p>

        <p className="text-xs italic text-gray-400 mt-4">
          Alasan: "{recommendation.rationale}"
        </p>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold text-white transition flex items-center justify-center gap-2"
        onClick={() => onScenarioSelect(scenarioData)}
      >
        Pilih Skenario Ini
      </button>
    </div>
  );
};

const RecommendationDisplay = ({
  apiData,
  isOpen,
  setIsOpen,
  onFinalize,
  onScenarioSelect,
}) => {
  const hasData =
    apiData && apiData.recommendations && apiData.recommendations.length > 0;

  if (!hasData) {
    return (
      <div className="text-white p-4 text-center rounded-xl">
        Menunggu input data dan hasil dari Agent API...
      </div>
    );
  }

  const {
    target_tonnage,
    initial_prediction,
    initial_difference,
    initial_analysis_text,
    recommendations,
  } = apiData;

  const isFinalized = apiData.status === "Finalized";
  const statusText = isFinalized ? "Telah Difinalisasi" : "Berhasil Dihitung";
  const statusColor = isFinalized ? "text-green-400" : "text-yellow-400";

  return (
    <div className="w-full text-white text-left">
      <div className="bg-[#2d2d2d] p-0 rounded-xl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full py-4 px-4 bg-gray-700/50 border border-purple-500 rounded-xl hover:bg-gray-800 transition"
        >
          <span className="text-lg font-bold text-white">
            Hasil Rekomendasi Optimasi
          </span>
          {isOpen ? (
            <MdOutlineKeyboardArrowUp className="text-3xl text-purple-400" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-3xl text-purple-400" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full 
                        ${isOpen ? "max-h-[3000px] opacity-100 p-6" : "max-h-0 opacity-0 p-0"} 
                        bg-[#2d2d2d] border border-t-0 border-purple-500 rounded-b-xl`}
        >
          
          {/* --- KARTU REKOMENDASI TONASE --- */}
          <h3 className="text-xl font-semibold mb-4 text-purple-400 border-t border-gray-700 pt-4">
            💡 Opsi Rekomendasi (Optimasi Sumber Daya)
          </h3>

          <div className="flex space-x-4 overflow-x-auto pb-4">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={index}
                recommendation={item}
                index={index}
                onScenarioSelect={onScenarioSelect}
              />
            ))}
          </div>  

          {/* --- ANALISIS --- */}
          <h4 className="text-lg font-semibold mb-2 text-white">
            📝 Analisis Agent:
          </h4>
          <p className="text-sm text-gray-300 mb-6 italic">
            {initial_analysis_text}
          </p>

          {/* --- STATUS METRICS --- */}
          <h3 className="text-xl font-semibold mb-3 text-purple-400">
            📊 Status Operasional Saat Ini
          </h3>
          <div className="grid grid-cols-3 gap-3 p-3 bg-blue-900/20 border border-blue-600/50 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">Target</p>
              <p className="text-lg font-bold text-white">
                {target_tonnage} Ton
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Prediksi Saat Ini</p>
              <p className="text-lg font-bold text-yellow-400">
                {initial_prediction} Ton
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Gap (Kekurangan)</p>
              <p className="text-lg font-bold text-red-500">
                {initial_difference} Ton
              </p>
            </div>
          </div>

          {/* --- FOOTER/ACTION AREA --- */}
          <div className="border-t border-gray-700 mt-6 pt-4">
            <p className="text-sm italic text-gray-400 mb-4">
              Pilih salah satu skenario di atas atau klik 'Finalisasi dan Kirim'
              jika Anda puas.
            </p>

            <div className="flex justify-between items-center">
              <p className="text-md font-medium text-gray-300">
                Status :{" "}
                <span className={`font-bold ${statusColor}`}>{statusText}</span>
              </p>
              <button
                onClick={onFinalize}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  isFinalized
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Finalisasi dan Kirim{" "}
                <MdCheckCircleOutline className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Riwayat Analisis ---

const AnalysisHistoryCard = ({ iteration, apiData }) => {
  if (!apiData || !apiData.initial_prediction) return null;

  const weatherInfo = mapWeather(apiData.weatherCondition || "N/A");
  
  // Tentukan apakah ini data Shipping atau Mining untuk display ringkasan
  const isShipping = apiData.stock !== undefined; 

  return (
    <div className="w-full text-left bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4">
      <h4 className="text-sm font-bold text-yellow-400 mb-2 border-b border-gray-700 pb-2">
        Riwayat Analisis #{iteration} (Iterasi Lama)
      </h4>

      <p className="text-xs italic text-gray-300 mb-3">
        {apiData.initial_analysis_text.substring(0, 100)}...
      </p>

      {/* Detail Skenario yang Dipilih/Digunakan dalam iterasi ini */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <p className="text-gray-400 flex justify-between">
          <span>Target:</span>{" "}
          <span className="font-semibold text-white">
            {apiData.target_tonnage || "N/A"} Ton
          </span>
        </p>
        <p className="text-gray-400 flex justify-between">
          <span>Hasil Prediksi:</span>{" "}
          <span className="font-bold text-red-500">
            {apiData.initial_prediction} Ton
          </span>
        </p>
        <p className="text-gray-400 flex justify-between col-span-2">
          <span>Konfigurasi:</span>
          <span className="font-semibold text-purple-300">
            {isShipping 
               ? `Stock: ${apiData.stock}, Trans: ${apiData.transportCapacity}` 
               : `${apiData.truckCount} Truk, ${apiData.excavatorCount} Ekskavator`
            }
          </span>
        </p>
        <p className="text-gray-400 flex justify-between col-span-2">
          <span>&nbsp;</span>
          <span className="font-semibold text-purple-300">
             {isShipping 
                ? `Loading: ${apiData.loadingTime} Jam, ${weatherInfo.label}`
                : `${apiData.operatorCount} Operator, ${weatherInfo.label}`
             }
          </span>
        </p>
      </div>
    </div>
  );
};

// --- Component Utama Tanyakan (Main Container) ---

const STEPS = {
  INPUT: "Input Data",
  RECOMMENDATION: "Rekomendasi",
  FINALIZATION: "Finalisasi",
};

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";
  const { userRole } = UseAuth(); // Mengambil userRole (Main/MiningPlanner/Shipping)

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(STEPS.INPUT);
  const [apiResponseData, setApiResponseData] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleInputDataProcessed = (data) => {
    const sessionId = Date.now().toString();
    setCurrentSessionId(sessionId);
    setSelectedScenario(null);

    const cardRecc = data.recommendations[0];
    const isShipping = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const planType = isShipping ? "Shipping" : "Mining";

    const newHistoryItem = {
      sessionId: sessionId,
      date: new Date().toLocaleDateString("en-GB"),
      type: planType,
      title: cardRecc.title,
      // Mapping parameter generic untuk history
      trucks: isShipping ? cardRecc.transport_capacity : cardRecc.trucks, // Mapping visual: trucks -> transport (sesuai RecommendationCard)
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

    setApiResponseData({ ...data, status: "Calculated" });
    
    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis ${planType} berhasil! Prediksi Tonase saat ini: ${data.initial_prediction} Ton. Silakan tinjau rekomendasi di atas atau ketik pertanyaan lanjutan.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    // Ambil data input mentah untuk keperluan display history
    const currentFormData = JSON.parse(localStorage.getItem("current_form_data") || "{}");

    setApiResponseData({
      ...data,
      status: "Calculated",
      // Merge input data awal ke response untuk keperluan display history nanti
      truckCount: currentFormData.truckCount,
      excavatorCount: currentFormData.excavatorCount,
      operatorCount: currentFormData.operatorCount,
      // Shipping specific fields
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

  const handleScenarioSelection = (scenario) => {
    setSelectedScenario(scenario);
    if (apiResponseData) {
      setApiHistory((prev) => [
        ...prev,
        { ...apiResponseData, id: prev.length + 1 },
      ]);
    }
    
    // Deteksi tipe berdasarkan properti scenario
    const isShippingScenario = 'stock' in scenario;
    let query = "";

    if (isShippingScenario) {
        query = `Saya memilih skenario "${scenario.title}" dengan Stock: ${scenario.stock}, Kapasitas Transport: ${scenario.transport_capacity}, Loading Time: ${scenario.loading_time}, Cuaca: ${scenario.weather}. Bagaimana prediksi finalnya?`;
    } else {
        query = `Saya memilih skenario "${scenario.title}" dengan konfigurasi Truk: ${scenario.trucks}, Eskavator: ${scenario.excavators}, Operator: ${scenario.operators}, Cuaca: ${scenario.weather}. Bagaimana prediksi finalnya?`;
    }

    const userMsg = {
      sender: "user",
      text: `Saya memilih skenario: ${scenario.title}. Prediksi ulang!`,
      id: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    handleSendChat(query, true, scenario); 
  };

  // --- LOGIKA CHAT YANG DINAMIS ---
  const handleSendChat = async (text, isSystemGenerated = false, newScenario = null) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;

    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) {
      alert("Sesi pengguna tidak ditemukan."); return;
    }

    if (!isSystemGenerated) {
      setChatMessages((prev) => [...prev, { sender: "user", text: queryText, id: Date.now() }]);
      setChatMessage(""); 
    }

    setIsChatLoading(true);

    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    const endpoint = isShippingRole ? `${API_BASE}/predict_shipping` : `${API_BASE}/predict_and_recommend`;

    const payload = { user_id: userId, query: queryText };

    const loadingId = Date.now() + 1;
    setChatMessages((prev) => [...prev, { sender: "bot", text: "Agent menganalisis...", id: loadingId, isLoading: true }]);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));

      if (!response.ok) throw new Error("Gagal menghubungi Agent.");

      const data = await response.json();

      const botMsg = {
        sender: "bot",
        text: `Analisis Agent: ${data.initial_analysis_text} Prediksi terbaru: ${data.initial_prediction} Ton. Rekomendasi diperbarui.`,
        id: Date.now() + 2,
      };
      setChatMessages((prev) => [...prev, botMsg]);

      if (!isSystemGenerated && apiResponseData) {
        setApiHistory((prev) => [...prev, { ...apiResponseData, id: prev.length + 1 }]);
      }

      // Update response data dengan nilai dari Scenario baru (jika ada) atau tetap pakai data lama
      const updatedResponse = {
        ...data,
        status: "Calculated (Revised)",
        target_tonnage: data.target_tonnage,
        weatherCondition: newScenario?.weather || apiResponseData?.weatherCondition,
      };

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
      console.error("Chat Error:", error);
      setChatMessages((prev) => [...prev, { sender: "bot", text: "❌ Error: " + error.message, id: Date.now() + 3 }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!apiResponseData) {
      alert("Belum ada data analisis."); return;
    }

    const finalTitle = selectedScenario ? selectedScenario.title : (apiResponseData.recommendations?.[0]?.title || "Analisis Plan");
    const isShippingRole = userRole && (userRole === "Shipping" || userRole.includes("Shipping"));
    
    // Tentukan Nilai Akhir
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

    const planType = isShippingRole ? "Shipping" : "Mining";
    const planId = `SP-${Math.floor(Math.random() * 10000)}`;
    
    const newPlan = {
      id: planId,
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      type: planType,
      title: finalTitle,
      prediction: apiResponseData.initial_prediction,
      gap: apiResponseData.initial_difference,        
      analysis: apiResponseData.initial_analysis_text,
      status: "Finalized",
      ...finalData // Spread properti spesifik (trucks/stock dll)
    };

    try {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.post("http://localhost:3000/api/notifications", {
                title: `${planType} Plan Finalized`,
                message: `Plan ID: ${planId} telah disetujui.`,
                type: "alert",
                reference_id: planId
            }, { headers: { Authorization: `Bearer ${token}` } });
        }
    } catch (error) { console.error("Notif Error:", error); }

    // Simpan ke LocalStorage finalizedPlans
    const existingPlans = JSON.parse(localStorage.getItem("finalizedPlans") || "[]");
    localStorage.setItem("finalizedPlans", JSON.stringify([newPlan, ...existingPlans]));

    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    alert(`Plan ${planType} berhasil difinalisasi!`);
  };

  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return <InputData onDataProcessed={handleInputDataProcessed} userRole={userRole} />;
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        return (
          <>
            {apiHistory.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-500 mb-2 border-b border-gray-700 pb-2">
                  Riwayat Analisis Sebelumnya ({apiHistory.length})
                </h3>
                {apiHistory.map((data, index) => (
                  <AnalysisHistoryCard
                    key={data.id || index}
                    iteration={index + 1}
                    apiData={data}
                  />
                ))}
              </div>
            )}

            <RecommendationDisplay
              apiData={apiResponseData}
              isOpen={isRecommendationOpen}
              setIsOpen={setIsRecommendationOpen}
              onFinalize={handleFinalize}
              onScenarioSelect={handleScenarioSelection}
            />

            <div className="mt-5 text-left flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-700 p-4 rounded-xl bg-gray-900">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Diskusi Lanjutan ({userRole === "Shipping" ? "Shipping Agent" : "Mining Agent"})
              </h3>
              <div className="flex-1 space-y-4 mb-4">
                {chatMessages.map((msg) =>
                  msg.sender === "user" ? (
                    <div key={msg.id} className="flex justify-end w-full ">
                      <div className="space-y-1">
                        <p className="text-right text-xs text-gray-400"> Saya</p>
                        <div className="bg-purple-600 px-4 py-3 rounded-xl max-w-xs text-sm">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start w-full">
                      <div>
                        <p className="text-left text-xs text-gray-400"> Agent</p>
                        <div className={`px-4 py-3 rounded-xl max-w-xs text-sm ${msg.isLoading ? "bg-gray-600 italic animate-pulse" : "bg-gray-700"}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={chatEndRef}></div>
              </div>
            </div>

            <div className="sticky bottom-0 w-full z-10 p-4">
              <div className="max-w-4xl mx-auto flex items-center space-x-2 p-3 rounded-xl">
                <input
                  type="text"
                  placeholder={userRole === "Shipping" ? "Contoh: 'tambah kapasitas transport'" : "Contoh: 'tambah 2 truk lagi'"}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatMessage)}
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isChatLoading}
                />
                <button
                  onClick={() => handleSendChat(chatMessage)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-500"
                  disabled={isChatLoading}
                >
                  {isChatLoading ? "..." : "Kirim"}
                </button>
              </div>
            </div>
          </>
        );
      default:
        return <div className="text-center text-red-400">Status Error.</div>;
    }
  };

  return (
    <div className="min-h-screen text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <StepBar currentStep={currentStep} />
        </div>
        <div className="mt-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Tanyakan;