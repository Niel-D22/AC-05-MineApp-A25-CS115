// StatusBarSegmented.jsx
import React from 'react';

// Definisikan langkah-langkah
const steps = [
  'Rekomendasi',
  'Menunggu',
  'Review',
  'Selesai',
];


const completedSteps = 1;

const StepBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg- ">
      {/* 1. Progress Bar Container Utama (Segmen) */}
      <div className="flex w-full h-4 rounded-lg overflow-hidden border border-gray-700">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-full flex-1 transition-colors duration-300
              ${
                index < completedSteps
                  ? 'bg-purple-600' // Warna ungu untuk langkah yang sudah selesai
                  : 'bg-gray-800'  // Warna abu-abu gelap untuk langkah yang belum
              }
              // Tambahkan garis pemisah di antara segmen (kecuali yang terakhir)
              ${
                index < steps.length - 1
                  ? 'border-r border-black border-opacity-30' // Border vertikal tipis
                  : ''
              }
            `}
          >
            {/* Segmen kosong, warna diatur berdasarkan status */}
          </div>
        ))}
      </div>

      {/* 2. Status Teks/Label Langkah */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={index}
           
            className="w-1/4 text-center px-1"
          >
            <p
              className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                index < completedSteps
                  ? 'text-purple-400' // Teks ungu untuk langkah yang sudah dilewati
                  : 'text-gray-500'  // Teks abu-abu untuk langkah yang belum
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

export default StepBar;