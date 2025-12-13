import React from "react";
import Hero from "../component/Beranda/Hero";
import LatestRecomendation from "../component/Beranda/LatestRecomendation";
import PageTransition from "../component/PageTransition";

const Beranda = () => {
  return (
    <PageTransition>
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col gap-y-8 md:gap-y-12 pt-4 md:pt-6">
        <Hero />
        <LatestRecomendation />
      </div>
    </div>
    </PageTransition>
  );
};

export default Beranda;