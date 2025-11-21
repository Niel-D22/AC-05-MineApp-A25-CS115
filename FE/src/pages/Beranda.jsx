import React from "react";

const Beranda = () => {
const recommendations = [
  {
    id: 1,
    title: "Rainy Day",
    desc: "We suggest you postpone all activities."
  },
  {
    id: 2,
    title: "Cloudy Afternoon",
    desc: "Light outdoor activities are still fine."
  },
  {
    id: 3,
    title: "Sunny Morning",
    desc: "Good time to go outside."
  },
  {
    id: 4,
    title: "Windy Weather",
    desc: "Be careful if you ride a motorcycle."
  }
]



  return (
    <>
      <div className="px-25 text-white space-y-6">
        {/* card panjang di awal beranda */}
        <div className="text-[20px] max-w-[1340px] h-[209px] bg-[#2F2F2F] rounded-[20px] space-y-2 p-7">
          <h1 className="text-[30px]">
            <span className="text-[#BC8CF2]">Safety warning </span> due to
            weather today
          </h1>
          <div className="w-180">
            <p className="">
              Limit the maximum speed of all Haul Trucks in Pit 2 to 20 km/h.
            </p>
            <p>Prioritize Grader G-02 to repair the road on Ramp 3B.</p>
          </div>
        </div>
        {/* end card panjang di awal beranda */}

        {/* Card rekomendasi beranda scroll */}
       <div className="flex gap-4 overflow-x-auto no-scrollbar">
  {recommendations.map((item) => (
    <div 
      key={item.id}
      className="min-w-[483px] h-[334px] bg-card rounded-[20px] p-6 pt-39 flex-shrink-0"
    >
      <h1 className="text-[25px]">
        The weather is <span className="text-font">{item.title}</span>
      </h1>
      <p className="text-[18px] mt-2">{item.desc}</p>
      <p className="text-end underline underline-offset-4 mt-4 cursor-pointer">
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
