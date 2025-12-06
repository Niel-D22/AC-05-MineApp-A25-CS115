// src/component/Rekomendasi/SummaryPlan.jsx
import React, { useState } from "react";

// DUMMY DATA: Summary Plan yang sudah difinalisasi
const FINALIZED_PLANS = [
  {
    id: "SP-MN-001",
    date: "01 Dec 2025",
    type: "Mining",
    location: "Pit A - West",
    target: "50.000 BCM",
    fleet: "EX-01, EX-02",
    status: "Finalized"
  },
  {
    id: "SP-SH-001",
    date: "01 Dec 2025",
    type: "Shipping",
    location: "Jetty 01",
    target: "8.000 MT",
    fleet: "Barge Leo (300ft)",
    status: "Finalized"
  },
  {
    id: "SP-MN-002",
    date: "30 Nov 2025",
    type: "Mining",
    location: "Pit B - East",
    target: "42.000 BCM",
    fleet: "EX-03",
    status: "Finalized"
  },
  {
    id: "SP-SH-002",
    date: "30 Nov 2025",
    type: "Shipping",
    location: "Jetty 02",
    target: "7.500 MT",
    fleet: "Barge Taurus (300ft)",
    status: "Finalized"
  }
];

const SummaryPlan = () => {
  const [activeTab, setActiveTab] = useState("mining"); // 'mining' or 'shipping'

  // Filter data sesuai tab yang dipilih
  const filteredData = FINALIZED_PLANS.filter(
    (item) => item.type.toLowerCase() === activeTab
  );

  return (
    <div className="w-full animate-fade-in-up">
      {/* 1. Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-style-h2 text-white">Finalized Summary Plan</h2>
          <p className="text-style-note text-gray-400 mt-1">
            Data rencana kerja yang telah disetujui dan difinalisasi.
          </p>
        </div>

        {/* Tab Switcher (Mining / Shipping) */}
        <div className="flex bg-[#2F2F2F] p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveTab("mining")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "mining"
                ? "bg-[#AA14F0] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Mining Plan
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "shipping"
                ? "bg-[#AA14F0] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Shipping Plan
          </button>
        </div>
      </div>

      {/* 2. Tabel Data (Card Glass) */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-style-note uppercase tracking-wider">
                <th className="p-4">Plan ID</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Lokasi</th>
                <th className="p-4">Target Utama</th>
                <th className="p-4">Sumber Daya</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-style-body text-white divide-y divide-white/5">
              {filteredData.length > 0 ? (
                filteredData.map((plan) => (
                  <tr key={plan.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-[#AA14F0] font-bold">
                      {plan.id}
                    </td>
                    <td className="p-4 text-gray-300">{plan.date}</td>
                    <td className="p-4">{plan.location}</td>
                    <td className="p-4 font-bold">{plan.target}</td>
                    <td className="p-4 text-gray-300">{plan.fleet}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Tidak ada data summary plan untuk kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryPlan;