import React from "react";
import { MdDocumentScanner } from "react-icons/md";
import { MdContactSupport, MdFeedback } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div
      // PERBAIKAN RESPONSIVE:
      // 1. px-4: Agar teks tidak menempel pinggir layar HP.
      // 2. min-h-[233px] h-auto: Tinggi minimal tetap 233px (sesuai desain asli), tapi bisa memanjang (auto) jika layar sempit.
      // 3. pb-8: Jarak bawah agar tidak terlalu mepet saat mode mobile.
      className="flex flex-col text-center pt-8 pb-8 px-4 backdrop-blur-md min-h-[233px] h-auto w-full bg-[#2F2F2F]/50 text-white border-t border-stroke"
    >
      <div className="flex flex-col gap-3">
        <div>
          {/* Teks tetap 20px, aman karena sudah ada px-4 di container induk */}
          <h1 className="font-h1 text-[20px]">
            We’re always here to help you, whenever and wherever you need us!
          </h1>

          <p className="font-p">If you need anything, contact us below</p>
        </div>
        
        {/* Icon tetap sama */}
        <div className="flex justify-center gap-6 text-[30px] mt-4">
          <Link to="docs"><MdDocumentScanner /></Link>
          <Link to="support"><MdContactSupport /></Link>
          <Link to="feedback"><MdFeedback /></Link>
        </div>
        
        <p className="font-p pt-3">@ 2025 Copyright.</p>
      </div>
    </div>
  );
};

export default Footer;