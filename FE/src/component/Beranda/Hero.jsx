import React from "react";
import ImgHero from "../../assets/Ai.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  function GoToTanyakan() {
    navigate("tanyakan");
  }

  return (
    <div className="card flex flex-col-reverse md:flex-row items-center gap-10 md:gap-10 lg:gap-60">
      
      {/* Bagian Teks */}
      {/* Tambahkan flex-1 agar teks mengambil sisa ruang yang tersedia */}
      <div className="flex-1 flex flex-col justify-center space-y-6 md:space-y-11 text-center md:text-left w-full items-center md:items-start">
        <div className="space-y-4">
          <h1 className="heading-1">
            This is <span className="text-font">your AI Assistant.</span>
          </h1>
          <p className="body-text">
            Designed to help you out with some recomendations, analysis, data,
            etc.
          </p>
        </div>
        
        <button
          onClick={GoToTanyakan}
          className="rounded-lg btn-prim w-fit"
        >
          Ask something
        </button>
      </div>

      {/* Bagian Gambar */}
      {/* PERBAIKAN DI SINI:
          1. w-[200px]: Mobile tetap 200px.
          2. md:w-[300px] atau md:max-w-[40%]: Di Tablet dibatasi agar masuk container.
          3. lg:w-auto: Di Desktop layar lebar baru ukurannya bebas/auto.
      */}
      <div className="flex-shrink-0"> 
        <img 
          src={ImgHero} 
          className="w-[200px] md:w-[350px] lg:w-auto lg:max-w-[500px] object-contain" 
          alt="Hero AI"
        />
      </div>
    </div>
  );
};

export default Hero;