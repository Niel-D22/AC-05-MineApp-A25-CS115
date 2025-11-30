import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BgBlur from "../../assets/BgBlur.png";

export default function AnimasiMasuk() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true); // mulai fade out
      setTimeout(() => {
        navigate("/auth");
      }, 400); // durasi fade-out
    }, 3000);
  }, []);
  fadeOut;
  return (
    <div
      className={`h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: `url(${BgBlur})` }}
    >
      <h1 className="font-[OctopusGame] text-white text-7xl logoGlow">MATE</h1>
    </div>
  );
}
