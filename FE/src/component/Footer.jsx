import React from "react";
import { Link } from "react-router-dom"; // 1. IMPORT LINK
import { 
  MdSupportAgent, MdMenuBook, MdBugReport, MdSecurity, MdCircle 
} from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full bg-[#2F2F2F]/80 border-t border-white/5 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* --- LEFT: APP INFO & VERSION --- */}
          <div className="flex flex-col md:items-start items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wide">
                MainApp
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Internal Use
            </p>
          </div>

          {/* --- CENTER: UTILITY LINKS (Support & Docs) --- */}
          <div className="flex gap-6">
            {/* 2. GUNAKAN LINK DENGAN PATH ABSOLUT (/home/...) */}
            <InternalLink 
              icon={<MdMenuBook />} 
              text="User Guide" 
              href="/home/docs" 
            />
            <InternalLink 
              icon={<MdSupportAgent />} 
              text="IT Support" 
              href="/home/support" // Asumsi ada route ini, atau biarkan #
            />
            <InternalLink 
              icon={<MdBugReport />} 
              text="Report Bug" 
              href="/home/feedback" // Asumsi ada route ini, atau biarkan #
            />
          </div>

          {/* --- RIGHT: SYSTEM STATUS --- */}
          <div className="flex flex-col md:items-end items-center gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/5">
              <MdCircle className="text-[10px] text-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-300">
                System Operational
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <MdSecurity className="text-gray-500"/>
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

// --- Komponen Link Sederhana (UPDATED) ---
const InternalLink = ({ icon, text, href }) => (
  <Link 
    to={href} // Ganti 'href' menjadi 'to'
    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
  >
    <span className="text-lg group-hover:text-purple-400 transition-colors">{icon}</span>
    <span className="group-hover:underline decoration-purple-500/50 underline-offset-4">
      {text}
    </span>
  </Link>
);

export default Footer;