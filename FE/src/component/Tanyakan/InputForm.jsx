import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiCloud, FiTruck, FiTool, FiAnchor } from "./Icons";

// --- Input Components ---
const InputCard = ({ label, name, unit, value, onChange }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label htmlFor={name} className="text-sm text-gray-400 block mb-1 font-sans">{label}</label>
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
      <span className="bg-[#404040] text-gray-400 p-2 rounded-r-md text-sm border-l border-gray-600">{unit}</span>
    </div>
  </div>
);

const SelectCard = ({ label, name, value, onChange, options }) => (
  <div className="bg-[#2d2d2d] p-4 rounded-lg shadow-md mb-4 border border-purple-800">
    <label htmlFor={name} className="text-sm text-gray-400 block mb-1 font-sans">{label}</label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required
        className="w-full bg-[#404040] text-white p-2 rounded-md appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-600 outline-none pr-8"
      >
        <option value="" disabled>-- Pilih Kondisi --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FiCloud className="text-gray-400" />
      </div>
    </div>
  </div>
);

const InputData = ({ onDataProcessed, userRole }) => {
const API_BASE_URL = "http://127.0.0.1:8000"
  const WEATHER_OPTIONS = [
    { value: "Sunny", label: "Sunny (Cerah)" },
    { value: "Cloudy", label: "Cloudy (Berawan)" },
    { value: "Light Rain", label: "Rainy (Hujan)" },
  ];

  const initialMinePlannerState = { productionVolume: 80, truckCount: 10, excavatorCount: 2, operatorCount: 15, weatherCondition: "Sunny" };
  const initialShippingPlannerState = { shippingTarget: 100, stock: 120, transportCapacity: 10, loadingTime: 8, weatherCondition: "Sunny" };

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
        const { shippingTarget, stock, transportCapacity, loadingTime, weatherCondition } = formData;
        if (!shippingTarget || !stock || !transportCapacity || !loadingTime || !weatherCondition) {
             setLoading(false); setStatusMessage("❌ Semua input shipping harus diisi."); return;
        }
        const query = `Target shipping saya ${shippingTarget} ton. Saya punya Stock ${stock}, Kapasitas Transport ${transportCapacity}, Loading Time ${loadingTime} jam, Cuaca ${weatherCondition}. Beri 3 rekomendasi!`;
        payload = { user_id: userId, query: query };
        endpoint = `${API_BASE_URL}/predict_shipping`;
    } else {
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

      localStorage.setItem("current_form_data", JSON.stringify(formData));

      if (!response.ok) {
        let errorDetail = { detail: "Gagal mengambil detail error." };
        try { const text = await response.text(); errorDetail = JSON.parse(text); } catch (e) {}
        throw new Error(`API Error: ${response.status} - ${errorDetail.detail || "Server Error"}`);
      }

      const data = await response.json();
      onDataProcessed(data);
      setStatusMessage(`✅ Data Berhasil Diproses! Target: ${data.target_tonnage} Ton.`);
    } catch (error) {
      console.error("Error mengirim data ke AI Agent:", error.message);
      setStatusMessage(`Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderMinePlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 "><FiTruck className="mr-2" /> Target & Unit (Mining)</div>
        <InputCard label="Target Produksi Harian (Ton)" name="productionVolume" unit="Ton" value={formData.productionVolume} onChange={handleInputChange} />
        <InputCard label="Truck Count (Aktif)" name="truckCount" unit="Unit" value={formData.truckCount} onChange={handleInputChange} />
        <InputCard label="Excavator Count (Aktif)" name="excavatorCount" unit="Unit" value={formData.excavatorCount} onChange={handleInputChange} />
      </div>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2"><FiTool className="mr-2" /> SDM & Lingkungan</div>
        <InputCard label="Operator Count (On Shift)" name="operatorCount" unit="Orang" value={formData.operatorCount} onChange={handleInputChange} />
        <SelectCard label="Kondisi Cuaca Area Tambang" name="weatherCondition" value={formData.weatherCondition} onChange={handleInputChange} options={WEATHER_OPTIONS} />
      </div>
    </>
  );

  const renderShippingPlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 "><FiAnchor className="mr-2" /> Target & Logistik (Shipping)</div>
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
        <p className="note">User ID Sesi: {userId}</p>
      </header>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="card-input-grid grid md:grid-cols-2 gap-6">
          {isShippingRole ? renderShippingPlannerInputs() : renderMinePlannerInputs()}
        </div>
        <div className="text-center mt-10">
          <button type="submit" className="px-10 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition duration-200 shadow-lg disabled:bg-gray-500 flex items-center justify-center mx-auto" disabled={loading}>
            {loading ? "Mengirim..." : <><FiCheckCircle className="mr-2" /> KIRIM DATA & HITUNG REKOMENDASI</>}
          </button>
          {statusMessage && <p className={`mt-4 text-sm ${statusMessage.startsWith("✅") ? "text-green-400" : "text-yellow-400"}`}>{statusMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default InputData;