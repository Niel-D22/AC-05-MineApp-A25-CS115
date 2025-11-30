import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" sticky top-0 z-50 kode-mono flex justify-between items-center px-30 h-[91px] bg-black text-white">
      <h1 className="text-3xl  ">LOGO</h1>
      <div>
        <ul className="flex space-x-24">
          <li>
            <NavLink
              to="/home"
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
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
