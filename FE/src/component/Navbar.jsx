import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HeroMine from "../assets/LogoMine.png";
import { IoNotifications, IoMenu, IoClose } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import axios from "axios";

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* ===== NOTIFICATION CHECK ===== */
  const checkUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        "http://localhost:3000/api/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(res.data.filter((n) => n.is_read === 0).length);
    } catch (err) {
      console.error("Notif error:", err);
    }
  };

  useEffect(() => {
  ;
    const interval = setInterval(checkUnreadNotifications, 3000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header
        className={`
          sticky top-0 z-50 w-full transition-all duration-300
          ${scrolled
            ? "bg-[#1a1a1a]/40 backdrop-blur-md border-b border-white/10 shadow-xl"
            : "bg-transparent"
          }
        `}
      >
        <div className="flex items-center justify-between h-[72px] md:h-[91px] px-4 sm:px-8 md:px-20 text-white">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img src={HeroMine} alt="Logo" className="h-9 md:h-12" />
            <h1 className="font-bold text-xl md:text-3xl tracking-widest font-[OctopusGame]">
              MATE
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <NavLink to="/home" end className="nav-item">
                Beranda
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/rekomendasi" className="nav-item">
                Rekomendasi
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/tanyakan" className="nav-item">
                Tanyakan
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/home/notifikasi"
                className="nav-item flex items-center justify-center"
              >
                <div className="relative">
                  <IoNotifications className="text-2xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-600" />
                    </span>
                  )}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/home/profile"
                className="nav-item flex items-center justify-center"
              >
                <FaUserLarge className="text-xl" />
              </NavLink>
            </li>
          </ul>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            {open ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-64 bg-[#1a1a1a]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <ul className="flex flex-col gap-6 p-6 text-white">
          <li>
            <NavLink to="/home" end className="nav-item" onClick={() => setOpen(false)}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/rekomendasi" className="nav-item" onClick={() => setOpen(false)}>
              Rekomendasi
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/tanyakan" className="nav-item" onClick={() => setOpen(false)}>
              Tanyakan
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/notifikasi" className="nav-item flex items-center gap-2" onClick={() => setOpen(false)}>
              <IoNotifications />
              Notifikasi
              {unreadCount > 0 && (
                <span className="ml-auto text-xs bg-purple-600 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/profile" className="nav-item flex items-center gap-2" onClick={() => setOpen(false)}>
              <FaUserLarge />
              Profil
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Navbar;
