import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
fadeOut
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <h1 className="font-[OctopusGame] text-white text-7xl logoGlow">
        MATE
      </h1>
    </div>
  );
}
