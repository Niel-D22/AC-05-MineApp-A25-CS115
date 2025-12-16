import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HeroMine from "../assets/LogoMine.png";
import { IoNotifications, IoMenu, IoClose } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import axios from "axios";

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const count = response.data.filter((n) => n.is_read === 0).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Gagal cek notifikasi di navbar:", error);
    }
  };

  useEffect(() => {
    checkUnreadNotifications();
    const interval = setInterval(checkUnreadNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="backdrop-blur-md sticky top-0 z-50 font-navbar
      bg-[#2F2F2F]/90 lg:bg-[#2F2F2F]/50 text-white border-b border-stroke transition-all duration-300"
    >
      {/* UPDATE 1: Tinggi Navbar dibuat responsive bertingkat 
         (h-16 di HP, h-20 di Tablet, h-24 di Desktop)
      */}
      <div className="flex justify-between items-center px-6 lg:px-20 h-16 sm:h-20 lg:h-24 transition-all duration-300">
        
        {/* LOGO & JUDUL */}
        <div className="flex justify-center items-center gap-3 lg:gap-5">
          {/* UPDATE 2: Ukuran Logo (Gambar) membesar sesuai layar
             (h-8 -> h-10 -> h-12 -> h-14) + Transisi Halus
          */}
          <img 
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain transition-all duration-300 ease-in-out" 
            src={HeroMine} 
            alt="Logo" 
          />
          
          {/* UPDATE 3: Ukuran Font Judul membesar sesuai layar
             (text-xl -> 2xl -> 3xl -> 4xl) + Transisi Halus
          */}
          <h1 className="font-[OctopusGame] text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl logoGlow transition-all duration-300 ease-in-out">
            MATE
          </h1>
        </div>

        {/* TOMBOL HAMBURGER (Tetap hidden di LG) */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-3xl focus:outline-none transition-transform duration-300 hover:scale-110"
          >
            {isMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* MENU UTAMA DENGAN ANIMASI SMOOTH 
            
            Penjelasan Class Animasi:
            1. absolute top-[100%]: Posisi menu mobile tepat di bawah navbar.
            2. transition-all duration-500 ease-in-out: Membuat efek gerak halus.
            3. overflow-hidden: Agar konten terpotong rapi saat menutup.
            4. max-h-0 vs max-h-screen: Teknik animasi tinggi (buka/tutup).
            5. opacity-0 vs opacity-100: Teknik animasi transparansi.
            
            LG (Desktop) Override:
            Di layar lg, kita reset semua properti mobile (static, max-h-full, opacity-100, dll)
        */}
        <div
          className={`
            absolute lg:static top-full left-0 w-full lg:w-auto 
            bg-[#2F2F2F] lg:bg-transparent 
            border-b lg:border-none border-stroke lg:shadow-none shadow-2xl
            flex flex-col lg:flex-row lg:items-center
            overflow-hidden lg:overflow-visible
            transition-all duration-500 ease-in-out
            ${isMenuOpen ? "max-h-screen opacity-100 py-6 lg:py-0" : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100 lg:py-0"}
          `}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 px-6 lg:px-0 w-full">
            
            {/* LINK: BERANDA */}
            <li>
              <NavLink
                to="/home"
                end
                onClick={closeMenu}
                className={({ isActive }) => `nav-item text-sm sm:text-base lg:text-lg ${isActive ? "active" : ""}`}
              >
                Beranda
              </NavLink>
            </li>

            {/* LINK: REKOMENDASI */}
            <li>
              <NavLink
                to="/home/rekomendasi"
                onClick={closeMenu}
                className={({ isActive }) => `nav-item text-sm sm:text-base lg:text-lg ${isActive ? "active" : ""}`}
              >
                Rekomendasi
              </NavLink>
            </li>

            {/* LINK: TANYAKAN */}
            <li>
              <NavLink
                to="/home/tanyakan"
                onClick={closeMenu}
                className={({ isActive }) => `nav-item text-sm sm:text-base lg:text-lg ${isActive ? "active" : ""}`}
              >
                Tanyakan
              </NavLink>
            </li>

            {/* NOTIFIKASI & PROFIL */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 mt-2 lg:mt-0">
              
              {/* NOTIFIKASI */}
              <li>
                <NavLink
                  to="/home/notifikasi"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-item relative flex items-center text-sm sm:text-base lg:text-lg ${isActive ? "active" : ""}`
                  }
                >
                  <div className="relative">
                    <IoNotifications className="text-xl sm:text-2xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AA14F0] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#AA14F0]"></span>
                      </span>
                    )}
                  </div>
                  <span className="lg:hidden ml-3">Notifikasi</span>
                </NavLink>
              </li>

              {/* PROFIL */}
              <li>
                <NavLink
                  to="/home/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-item flex items-center text-sm sm:text-base lg:text-lg ${isActive ? "active" : ""}`
                  }
                >
                  <FaUserLarge className="text-xl sm:text-2xl" />
                  <span className="lg:hidden ml-3">Profil Saya</span>
                </NavLink>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;