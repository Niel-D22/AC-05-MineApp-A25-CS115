import React from "react";
import ImgHero from "../../assets/Ai.png";
import { useNavigate } from "react-router-dom";
import { MdAutoAwesome } from "react-icons/md";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-gradient-to-r from-[#1E1E1E] to-[#121212] shadow-2xl">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-5 sm:px-8 md:px-12 py-10 md:py-0 min-h-[360px] md:min-h-[400px]">
        
        {/* TEXT */}
        <div className="flex flex-col justify-center gap-6 max-w-lg z-10 text-center md:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mx-auto md:mx-0">
              <MdAutoAwesome className="text-yellow-400 text-sm" />
              <span className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
                AI Powered Assistant
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Optimize your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Mining & Shipping
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              Dapatkan rekomendasi cerdas dan prediksi tonase secara presisi.
            </p>
          </div>

          <button
            onClick={() => navigate("tanyakan")}
            className="mx-auto md:mx-0 w-fit px-8 py-3 rounded-xl bg-primary hover:bg-purple-700 text-white font-bold shadow-lg transition-all active:scale-95"
          >
            Mulai Analisis
          </button>
        </div>

        {/* IMAGE */}
        <div className="relative z-10 flex justify-center md:justify-end w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src={ImgHero}
            className="max-h-[240px] sm:max-h-[300px] md:max-h-[400px] object-contain drop-shadow-2xl"
            alt="AI Assistant"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
