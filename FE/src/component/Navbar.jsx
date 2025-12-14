import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HeroMine from "../assets/LogoMine.png";
import { IoNotifications, IoMenu, IoClose } from "react-icons/io5"; // Tambah Icon Menu
import { FaUserLarge } from "react-icons/fa6";
import axios from "axios";

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk toggle menu mobile

  // Fungsi untuk cek notifikasi
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

  // Helper untuk menutup menu saat link diklik (UX mobile)
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="backdrop-blur-md sticky top-0 z-50 font-navbar
      bg-[#2F2F2F]/90 md:bg-[#2F2F2F]/50 text-white border-b border-stroke"
    >
      <div className="flex justify-between items-center px-6 md:px-30 h-[70px] md:h-[91px]">
        {/* LOGO */}
        <div className="flex justify-center items-center gap-3 md:gap-6">
          <img className="h-10 md:h-13" src={HeroMine} alt="Logo" />
          <h1 className="font-[OctopusGame] text-white text-2xl md:text-4xl logoGlow">
            MATE
          </h1>
        </div>

        {/* TOMBOL HAMBURGER (Hanya muncul di Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-3xl focus:outline-none"
          >
            {isMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* MENU UTAMA (Desktop: Row, Mobile: Hidden/Column) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-[70px] left-0 w-full md:w-auto bg-[#2F2F2F] md:bg-transparent border-b md:border-none border-stroke md:items-center`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 p-6 md:p-0">
            {/* LINK: BERANDA */}
            <li>
              <NavLink
                to="/home"
                end
                onClick={closeMenu}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Beranda
              </NavLink>
            </li>

            {/* LINK: REKOMENDASI */}
            <li>
              <NavLink
                to="/home/rekomendasi"
                onClick={closeMenu}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Rekomendasi
              </NavLink>
            </li>

            {/* LINK: TANYAKAN */}
            <li>
              <NavLink
                to="/home/tanyakan"
                onClick={closeMenu}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                Tanyakan
              </NavLink>
            </li>

            {/* LINK: NOTIFIKASI & PROFIL (Mobile: Sejajar / Desktop: Tetap) */}
            <div className="flex items-center gap-6 md:gap-10 mt-2 md:mt-0">
              {/* NOTIFIKASI */}
              <li>
                <NavLink
                  to="/home/notifikasi"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-item relative flex items-center ${isActive ? "active" : ""}`
                  }
                >
                  <div className="relative">
                    <IoNotifications className="text-2xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AA14F0] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#AA14F0]"></span>
                      </span>
                    )}
                  </div>
                  {/* Teks label hanya untuk mobile agar jelas */}
                  <span className="md:hidden ml-3">Notifikasi</span>
                </NavLink>
              </li>

              {/* PROFIL */}
              <li>
                <NavLink
                  to="/home/profile"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-item flex items-center ${isActive ? "active" : ""}`
                  }
                >
                  <FaUserLarge className="text-2xl" />
                  <span className="md:hidden ml-3">Profil Saya</span>
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