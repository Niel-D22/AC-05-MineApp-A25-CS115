import React, { useState } from "react";
import {
  FiLogOut,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { UseAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = UseAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div
        className="text-red-500 hover:text-red-700 cursor-pointer p-2 transition duration-200 flex items-center"
        onClick={() => setShowConfirm(true)}
        title="Logout"
      >
        <FiLogOut size={24} className="mr-2" />
        <span className="hidden md:inline body-text !text-red-500 !hover:text-red-700 cursor-pointer">
          Logout
        </span>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 h-screen p-4">
          {/* Konten Modal */}
          <div 
            className="bg-gray-800 rounded-lg shadow-2xl border border-primary transform transition-all duration-300 scale-100 opacity-100
            w-[90%] sm:w-full max-w-sm p-6 md:p-8" // PERBAIKAN: Lebar responsive & padding responsive
          >
            <div className="text-center mb-6">
              <FiAlertTriangle
                size={40}
                className="text-red-500 mx-auto mb-3"
              />
              <h3 className="text-lg md:text-xl font-h1 text-white mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-sm md:text-base text-gray-400 font-p">
                Apakah Anda yakin ingin keluar dari sistem M.A.T.E.?
              </p>
            </div>

       
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 md:gap-4 mt-4">
              {/* Tombol Batal */}
              <button
                className="flex items-center justify-center w-full py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-150 text-sm md:text-base font-medium"
                onClick={() => setShowConfirm(false)}
              >
                <FiXCircle className="mr-2" />
                Batal
              </button>

              <button
                className="flex items-center justify-center w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 text-sm md:text-base font-medium"
                onClick={handleConfirmLogout}
              >
                <FiCheckCircle className="mr-2" />
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;