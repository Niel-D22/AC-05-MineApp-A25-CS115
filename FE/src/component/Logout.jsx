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
      {/* Tombol Utama Logout */}
      <div
        className="text-red-500 hover:text-red-700 cursor-pointer p-2 transition duration-200 flex items-center"
        onClick={() => setShowConfirm(true)}
        title="Logout"
      >
        <FiLogOut size={24} className="mr-2" />
        <span className="hidden md:inline">Logout</span>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-30 flex justify-center items-center z-50 h-screen">
          {/* Konten Modal */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-sm w-full border border-primary transform transition-all duration-300 scale-100 opacity-100">
            <div className="text-center mb-4">
              <FiAlertTriangle
                size={40}
                className="text-red-500 mx-auto mb-3"
              />
              <h3 className="text-xl font-h1 text-white mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-gray-400 font-p">
                Apakah Anda yakin ingin keluar dari sistem M.A.T.E.?
              </p>
            </div>

            <div className="flex justify-around space-x-4 mt-6">
              {/* Tombol Batal */}
              <button
                className="flex items-center justify-center w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-150"
                onClick={() => setShowConfirm(false)}
              >
                <FiXCircle className="mr-2" />
                Batal
              </button>

              {/* Tombol Konfirmasi Logout */}
              <button
                className="flex items-center justify-center w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
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
