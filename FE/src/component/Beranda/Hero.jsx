import React from "react";
import ImgHero from "../../assets/Ai.png";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  function GoToTanyakan() {
    navigate("tanyakan");
  }

  return (
    <div className="card flex gap-60">
      <div className=" flex flex-col justify-center space-y-11">
        <div className="space-y-4 ">
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
          className="rounded-lg btn-prim"
        >
          Ask something
        </button>
      </div>
      <img src={ImgHero} className="min-h-fit" />
    </div>
  );
};

export default Hero;
