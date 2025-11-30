import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { LuInstagram } from "react-icons/lu";
const Footer = () => {
  return (
    <div
      className=" flex flex-col  text-center pt-8  backdrop-blur-md h-[233px] w-full
     bg-[#2F2F2F]/50  text-white border-t-1 border-stroke"
    >
      {" "}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-h1 text-[20px]">
            We’re always here to help you, whenever and wherever you need us!
          </h1>

          <p className="font-p">If you need anything, contact us below</p>
        </div>
        <div className="flex justify-center gap-6 text-[30px] mt-4">
          <FaFacebook />
          <FaWhatsapp />
          <LuInstagram />
        </div>
        <p className="font-p pt-3">@ 2025 Copyright.</p>
      </div>
    </div>
  );
};

export default Footer;
