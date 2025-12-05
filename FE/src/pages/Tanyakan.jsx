import React, { useState, useEffect, useRef } from "react";

// --- Komponen/Helper Pendukung (Diambil dari InputData.jsx dan HasilRekomendasi.jsx) ---

// Ikon Placeholder (Menggantikan react-icons/fi dan react-icons/md)
const IconPlaceholder = ({ name, className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`} // Ukuran diseragamkan
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Menggunakan path sederhana atau placeholder lingkaran/kotak */}
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
    {!name && <circle cx="12" cy="12" r="10" />}
  </svg>
);

const FiCheckCircle = (props) => <IconPlaceholder name="Check" {...props} />;
const FiCloud = (props) => <IconPlaceholder name="Cloud" {...props} />;
const FiTruck = (props) => <IconPlaceholder name="Truck" {...props} />;
const FiTool = (props) => <IconPlaceholder name="Tool" {...props} />;
const FiAnchor = (props) => <IconPlaceholder name="Anchor" {...props} />;

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

// --- Helper Functions ---
const mapWeather = (val) => {
  // Mapping: Light Rain=0, Cloudy=1, Sunny=2 (dari Agent)
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
      <div className="flex w-full h-4 rounded-lg overflow-hidden border border-gray-700">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-full flex-1 transition-colors duration-300
              ${index < completedSteps ? "bg-purple-600" : "bg-gray-800"}
              ${index < steps.length - 1 ? "border-r border-black border-opacity-30" : ""}
            `}
          ></div>
        ))}
      </div>

      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="w-1/3 text-center px-1">
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

