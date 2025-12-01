import React from "react";
import InputData from "../component/Tanyakan/InputData";
import { useState } from "react";
import TanyakanAi from "../component/Tanyakan/TanyakanAi";

const Tanyakan = () => {
  const [page, setPage] = useState("InputData");
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
      <div className="max-w-6xl text-white mx-auto  text-center">
        <div className="items-center justify-center w-120 mx-auto text-sm text-gray-400 space-y-3">
          {/* bar */}
          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-purple-400 transition-all duration-500 absolute top-0"
              style={{
                width: "50%",
                left: page === "InputData" ? "0" : "50%",
              }}
            ></div>
          </div>

          {/* tabs */}
          <div className="flex justify-between">
            <button
              onClick={() => changePage("InputData")}
              className={`mr-4 transition-all hover:scale-105 duration-200 ${
                page === "InputData"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p">Input Data</p>
            </button>

            <button
              onClick={() => changePage("Tanyakan")}
              className={`ml-4 transition-all hover:scale-105 duration-200 ${
                page === "informasi"
                  ? "text-font scale-110"
                  : "text-gray-400 scale-100"
              }`}
            >
              <p className="font-p">Tanyakan</p>
            </button>
          </div>
        </div>

        {/* SLIDE ANIMATION */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            slide ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
          }`}
        >
          {page === "InputData" && <InputData />}
          {page === "Tanyakan" && <TanyakanAi />}
        </div>
      </div>
    </div>
  );
};

export default Tanyakan;
