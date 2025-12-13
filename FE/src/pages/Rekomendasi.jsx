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
    <div className="px-3 sm:px-4 md:px-6 pb-20">
      <div className="max-w-6xl text-white mx-auto mb-1 text-center">
        <h2 className="mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-2">
          Beberapa rekomendasi terbaik pada setiap summary plan sebelumnya
        </h2>

        <div className="items-center justify-center w-full mx-auto text-xs sm:text-sm text-gray-400 space-y-3">
          {/* bar */}
          <div className="flex-1 h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-500 absolute top-0"
              style={{
                width: "50%",
                left: page === "rekomendasi" ? "0" : "50%",
              }}
            ></div>
          </div>

          {/* tabs */}
          <div className="flex justify-between px-2">
            <button
              onClick={() => changePage("rekomendasi")}
              className={`mr-2 sm:mr-4 transition-all hover:scale-110 duration-200 ${
                page === "rekomendasi"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p hover:cursor-pointer text-xs sm:text-sm">Rekomendasi</p>
            </button>

            <button
              onClick={() => changePage("summary")}
              className={`ml-2 sm:ml-4 transition-all hover:scale-110 duration-200 ${
                page === "summary"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p hover:cursor-pointer text-xs sm:text-sm">Summary Plan</p>
            </button>
          </div>
        </div>

        {/* SLIDE ANIMATION */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
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