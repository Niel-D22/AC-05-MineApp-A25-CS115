import React from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdCheckCircleOutline, MdTruck, MdEngineering, MdPerson, MdWbSunny, MdWarning, MdInventory, MdAccessTime } from "./Icons"; // Pastikan path icons benar
import { FiTruck } from "./Icons"; // Pastikan path icons benar

// --- Helper Functions ---
const mapWeather = (val) => {
  if (val == 0 || val === "0" || val === "Light Rain") return { label: "Light Rain (Hujan)", icon: <MdWarning className="text-yellow-500" /> };
  if (val == 1 || val === "1" || val === "Cloudy") return { label: "Cloudy (Berawan)", icon: <MdWbSunny className="text-gray-400" /> };
  if (val == 2 || val === "2" || val === "Sunny") return { label: "Sunny (Cerah)", icon: <MdWbSunny className="text-yellow-500" /> };
  return { label: val, icon: <MdWbSunny className="text-white" /> };
};

const RecommendationCard = ({ recommendation, index, onScenarioSelect }) => {
  const weatherInfo = mapWeather(recommendation.weather);
  const differenceColor = recommendation.difference_from_target < 1.0 ? "text-green-400" : "text-yellow-400";
  const isShipping = 'stock' in recommendation;

  const param1 = { label: isShipping ? "Stock" : "Truk", value: isShipping ? recommendation.stock : recommendation.trucks, unit: isShipping ? "Ton" : "Unit", icon: isShipping ? <MdInventory className="text-xl text-red-400" /> : <MdTruck className="text-xl text-red-400" /> };
  const param2 = { label: isShipping ? "Kapasitas Transport" : "Eskavator", value: isShipping ? recommendation.transport_capacity : recommendation.excavators, unit: isShipping ? "Ton" : "Unit", icon: isShipping ? <FiTruck className="text-xl text-yellow-400" /> : <MdEngineering className="text-xl text-yellow-400" /> };
  const param3 = { label: isShipping ? "Waktu Loading" : "Operator", value: isShipping ? recommendation.loading_time : recommendation.operators, unit: isShipping ? "Jam" : "Orang", icon: isShipping ? <MdAccessTime className="text-xl text-blue-400" /> : <MdPerson className="text-xl text-blue-400" /> };

  const scenarioData = {
    title: recommendation.title,
    weather: recommendation.weather,
    trucks: recommendation.trucks, excavators: recommendation.excavators, operators: recommendation.operators,
    stock: recommendation.stock, transport_capacity: recommendation.transport_capacity, loading_time: recommendation.loading_time
  };

  return (
    <div className="card !border-gray-600 !px-4 min-w-[280px] max-w-xs flex flex-col justify-between">
      <div>
        <h4 className="heading-2 !text-font mb-2 border-b border-gray-700 pb-2">#{index + 1}: {recommendation.title}</h4>
        <div className="space-y-1 text-sm mb-4">
          <p className="flex justify-between items-center small-text"><span className="flex items-center gap-1">{param1.icon} {param1.label}:</span><span className="font-semibold text-white">{param1.value} {param1.unit}</span></p>
          <p className="flex justify-between items-center small-text"><span className="flex items-center gap-1">{param2.icon} {param2.label}:</span><span className="font-semibold text-white">{param2.value} {param2.unit}</span></p>
          <p className="flex justify-between items-center small-text"><span className="flex items-center gap-1">{param3.icon} {param3.label}:</span><span className="font-semibold text-white">{param3.value} {param3.unit}</span></p>
          <p className="flex justify-between items-center small-text"><span className="flex items-center gap-1">{weatherInfo.icon} Cuaca:</span><span className="font-semibold text-white">{weatherInfo.label}</span></p>
        </div>
        <p className="text-md font-bold mt-3 border-t border-gray-700 pt-2 items-center"><span className="note">📈 Output: </span><span className="note !text-white">{recommendation.predicted_tonnage} Ton</span></p>
        <p className="text-xs font-medium mt-1"><span className="note">Gap dari Target: </span><span className={differenceColor}>{recommendation.difference_from_target} Ton</span></p>
        <p className="small-text mt-4">Alasan: "{recommendation.rationale}"</p>
      </div>
      <button className="mt-4 !min-w-full btn-prim  transition flex items-center justify-center gap-2" onClick={() => onScenarioSelect(scenarioData)}>Pilih Skenario Ini</button>
    </div>
  );
};

