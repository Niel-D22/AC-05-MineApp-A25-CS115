import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HeroMine from "../assets/LogoMine.png";
import { IoNotifications } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import axios from "axios";

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fungsi untuk cek notifikasi
  const checkUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Hitung jumlah yang belum dibaca (is_read === 0)
      const count = response.data.filter((n) => n.is_read === 0).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Gagal cek notifikasi di navbar:", error);
    }
  };

  useEffect(() => {
    // 1. Cek saat pertama kali load
    checkUnreadNotifications();

    // 2. Cek ulang setiap 3 detik (Polling) agar real-time
    // Ini penting agar saat user membaca notif di halaman lain, navbar ikut update
    const interval = setInterval(checkUnreadNotifications, 3000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, []);

 return (
    <div className="backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-10 md:px-20 h-[91px] bg-[#2F2F2F]/80 text-white border-b border-white/10 shadow-lg">
      
      {/* Logo Area */}
      <div className="flex justify-center items-center gap-4">
        <img className="h-10 md:h-12" src={HeroMine} alt="Logo" />
        <h1 className="font-bold text-2xl md:text-3xl tracking-widest text-white drop-shadow-md">
          MATE
        </h1>
      </div>

      {/* Navigation Area */}
      <div>
        <ul className="flex items-center gap-8 md:gap-10">
          
          {/* Menu Biasa */}
          <li>
            <NavLink to="/home" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              Beranda
            </NavLink>
          </li>

          <li>
            <NavLink to="/home/rekomendasi" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              Rekomendasi
            </NavLink>
          </li>

          <li>
            <NavLink to="/home/tanyakan" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              Tanyakan
            </NavLink>
          </li>

          {/* Menu Icon: Notifikasi */}
          <li>
            <NavLink 
              to="/home/notifikasi" 
              className={({ isActive }) => `nav-item flex items-center justify-center ${isActive ? "active" : ""}`}
            >
              <div className="relative p-1"> {/* Bungkus Icon agar badge posisinya pas */}
                <IoNotifications className="text-2xl" />
                
                {/* Badge Notifikasi */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600 border border-[#2F2F2F]"></span>
                  </span>
                )}
              </div>
            </NavLink>
          </li>

          {/* Menu Icon: Profil */}
          <li>
            <NavLink to="/home/profile" className={({ isActive }) => `nav-item flex items-center justify-center ${isActive ? "active" : ""}`}>
              <FaUserLarge className="text-xl" />
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Navbar;