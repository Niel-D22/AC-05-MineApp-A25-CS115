import React from "react";
import Hero from "../component/Beranda/Hero";
import CardWarning from "../component/Beranda/CardWarning";
import TornadoCard from "../assets/TornadoCard.png";

const Beranda = () => {
  const recommendations = [
    {
      id: 1,
      title: "Rainy Day",
      desc: "We suggest you postpone all activities.",
    },
    {
      id: 2,
      title: "Cloudy Afternoon",
      desc: "Light outdoor activities are still fine.",
    },
    {
      id: 3,
      title: "Sunny Morning",
      desc: "Good time to go outside.",
    },
    {
      id: 4,
      title: "Windy Weather",
      desc: "Be careful if you ride a motorcycle.",
    },
  ];

  return (
    <>
      <div className="px-25 text-white space-y-6">
        <Hero />
        <CardWarning />

        {/* Card rekomendasi beranda scroll */}
        <div className="flex gap-4 overflow-x-scroll overflow-y-hidden no-scrollbar">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="min-w-[483px] h-[334px] bg-card/50 border-1 border-stroke backdrop-blur-md rounded-[20px] p-6 pt-39 flex-shrink-0"
            >
              <img
                className="absolute right-0 top-23 -translate-y-1/2 h-[108PX] z-0 pr-10"
                src={TornadoCard}
                alt="Logo Topan"
              />

              <h1 className="text-[25px] font-h1">
                The weather is <span className="text-font">{item.title}</span>
              </h1>
              <p className="text-[18px] font-p mt-2">{item.desc}</p>
              <p className="text-end font-p underline underline-offset-4 mt-4 cursor-pointer">
                See more...
              </p>
            </div>
          ))}
        </div>
        {/* end Card rekomendasi beranda scroll */}
      </div>
    </>
  );
};

export default Beranda;
