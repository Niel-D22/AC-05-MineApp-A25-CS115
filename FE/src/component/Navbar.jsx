import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom"


const Navbar = () => {

    
  return (
    <div className=" sticky top-0 z-50 kode-mono flex justify-between items-center px-30 h-[91px] bg-black text-white">
      <h1 className="text-3xl  ">LOGO</h1>
      <div>
        <ul className="flex gap-30">
        <li>
  <NavLink
    to="/"
    className={({ isActive }) =>
      `nav-item ${isActive ? "active" : ""}`
    }
  >
    Beranda
  </NavLink>
</li>

<li>
  <NavLink
    to="/Rekomendasi"
    className={({ isActive }) =>
      `nav-item ${isActive ? "active" : ""}`
    }
  >
    Rekomendasi
  </NavLink>
</li>

<li>
  <NavLink
    to="/Tanyakan"
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