// 👇 PERHATIKAN: Saya menambahkan kata 'export' di sini agar bisa di-import di file lain
export const AnalysisHistoryCard = ({ iteration, apiData }) => {
  if (!apiData || !apiData.initial_prediction) return null;
  const weatherInfo = mapWeather(apiData.weatherCondition || "N/A");
  const isShipping = apiData.stock !== undefined; 

  return (
    <div className="w-full text-left card !border-none !py-6 !px-4 mb-4">
      <h4 className="note mb-2 border-b border-gray-700 pb-2">Riwayat Analisis #{iteration} (Iterasi Lama)</h4>
      <p className="small-text mb-3">{apiData.initial_analysis_text.substring(0, 100)}...</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <p className="note !text-xs flex justify-end gap-x-4 items-center"><span>Target:</span> <span className="small-text">{apiData.target_tonnage || "N/A"} Ton</span></p>
        <p className="note !text-xs flex justify-end gap-x-4 items-center"><span>Hasil Prediksi:</span> <span className="body-text !text-xs !text-red-500">{apiData.initial_prediction} Ton</span></p>
        <p className="note !text-xs flex justify-end gap-x-4 items-center"><span>Konfigurasi:</span><span className="small-text">{isShipping ? `Stock: ${apiData.stock}, Trans: ${apiData.transportCapacity}` : `${apiData.truckCount} Truk, ${apiData.excavatorCount} Ekskavator`}</span></p>
        <p className="note !text-xs flex justify-end gap-x-4 items-center"><span>&nbsp;</span><span className="small-text">{isShipping ? `Loading: ${apiData.loadingTime} Jam, ${weatherInfo.label}` : `${apiData.operatorCount} Operator, ${weatherInfo.label}`}</span></p>
      </div>
    </div>
  );
};

const RecommendationDisplay = ({ apiData, isOpen, setIsOpen, onFinalize, onScenarioSelect }) => {
  const hasData = apiData && apiData.recommendations && apiData.recommendations.length > 0;
  if (!hasData) return <div className="text-white p-4 text-center rounded-xl">Menunggu input data dan hasil dari Agent API...</div>;

  const { target_tonnage, initial_prediction, initial_difference, initial_analysis_text, recommendations } = apiData;
  const isFinalized = apiData.status === "Finalized";
  const isSend = isFinalized ? "Sudah Terkirim" : "Kirim dan Finalisasi"
  const statusText = isFinalized ? "Telah Difinalisasi" : "Berhasil Dihitung";
  const statusColor = isFinalized ? "text-green-400" : "text-yellow-400";

  return (
    <div className="w-full text-white text-left">
      <div className="p-0 rounded-xl">
        <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center card !py-6 !px-4 border-purple-500 rounded-xl hover:bg-gray-600 hover:cursor-pointer transition">
          <span className="heading-2">Hasil Rekomendasi Optimasi</span>
          {isOpen ? <MdOutlineKeyboardArrowUp className="text-3xl text-purple-400" /> : <MdOutlineKeyboardArrowDown className="text-3xl text-purple-400" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${isOpen ? "max-h-[3000px] opacity-100 p-6" : "max-h-0 opacity-0 p-0"} bg-card/50 border border-t-0 border-[#EEEEEE] rounded-b-xl`}>
          <h3 className="heading-2 mb-4  border-t border-gray-700 pt-4">💡 Opsi Rekomendasi (Optimasi Sumber Daya)</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {recommendations.map((item, index) => <RecommendationCard key={index} recommendation={item} index={index} onScenarioSelect={onScenarioSelect} />)}
          </div>  
          <h4 className="mb-2 body-text">📝 Analisis Agent:</h4>
          <p className="my-4 note !text-gray-400">{initial_analysis_text}</p>
          <h3 className="heading-2 mb-4">📊 Status Operasional Saat Ini</h3>
          <div className="grid grid-cols-3 gap-3 card !border-gray-600 !py-6 !px-4 rounded-lg mb-6">
            <div className="text-center"><p className="small-text">Target</p><p className="body-text">{target_tonnage} Ton</p></div>
            <div className="text-center"><p className="small-text">Prediksi Saat Ini</p><p className="body-text !text-yellow-400">{initial_prediction} Ton</p></div>
            <div className="text-center"><p className="small-text">Gap (Kekurangan)</p><p className="body-text !text-red-500">{initial_difference} Ton</p></div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4">
            <p className="note mb-4">Pilih salah satu skenario di atas atau klik 'Finalisasi dan Kirim' jika Anda puas.</p>
            <div className="flex justify-between items-center">
              <p className="body-text">Status : <span className={`font-bold ${statusColor}`}>{statusText}</span></p>
              <button onClick={onFinalize} className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${isFinalized ? "btn-disabled" : "btn-prim"}`}>{isSend} <MdCheckCircleOutline className="text-xl" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDisplay;