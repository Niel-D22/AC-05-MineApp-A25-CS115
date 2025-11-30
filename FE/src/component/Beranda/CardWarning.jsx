import React from "react";
import Awan from "../../assets/awan.png";

const CardWarning = () => {
  return (
    <div
      // 1. Tambahkan 'relative' agar div ini menjadi patokan (parent)
      className="relative flex text-[20px] max-w-[1340px] h-[157px] bg-card/50 border border-stroke backdrop-blur-md rounded-[20px] space-y-2 p-7 overflow-hidden"
    >
      {/* Kontainer Teks - Pastikan teks tidak tumpang tindih dengan gambar */}
      <div className="z-10 w-4/5 flex flex-col justify-center">
        <h1 className="text-[30px] font-h1 ">
          <span className="text-font ">Safety warning </span> due to weather
          today
        </h1>
        <div className="p-1">
          <p className="font-p">
            Limit the maximum speed of all Haul Trucks in Pit 2 to 20 km/h.{" "}
          </p>
          <p className="font-p">Prioritize Grader G-02 to repair the road on Ramp 3B.</p>
        </div>
      </div>
      {/* Gambar Awan - Diposisikan secara Absolut */}
      <img
        className="absolute right-0 top-1/2 -translate-y-1/2 h-full z-0  pr-10"
        src={Awan}
        alt="Logo Awan"
      />
    </div>
  );
};

export default CardWarning;