const InputData = ({ onDataProcessed }) => {
  const AI_PROCESS_URL = "http://localhost:8000/predict_and_recommend";
  const userRole = "Main";
  // --- PERUBAHAN DI SINI: Membatasi opsi cuaca menjadi 3 ---
  const WEATHER_OPTIONS = [
    // Catatan: Nilai 'Light Rain' tetap dipertahankan karena ini adalah nilai yang diprediksi Agent (0) untuk cuaca buruk.
    { value: "Sunny", label: "Sunny (Cerah)" },
    { value: "Cloudy", label: "Cloudy (Berawan)" },
    { value: "Light Rain", label: "Rainy (Hujan)" },
  ];

  const initialMinePlannerState = {
    productionVolume: 80,
    truckCount: 10,
    excavatorCount: 2,
    operatorCount: 15,
    weatherCondition: "Sunny",
  };

  const [formData, setFormData] = useState(initialMinePlannerState);
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
  }, []);

  const handleInputChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    const {
      productionVolume,
      truckCount,
      excavatorCount,
      operatorCount,
      weatherCondition,
    } = formData;
    if (
      !productionVolume ||
      !truckCount ||
      !excavatorCount ||
      !operatorCount ||
      !weatherCondition
    ) {
      setLoading(false);
      setStatusMessage("❌ Semua 5 input utama harus diisi.");
      return;
    }

    const query = `Saya ingin target ${productionVolume} ton. Saat ini pakai ${truckCount} Truk, ${excavatorCount} Ekskavator, ${operatorCount} Operator, cuaca ${weatherCondition}. Beri 3 rekomendasi!`;
    const payload = { user_id: userId, query: query };

    try {
      const response = await fetch(AI_PROCESS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Simpan form data saat ini untuk riwayat
      localStorage.setItem("current_form_data", JSON.stringify(formData));

      if (!response.ok) {
        let errorDetail = {
          detail: "Gagal mengambil detail error dari server.",
        };
        try {
          const text = await response.text();
          errorDetail = JSON.parse(text);
        } catch (e) {
          errorDetail.detail = `Respon server: ${response.statusText}`;
        }
        throw new Error(
          `API Error: ${response.status} - ${errorDetail.detail || "Terjadi kesalahan pada server Agent"}`
        );
      }

      const data = await response.json();
      onDataProcessed(data);
      setStatusMessage(
        `✅ Data Berhasil Diproses! Target: ${data.target_tonnage} Ton. `
      );
    } catch (error) {
      console.error("Error mengirim data ke AI Agent:", error.message);
      setStatusMessage(`Pesan anda tidak jelas`);
    } finally {
      setLoading(false);
    }
  };

  const renderMinePlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 ">
          <FiTruck className="mr-2" /> Target & Unit
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
        <div
          className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800"
          style={{ visibility: "hidden" }}
        >
          &nbsp;
        </div>
      </div>
    </>
  );

  const renderShippingPlannerInputs = () => (
    <p className="text-white text-center col-span-2">Akses Shipping Planner</p>
  );

  const inputsToRender =
    userRole === "Main"
      ? renderMinePlannerInputs()
      : renderShippingPlannerInputs();

  return (
    <div className="kode-mono min-h-screen p-1 ">
      <header className="text-center mb-7">
        <p className="text-primary mt-2 text-xl">
          {" "}
          Input Data {userRole.toUpperCase()}
        </p>
        <p className="text-gray-400 text-sm">User ID Sesi: {userId}</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="card-input-grid grid md:grid-cols-2 gap-6">
          {inputsToRender}
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
                <FiCheckCircle className="mr-2" /> KIRIM DATA & HITUNG
                REKOMENDASI
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

  // Data yang dikirim saat tombol diklik
  const scenarioData = {
    title: recommendation.title,
    trucks: recommendation.trucks,
    excavators: recommendation.excavators,
    operators: recommendation.operators,
    weather: recommendation.weather,
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
              <MdTruck className="text-xl text-red-400" /> Truk:
            </span>
            <span className="font-semibold text-white">
              {recommendation.trucks} Unit
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
              <MdEngineering className="text-xl text-yellow-400" /> Eskavator:
            </span>
            <span className="font-semibold text-white">
              {recommendation.excavators} Unit
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-1">
              <MdPerson className="text-xl text-blue-400" /> Operator:
            </span>
            <span className="font-semibold text-white">
              {recommendation.operators} Orang
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
      <div className="text-white p-4 text-center  rounded-xl">
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
            Hasil Rekomendasi Optimasi Tonase
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
          {/* --- STATUS METRICS (Mirip dengan mining.html) --- */}
          <h3 className="text-xl font-semibold mb-3 text-purple-400">
            📊 Status Operasional Saat Ini
          </h3>
          <div className="grid grid-cols-3 gap-3 p-3 bg-blue-900/20 border border-blue-600/50 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">Target Produksi</p>
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

          {/* --- ANALISIS --- */}
          <h4 className="text-lg font-semibold mb-2 text-white">
            📝 Analisis Agent:
          </h4>
          <p className="text-sm text-gray-300 mb-6 italic">
            {initial_analysis_text}
          </p>

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

// --- Komponen Riwayat Analisis (BARU) ---

const AnalysisHistoryCard = ({ iteration, apiData }) => {
  // Digunakan untuk menampilkan ringkasan hasil analisis yang lama
  if (!apiData || !apiData.initial_prediction) return null;

  // Asumsi: apiData dari riwayat memiliki skenario awal yang diinput, yang sama dengan konteks saat itu
  const weatherInfo = mapWeather(apiData.weatherCondition || "N/A");

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
          <span>Konfigurasi Digunakan:</span>
          <span className="font-semibold text-purple-300">
            {apiData.truckCount || "N/A"} Truk,{" "}
            {apiData.excavatorCount || "N/A"} Ekskavator
          </span>
        </p>
        <p className="text-gray-400 flex justify-between col-span-2">
          <span>&nbsp;</span>
          <span className="font-semibold text-purple-300">
            {apiData.operatorCount || "N/A"} Operator, {weatherInfo.label}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- Component Utama Tanyakan (Menggantikan AppContainer) ---

// Definisikan langkah-langkah status
const STEPS = {
  INPUT: "Input Data",
  RECOMMENDATION: "Rekomendasi",
  FINALIZATION: "Finalisasi",
};

const Tanyakan = () => {
  const API_BASE = "http://localhost:8000";

  // State untuk melacak langkah aplikasi saat ini
  const [currentStep, setCurrentStep] = useState(STEPS.INPUT);
  // State untuk menyimpan data respons API TERBARU
  const [apiResponseData, setApiResponseData] = useState(null);
  // State BARU untuk menyimpan riwayat analisis yang telah selesai
  const [apiHistory, setApiHistory] = useState([]);

  // State untuk mengontrol buka/tutup panel rekomendasi
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);

  // --- CHAT STATES BARU ---
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handler untuk Tombol Reset/Mulai Ulang Sesi
  const handleResetSession = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin memulai ulang sesi? Semua riwayat dan chat akan dihapus."
      )
    ) {
      // 1. Reset semua state
      setApiResponseData(null);
      setApiHistory([]);
      setChatMessages([]);
      setCurrentStep(STEPS.INPUT);

      // 2. Hapus userId dari localStorage dan buat baru (memaksa sesi baru di Agent)
      localStorage.removeItem("mining_fe_user_id");
      let newId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mining_fe_user_id", newId);
      // (Di aplikasi nyata, Anda juga bisa memanggil DELETE API /end_session/{userId})
    }
  };

  // Fungsi yang dipanggil oleh InputData.jsx setelah berhasil memanggil API
  const handleInputDataProcessed = (data) => {
    // 1. Tambahkan pesan awal ke chat (respon Agent)
    const initialBotMessage = {
      sender: "bot",
      text: `✅ Analisis awal berhasil! Prediksi Tonase saat ini: ${data.initial_prediction} Ton. Silakan tinjau rekomendasi di atas atau ketik pertanyaan lanjutan.`,
      id: Date.now(),
    };
    setChatMessages([initialBotMessage]);

    // 2. Update state utama (Menambahkan data input awal ke apiResponseData untuk Riwayat)
    const currentFormData = JSON.parse(
      localStorage.getItem("current_form_data") || "{}"
    );

    setApiResponseData({
      ...data,
      status: "Calculated",
      // Simpan input user saat itu juga untuk riwayat
      truckCount: currentFormData.truckCount,
      excavatorCount: currentFormData.excavatorCount,
      operatorCount: currentFormData.operatorCount,
      weatherCondition: currentFormData.weatherCondition,
      target_tonnage: currentFormData.productionVolume,
    });
    setApiHistory([]); // Reset riwayat untuk input baru
    setCurrentStep(STEPS.RECOMMENDATION);
    setIsRecommendationOpen(true);
  };

  // Fungsi yang dipanggil saat memilih skenario di RecommendationCard
  const handleScenarioSelection = (scenario) => {
    // 1. Simpan data analisis LAMA ke riwayat sebelum diproses (Data Lama)
    if (apiResponseData) {
      setApiHistory((prev) => [
        ...prev,
        { ...apiResponseData, id: prev.length + 1 },
      ]);
    }

    // 2. Buat query baru untuk Agent (Query yang akan dikirim)
    const query = `Saya memilih skenario "${scenario.title}" dengan konfigurasi Truk: ${scenario.trucks}, Eskavator: ${scenario.excavators}, Operator: ${scenario.operators}, Cuaca: ${scenario.weather}. Bagaimana prediksi finalnya?`;

    // 3. Tambahkan pesan pengguna ke chat
    const userMsg = {
      sender: "user",
      text: `Saya memilih skenario: ${scenario.title}. Prediksi ulang!`,
      id: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // 4. Panggil API Agent ulang
    handleSendChat(query, true, scenario); // Kirim data skenario baru ke handler
  };

  // Fungsi untuk Kirim Chat Teks Bebas / Panggilan API Ulang
  const handleSendChat = async (
    text,
    isSystemGenerated = false,
    newScenario = null
  ) => {
    const queryText = text.trim();
    if (!queryText && !isSystemGenerated) return;

    // Pastikan userId sudah tersedia (diambil dari InputData)
    const userId = localStorage.getItem("mining_fe_user_id");
    if (!userId) {
      alert("Sesi pengguna tidak ditemukan. Silakan mulai dari input data.");
      return;
    }

    // Tambahkan pesan pengguna ke chat jika bukan dari sistem/tombol
    if (!isSystemGenerated) {
      const userMsg = { sender: "user", text: queryText, id: Date.now() };
      setChatMessages((prev) => [...prev, userMsg]);
      setChatMessage(""); // Clear input
    }

    setIsChatLoading(true);

    const payload = { user_id: userId, query: queryText };

    // Tambahkan pesan loading
    const loadingId = Date.now() + 1;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Agent menganalisis...",
        id: loadingId,
        isLoading: true,
      },
    ]);

    try {
      const response = await fetch(`${API_BASE}/predict_and_recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Hapus pesan loading
      setChatMessages((prev) => prev.filter((msg) => msg.id !== loadingId));

      if (!response.ok) {
        let errorDetail = {
          detail: "Gagal mengambil detail error dari server.",
        };
        try {
          const text = await response.text();
          errorDetail = JSON.parse(text);
        } catch (e) {
          errorDetail.detail = `Respon server: ${response.statusText}`;
        }
        throw new Error(
          `API Error: ${response.status} - ${errorDetail.detail || "Terjadi kesalahan pada server Agent"}`
        );
      }

      const data = await response.json();

      // 1. Tambahkan respons utama Agent ke chat
      const botResponseText = `Analisis Agent: ${data.initial_analysis_text} Prediksi Tonase terbaru: ${data.initial_prediction} Ton. Rekomendasi di atas telah diperbarui.`;

      const botMsg = {
        sender: "bot",
        text: botResponseText,
        id: Date.now() + 2,
      };
      setChatMessages((prev) => [...prev, botMsg]);

      // 2. Pindahkan data API LAMA ke Riwayat (jika belum dipindahkan oleh handleScenarioSelection)
      if (!isSystemGenerated && apiResponseData) {
        setApiHistory((prev) => [
          ...prev,
          { ...apiResponseData, id: prev.length + 1 },
        ]);
      }

      // 3. Update data TERBARU, sertakan data skenario yang dipilih (jika ada) untuk dicatat di riwayat berikutnya
      const updatedResponse = {
        ...data,
        status: "Calculated (Revised)",
        // Simpan konfigurasi yang BARU digunakan untuk dicatat di riwayat berikutnya
        truckCount: newScenario?.trucks || apiResponseData?.truckCount,
        excavatorCount:
          newScenario?.excavators || apiResponseData?.excavatorCount,
        operatorCount: newScenario?.operators || apiResponseData?.operatorCount,
        weatherCondition:
          newScenario?.weather || apiResponseData?.weatherCondition,
        target_tonnage: data.target_tonnage, // Pastikan target tetap dari data API
      };
      setApiResponseData(updatedResponse);
    } catch (error) {
      console.error("Error saat mengirim chat ke AI Agent:", error.message);
      const errorMsg = {
        sender: "bot",
        text: `❌ Gagal memproses: ${error.message}. Pastikan Agent FastAPI berjalan di port 8000.`,
        id: Date.now() + 3,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Fungsi untuk simulasi Finalisasi
  const handleFinalize = () => {
    // Pindahkan analisis terakhir ke riwayat sebelum finalisasi
    if (apiResponseData && apiResponseData.status !== "Finalized") {
      setApiHistory((prev) => [
        ...prev,
        { ...apiResponseData, id: prev.length + 1 },
      ]);
    }
    // Set status data API menjadi Finalized
    setApiResponseData((prev) => ({ ...prev, status: "Finalized" }));
    setCurrentStep(STEPS.FINALIZATION);
    alert("Proses Finalisasi Skenario Telah Diselesaikan!");
  };

  // Render konten berdasarkan langkah saat ini
  const renderContent = () => {
    switch (currentStep) {
      case STEPS.INPUT:
        return <InputData onDataProcessed={handleInputDataProcessed} />;
      case STEPS.RECOMMENDATION:
      case STEPS.FINALIZATION:
        return (
          <>
            {/* 1. Riwayat Analisis (Analisis Lama) */}
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

            {/* 2. Rekomendasi TERBARU */}
            <RecommendationDisplay
              apiData={apiResponseData}
              isOpen={isRecommendationOpen}
              setIsOpen={setIsRecommendationOpen}
              onFinalize={handleFinalize}
              onScenarioSelect={handleScenarioSelection} // Tambahkan handler baru
            />

            {/* --- CHAT INTERFACE --- */}
            <div className="mt-5 text-left flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-700 p-4 rounded-xl bg-gray-900">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Diskusi Lanjutan
              </h3>
              <div className="flex-1 space-y-4 mb-4">
                {chatMessages.map((msg) =>
                  msg.sender === "user" ? (
                    <div key={msg.id} className="flex justify-end w-full ">
                      <div className="space-y-1">
                        <p className="text-right text-xs text-gray-400">
                          {" "}
                          Saya
                        </p>
                        <div className="bg-purple-600 px-4 py-3 rounded-xl max-w-xs text-sm">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start w-full">
                      <div>
                        <p className="text-left text-xs text-gray-400">
                          {" "}
                          Bot/Agent
                        </p>{" "}
                        <div
                          className={`px-4 py-3 rounded-xl max-w-xs text-sm ${msg.isLoading ? "bg-gray-600 italic text-gray-300 animate-pulse" : "bg-gray-700"}`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={chatEndRef}></div>
              </div>
            </div>

            {/* Input sticky */}
            <div className="sticky bottom-0 w-full z-10 p-4">
              <div className="max-w-4xl mx-auto flex items-center space-x-2 p-3 rounded-xl">
                <input
                  type="text"
                  placeholder="Ketik pertanyaan lanjutan (misal: 'tambah 1 truk lagi')"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendChat(chatMessage)
                  }
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isChatLoading}
                />
                <button
                  onClick={() => handleSendChat(chatMessage)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-500"
                  disabled={isChatLoading}
                >
                  {isChatLoading ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="text-center text-red-400">
            Status Aplikasi Tidak Dikenali.
          </div>
        );
    }
  };

  // Menggunakan layout bar & tab kustom Anda, tetapi diadaptasi untuk alur 3-langkah
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
