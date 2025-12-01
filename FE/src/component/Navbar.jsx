import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import HeroMine from "../assets/LogoMine.png";
import { IoNotifications } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import Logout from "./Logout";

const Navbar = () => {
  return (
    <div
      className=" backdrop-blur-md sticky top-0 z-50 font-navbar
     flex justify-between items-center px-30 h-[91px]
      bg-[#2F2F2F]/50  text-white border-b-1 border-stroke"
    >
      <div className="flex justify-center items-center gap-6">
        <img className="h-13" src={HeroMine} alt="" />
        <h1 className="font-[OctopusGame] text-white text-4xl logoGlow">
          MATE
        </h1>
      </div>
      <div>
        <ul className="flex ">
          <li className="space-x-10 flex items-center">
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

            {/* icon */}
            <NavLink
              to="/home/notifikasi"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <IoNotifications className="text-2xl" />
            </NavLink>

            <NavLink
              to="/home/profile"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <FaUserLarge className="text-2xl" />
            </NavLink>
            <Logout/>
            {/* icon */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
