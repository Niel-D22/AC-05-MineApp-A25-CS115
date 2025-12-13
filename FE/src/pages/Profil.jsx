import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "../component/Logout";

// Import Icons
import { MdPerson, MdWork, MdVerifiedUser, MdEmail } from "react-icons/md";

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

  // --- Helper: Get Initials for Avatar ---
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // --- Helper: Role Color Config ---
  const roleConfig = {
    Main: {
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      label: "Main Planner",
    },
    Shipping: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      label: "Shipping Planner",
    },
  };

  const currentRoleStyle = roleConfig[userRole] || roleConfig.Main;

  // --- Tampilan Loading (Skeleton) ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gray-700 h-24 w-24"></div>
          <div className="h-4 bg-gray-700 rounded w-48"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-400 bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
          ⚠️ {error}
        </div>
      </div>
    );

  if (!profileData) return null;

return (
    // Tambahkan px-4 agar ada jarak di HP
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in-up"> 
      
      {/* Gunakan w-full dengan max-w-lg agar bagus di tablet/desktop */}
      <div className="relative w-full max-w-md md:max-w-lg bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Background */}
        <div className={`absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r ${userRole === 'Shipping' ? 'from-blue-900 to-slate-900' : 'from-purple-900 to-slate-900'} opacity-50`}></div>

        <div className="relative pt-8 pb-8 px-6 md:px-8 flex flex-col items-center">
          
          {/* Avatar - Ukuran responsif */}
          <div className="relative mb-4">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-xl border-4 border-[#1e1e1e] bg-gradient-to-br ${userRole === 'Shipping' ? 'from-blue-500 to-cyan-400' : 'from-purple-500 to-pink-500'}`}>
              {getInitials(profileData.name)}
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-[#1e1e1e]" title="Active"></div>
          </div>

          {/* Name & Role */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center break-words max-w-full">
            {profileData.name}
          </h2>
          
          <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase border ${currentRoleStyle.bg} ${currentRoleStyle.color} ${currentRoleStyle.border} flex items-center gap-1.5`}>
            <MdVerifiedUser className="text-sm" />
            {userRole} Planner
          </div>

          <div className="w-full h-px bg-white/10 my-6"></div>

          {/* Detail Grid */}
          <div className="w-full space-y-3 md:space-y-4">
            {/* ... (Isi detail sama, styling flex sudah cukup responsif) ... */}
             <div className="flex items-center p-3 md:p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="p-2 bg-gray-800 rounded-lg mr-3 md:mr-4 text-gray-400">
                <MdPerson size={20} className="md:text-xl" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold">Nama Pengguna</p>
                <p className="text-sm md:text-base text-white font-medium truncate">{profileData.name}</p>
              </div>
            </div>
            {/* ... (Jabatan row sama logicnya) ... */}
          </div>

          <div className="w-full mt-6 md:mt-8">
            <Logout /> 
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profil;