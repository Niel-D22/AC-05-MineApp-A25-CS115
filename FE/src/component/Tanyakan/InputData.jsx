import React, { useState } from "react";
// PERBAIKAN: Mengubah path ke tingkat yang lebih tinggi (Path ini disamakan dengan konteks sebelumnya)
import { UseAuth } from "../../context/AuthContext";
// Menghapus FiUser karena tidak digunakan dan mungkin tidak terinstal
import {
  FiCheckCircle,
  FiCloud,
  FiTruck,
  FiTool,
  FiClock,
  FiAnchor,
} from "react-icons/fi";
import axios from "axios";

// URL backend untuk mengirim data ke AI (Ganti sesuai endpoint Anda)
const AI_PROCESS_URL = "http://localhost:3000/api/ai/process-data";

// Daftar pilihan kondisi cuaca
const WEATHER_OPTIONS = [
  { value: "clear", label: "Cerah/Clear Sky" },
  { value: "cloudy", label: "Berawan/Mendung" },
  { value: "light_rain", label: "Hujan Ringan" },
  { value: "heavy_rain", label: "Hujan Lebat" },
  { value: "fog", label: "Berkabut Tebal" },
  { value: "storm", label: "Badai/Angin Kencang" },
];

const InputData = () => {
  // Ambil role dan token dari AuthContext
  const { userRole, token } = UseAuth();

  const [formData, setFormData] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    const payload = {
      role: userRole,
      data: formData,
    };

    try {
      // Kirim data ke backend untuk diproses AI
      const response = await axios.post(AI_PROCESS_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("AI Response:", response.data);
      setStatusMessage(`✅ Data Berhasil Dikirim! Rekomendasi siap diproses.`);
    } catch (error) {
      console.error("Error mengirim data ke BE:", error);
      setStatusMessage(
        ` Gagal: ${error.response?.data?.message || "Koneksi ke backend gagal."}`
      );
    } finally {
      setLoading(false);
    }
  };

  //Main planner input
  const renderMinePlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white mb-2 ">
          <FiTruck className="mr-2" /> Produksi & Unit
        </div>

        {/* 1. Production Volume */}
        <InputCard
          label="Production Volume"
          name="productionVolume"
          unit="MT"
          value={formData.productionVolume}
          onChange={handleInputChange}
        />

        {/* 2. Truck count */}
        <InputCard
          label="Truck Count (Aktif)"
          name="truckCount"
          unit="Unit"
          value={formData.truckCount}
          onChange={handleInputChange}
        />

        {/* 3. Excavator count */}
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
          <FiTool className="mr-2" /> Waktu & SDM
        </div>

        {/* 4. Operator count */}
        <InputCard
          label="Operator Count (On Shift)"
          name="operatorCount"
          unit="Orang"
          value={formData.operatorCount}
          onChange={handleInputChange}
        />

        {/* 5. Mining time */}
        <InputCard
          label="Mining Time (Jam Efektif)"
          name="miningTime"
          unit="Jam"
          value={formData.miningTime}
          onChange={handleInputChange}
        />

        {/* 6. Weather (Kondisi Cuaca) */}
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

  // shipping planner input
  const renderShippingPlannerInputs = () => (
    <>
      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white">
          <FiAnchor className="mr-2" /> Logistik Kapal
        </div>

        {/* 1. Shipping volume */}
        <InputCard
          label="Shipping Volume (Target)"
          name="shippingVolume"
          unit="MT"
          value={formData.shippingVolume}
          onChange={handleInputChange}
        />

        {/* 2. Stock */}
        <InputCard
          label="Stock Batubara (MT Tersedia)"
          name="stockVolume"
          unit="MT"
          value={formData.stockVolume}
          onChange={handleInputChange}
        />

        {/* 3. Transport capacity */}
        <InputCard
          label="Transport Capacity (MT/Hari)"
          name="transportCapacity"
          unit="MT"
          value={formData.transportCapacity}
          onChange={handleInputChange}
        />
      </div>

      <div className="input-group text-left col-span-1">
        <div className="group-title flex items-center text-white">
          <FiClock className="mr-2" /> Operasi & Cuaca
        </div>

        {/* 4. Loading time */}
        <InputCard
          label="Loading Time (Jam/Kapal)"
          name="loadingTime"
          unit="Jam"
          value={formData.loadingTime}
          onChange={handleInputChange}
        />

        {/* 5. Weather (Kecepatan Angin) */}
        <InputCard
          label="Kecepatan Angin (km/jam)"
          name="weatherWindSpeed"
          unit="km/j"
          value={formData.weatherWindSpeed}
          onChange={handleInputChange}
        />

        {/* 6. Weather (Kondisi Cuaca) */}
        <SelectCard
          label="Kondisi Cuaca Pelabuhan"
          name="weatherConditionShipping"
          value={formData.weatherConditionShipping}
          onChange={handleInputChange}
          options={WEATHER_OPTIONS}
        />
      </div>
    </>
  );

  // Tentukan input mana yang akan di-render berdasarkan Role dari JWT
  const inputsToRender =
    userRole === "Main" ? (
      renderMinePlannerInputs()
    ) : userRole === "Shipping" ? (
      renderShippingPlannerInputs()
    ) : (
      <p className="text-white text-center col-span-2">
        Akses Dibatasi. Silakan Login dengan Role yang Valid.
      </p>
    );

  if (!userRole) {
    return (
      <div className="p-10 text-white text-center">
        Akses ditolak. Silakan Login.
      </div>
    );
  }

  return (
    <div className="kode-mono min-h-screen p-1 ">
      <header className="text-center mb-7">
        <h1 className="text-3xl text-white font-bold">M.A.T.E.</h1>
        <p className="text-primary mt-2 text-xl">
          {" "}
          Input Data {userRole.toUpperCase()}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Grid Container Utama: Diatur menjadi 2 kolom untuk tampilan yang ringkas */}
        <div className="card-input-grid grid md:grid-cols-2 gap-6">
          {inputsToRender}
        </div>

        <div className="text-center mt-10">
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white rounded-lg font-bold hover:bg-purple-700 transition duration-200 shadow-lg disabled:bg-gray-500 flex items-center justify-center mx-auto"
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

// --- Komponen Pembantu Input Card (Tetap untuk Input Numerik) ---
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
        className="w-full bg-[#404040] text-white p-2 rounded-l-md border-r-0 focus:ring-2 focus:ring-primary focus:border-primary border-gray-600 outline-none"
      />
      <span className="bg-[#404040] text-gray-400 p-2 rounded-r-md text-sm border-l border-gray-600">
        {unit}
      </span>
    </div>
  </div>
);

// --- Komponen Pembantu Select Card (BARU untuk Input Pilihan) ---
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
        className="w-full bg-[#404040] text-white p-2 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-primary border-gray-600 outline-none pr-8"
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
      {/* Ikon panah kustom untuk Select Box */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FiCloud className="text-gray-400" />
      </div>
    </div>
  </div>
);

export default InputData;
