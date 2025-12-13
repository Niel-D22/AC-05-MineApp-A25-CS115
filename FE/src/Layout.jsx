import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Tambah useLocation
import Navbar from "./component/Navbar"; // Sesuaikan path Navbar Anda
import Footer from "./component/Footer"; // Sesuaikan path Footer Anda
import { AnimatePresence } from "framer-motion"; // Import ini
import BgMain from "./assets/bgMain.png"
const Layout = () => {
  const location = useLocation(); // Dapatkan lokasi saat ini

  return (
       <div 
    className="bg-cover bg-center bg-fixed min-h-screen space-y-10"
    style={{ backgroundImage: `url(${BgMain})` }}>
      <Navbar />
      
      {/* Konten Utama */}
      <main className="flex-1 relative">
        {/* mode="wait" artinya: tunggu halaman lama hilang, baru munculkan yg baru */}
        <AnimatePresence mode="wait">
          {/* Key sangat PENTING: Agar React tahu halaman berubah */}
          <div key={location.pathname}>
             <Outlet />
          </div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;