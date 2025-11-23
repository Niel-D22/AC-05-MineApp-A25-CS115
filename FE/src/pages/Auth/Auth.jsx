import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect } from "react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  return (
    <div
      className={`kode-mono min-h-screen flex items-center justify-center bg-black transition-opacity duration-700 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-[800px] h-[500px] bg-[#0f0f0f] rounded-xl shadow-xl overflow-hidden border bo">
        {/* LOGIN FORM */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          <input
            className="mb-4 p-3 rounded bg-white/90"
            placeholder="Username"
          />

          {/* PASSWORD LOGIN */}
          <div className="relative mb-4">
            <input
              className="w-full p-3 rounded bg-white/90 pr-12"
              placeholder="Password"
              type={showLoginPass ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-black"
              onClick={() => setShowLoginPass(!showLoginPass)}
            >
              {showLoginPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button className="w-full p-3 bg-primary hover:bg-font text-white rounded">
            Login
          </button>
        </div>

        {/* REGISTER FORM */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>

          <input
            className="mb-4 p-3 rounded bg-white/90"
            placeholder="Full Name"
          />
          <input className="mb-4 p-3 rounded bg-white/90" placeholder="Email" />

          {/* PASSWORD REGISTER */}
          <div className="relative mb-4">
            <input
              className="w-full p-3 rounded bg-white/90 pr-12"
              type={showRegPass ? "text" : "password"}
              placeholder="Password"
            />

            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-black"
              onClick={() => setShowRegPass(!showRegPass)}
            >
              {showRegPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button className="w-full p-3 bg-primary hover:bg-font text-white rounded">
            Create Account
          </button>
        </div>

        {/* SLIDING PANEL */}
        <div
          className={`absolute top-0 w-1/2 h-full bg-primary text-white flex flex-col items-center justify-center transition-all duration-500 ${
            isSignUp ? "right-1/2" : "right-0"
          }`}
        >
          <h1 className="text-[60px] font-[OctopusGame] tracking-widest">
            MATE
          </h1>

          <p className="mb-6">
            {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}
          </p>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="px-6 py-2 bg-white text-purple-700 rounded font-bold hover:bg-gray-100"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
