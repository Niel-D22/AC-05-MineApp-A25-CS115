import React, { useState } from "react";
import CardRekomendasi from "../component/Rekomendasi/CardRekomendasi";
import SummaryPlan from "../component/Rekomendasi/SummaryPlan";

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
    <div>
      <div className="max-w-6xl text-white mx-auto mb-1 text-center">
        <h2 className="heading-2 mb-6">
          Beberapa rekomendasi terbaik pada setiap summary plan sebelumnya
        </h2>

        <div className="items-center justify-center w-full mx-auto text-sm text-gray-400 space-y-3">
          {/* bar */}
          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-500 absolute top-0"
              style={{
                width: "50%",
                left: page === "rekomendasi" ? "0" : "50%",
              }}
            ></div>
          </div>

          {/* tabs */}
          <div className="flex justify-between">
            <button
              onClick={() => changePage("rekomendasi")}
              className={`mr-4 transition-all hover:scale-120 duration-200 ${
                page === "rekomendasi"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p hover:cursor-pointer">Rekomendasi</p>
            </button>

            <button
              onClick={() => changePage("summary")}
              className={`ml-4 transition-all hover:scale-120 duration-200 ${
                page === "summary"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p hover:cursor-pointer"> Summary Plan</p>
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
  );
};

export default Rekomendasi;
