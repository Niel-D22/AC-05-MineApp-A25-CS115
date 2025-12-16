import React, { useState } from "react";
import CardRekomendasi from "../component/Rekomendasi/CardRekomendasi";
import SummaryPlan from "../component/Rekomendasi/SummaryPlan";
import PageTransition from "../component/PageTransition";

const Rekomendasi = () => {
  const [page, setPage] = useState("rekomendasi");
  const [slide, setSlide] = useState(false);

  const changePage = (target) => {
    setSlide(true);
    setTimeout(() => {
      setPage(target);
      setSlide(false);
    }, 200);
  };

  return (
    <PageTransition>
      {/* Container luar diberi padding agar tidak nempel layar HP */}
      <div className="min-h-screen w-full px-4 pb-20 pt-4">
        
        <div className="max-w-6xl w-full text-white mx-auto mb-1 text-center">
          {/* Judul dibuat responsive (kecil di HP, besar di Desktop) */}
          <h2 className="heading-2 mb-6 text-xl md:text-3xl px-2">
            Beberapa rekomendasi terbaik pada setiap summary plan sebelumnya
          </h2>

          {/* TAB NAVIGATION AREA */}
          {/* Dibatasi max-w-lg agar bar tidak kepanjangan di desktop */}
          <div className="items-center justify-center w-full max-w-lg mx-auto text-sm text-gray-400 space-y-3 mb-8">
            
            {/* Progress Bar */}
            {/* h-2 di mobile, h-4 di desktop biar lebih manis */}
            <div className="flex-1 h-2 md:h-4 bg-gray-700 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-primary transition-all duration-500 absolute top-0"
                style={{
                  width: "50%",
                  left: page === "rekomendasi" ? "0" : "50%",
                }}
              ></div>
            </div>

            {/* Tombol Tabs */}
            <div className="flex justify-between px-2">
              <button
                onClick={() => changePage("rekomendasi")}
                className={`transition-all hover:scale-110 duration-200 ${
                  page === "rekomendasi"
                    ? "text-font scale-105"
                    : "text-gray-400 scale-100"
                }`}
              >
                <p className="font-p hover:cursor-pointer text-sm md:text-base">Rekomendasi</p>
              </button>

              <button
                onClick={() => changePage("summary")}
                className={`transition-all hover:scale-110 duration-200 ${
                  page === "summary"
                    ? "text-font scale-105"
                    : "text-gray-400 scale-100"
                }`}
              >
                <p className="font-p hover:cursor-pointer text-sm md:text-base">Summary Plan</p>
              </button>
            </div>
          </div>

          {/* SLIDE ANIMATION CONTENT */}
          <div
            className={`transition-all duration-300 overflow-hidden w-full ${
              slide ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
            }`}
          >
            {page === "rekomendasi" && <CardRekomendasi />}
            {page === "summary" && <SummaryPlan />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Rekomendasi;