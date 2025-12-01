import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Tambahkan jika belum ada

const Profil = () => {
  const { userRole, token, logout } = UseAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3000/api/profile";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
        setError("Gagal memuat data profil.");
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          logout();
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, logout, navigate]);

  // --- Tampilan Loading dan Error (Tetap sama) ---
  if (loading) return <div className="p-4 text-white">Memuat profil...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profileData)
    return <div className="p-4 text-yellow-500">Silakan login.</div>;


  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4 border-b pb-2 text-primary">
        Akses Akun
      </h2>

      <div className="space-y-4">
        <p className="text-lg">
          <strong>Username:</strong>{" "}
          <span className="text-yellow-400">{profileData.name}</span>
        </p>
        <p className="text-lg">
          <strong>Role:</strong>{" "}
          <span className="text-purple-400">{userRole} Planner</span>
        </p>

        {/* --- Tampilan Spesifik Berdasarkan Role (Diambil dari Backend) --- */}

        {userRole === "Main" && (
          <div className="bg-purple-900/40 p-3 rounded mt-4 border border-purple-700">
          
            <p>
              <strong>Jabatan:</strong> {profileData.jabatan}
            </p>
          </div>
        )}

        {userRole === "Shipping" && (
          <div className="bg-blue-900/40 p-3 rounded mt-4 border border-blue-700">
            <p>
              <strong>Jabatan:</strong> {profileData.jabatan} 
            </p>
          </div>
        )}
      </div>

    
    </div>
  );
};

export default Profil;
