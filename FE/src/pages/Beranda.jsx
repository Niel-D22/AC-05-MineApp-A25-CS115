import React from "react";
import Hero from "../component/Beranda/Hero";
import LatestRecomendation from "../component/Beranda/LatestRecomendation";

const Beranda = () => {
  return (
    <>
      <div className="px-25 flex flex-col justify-center text-white gap-y-10">
        <Hero />
        <LatestRecomendation />
      </div>
    </>
  );
};

export default Beranda;
