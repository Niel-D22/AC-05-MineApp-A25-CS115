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
    <div
      className="backdrop-blur-md sticky top-0 z-50 font-navbar
     flex justify-between items-center px-30 h-[91px]
      bg-[#2F2F2F]/50 text-white border-b-1 border-stroke"
    >
      <div className="flex justify-center items-center gap-6">
        <img className="h-13" src={HeroMine} alt="" />
        <h1 className="font-[OctopusGame] text-white text-4xl logoGlow">
          MATE
        </h1>
      </div>
      <div>
        <ul className="flex">
          <li className="space-x-10 flex items-center nav-link">
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              Beranda
            </NavLink>

            <NavLink
              to="/home/rekomendasi"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              Rekomendasi
            </NavLink>

            <NavLink
              to="/home/tanyakan"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              Tanyakan
            </NavLink>

            {/* --- BAGIAN NOTIFIKASI DENGAN BADGE --- */}
            <NavLink
              to="/home/notifikasi"
              className={({ isActive }) =>
                `nav-item relative ${isActive ? "active" : ""}`
              }
            >
              <div className="relative">
                <IoNotifications className="text-2xl" />
                
                {/* Tampilkan Badge jika ada notifikasi belum dibaca */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    {/* Efek Ping (Animasi Berdenyut) */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AA14F0] opacity-75"></span>
                    {/* Lingkaran Utama */}
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#AA14F0]"></span>
                  </span>
                )}
              </div>
            </NavLink>
            {/* --------------------------------------- */}

            <NavLink
              to="/home/profile"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <FaUserLarge className="text-2xl" />
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;