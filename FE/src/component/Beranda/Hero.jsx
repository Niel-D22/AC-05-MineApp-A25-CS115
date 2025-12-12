import React from "react";
import ImgHero from "../../assets/Ai.png";
import { useNavigate } from "react-router-dom";
import { MdAutoAwesome } from "react-icons/md"; // Tambah ikon biar manis

const Hero = () => {
  const navigate = useNavigate();
  function GoToTanyakan() {
    navigate("tanyakan");
  }

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-gradient-to-r from-[#1E1E1E] to-[#121212] shadow-2xl">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-10 md:px-12 md:py-0 min-h-[400px]">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-6 max-w-lg z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                <MdAutoAwesome className="text-yellow-400 text-sm"/>
                <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">AI Powered Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Optimize your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Mining & Shipping
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
              Dapatkan rekomendasi cerdas, analisis prediksi tonase, dan perencanaan logistik yang presisi dalam hitungan detik.
            </p>
          </div>
          
          <button
            onClick={GoToTanyakan}
            className="w-fit px-8 py-3 rounded-xl bg-primary hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Mulai Analisis
          </button>
        </div>

        {/* Right Image */}
        <div className="relative z-10 flex justify-center md:justify-end w-full md:w-1/2">
          {/* Efek visual di belakang gambar */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:hidden"></div>
          <img 
            src={ImgHero} 
            className="max-h-[300px] md:max-h-[400px] object-contain drop-shadow-2xl filter brightness-110" 
            alt="AI Assistant Hero" 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;