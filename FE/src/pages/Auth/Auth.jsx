import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BgBlur from "../../assets/BgBlur.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../context/AuthContext";

const Auth = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();
  const { login } = UseAuth();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        loginData
      );

      const { token, role } = response.data;
      
      localStorage.setItem("token", token); 
      localStorage.setItem("role", role);

      if (login) { 
        login(token, role); 
      }
      navigate("/home", { replace: true });
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Login gagal. Silakan coba lagi."
        );
      } else {
        setError("Koneksi gagal. Pastikan server backend berjalan.");
      }
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`kode-mono min-h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-500 px-4 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${BgBlur})` }}
    >
      <div className="relative w-full max-w-[800px] h-auto md:h-[500px] bg-[#0f0f0f] rounded-xl shadow-xl overflow-hidden border flex flex-col md:flex-row">
        
        {/* LOGIN FORM */}
        <form
          className={`w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "md:-translate-x-full opacity-0 hidden md:flex"
              : "md:translate-x-0 opacity-100"
          }`}
          onSubmit={handleLogin}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Sign In</h2>

          {/* INPUT USERNAME */}
          <input
            className="mb-3 md:mb-4 p-2.5 md:p-3 rounded bg-white/90 text-sm md:text-base"
            placeholder="Username"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
          />

          {/* PASSWORD LOGIN */}
          <div className="relative mb-3 md:mb-4">
            <input
              className="w-full p-2.5 md:p-3 rounded bg-white/90 pr-10 md:pr-12 text-sm md:text-base"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              type={showLoginPass ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 md:right-3 -translate-y-1/2 text-black"
              onClick={() => setShowLoginPass(!showLoginPass)}
            >
              {showLoginPass ? <FiEyeOff size={18} className="md:w-5 md:h-5" /> : <FiEye size={18} className="md:w-5 md:h-5" />}
            </button>
          </div>

          {/* Menampilkan pesan error */}
          {error && (
            <p className="text-red-500 text-xs md:text-sm mb-3 md:mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <button
            className="w-full p-2.5 md:p-3 bg-primary hover:bg-font text-white rounded disabled:bg-gray-500 text-sm md:text-base"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* REGISTER FORM */}
        <div
          className={`w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "md:translate-x-0 opacity-100"
              : "md:translate-x-full opacity-0 hidden md:flex"
          }`}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Sign Up</h2>
          <input
            className="mb-3 md:mb-4 p-2.5 md:p-3 rounded bg-white/90 text-sm md:text-base"
            placeholder="Full Name"
          />
          <input className="mb-3 md:mb-4 p-2.5 md:p-3 rounded bg-white/90 text-sm md:text-base" placeholder="Email" />
          <div className="relative mb-3 md:mb-4">
            <input
              className="w-full p-2.5 md:p-3 rounded bg-white/90 pr-10 md:pr-12 text-sm md:text-base"
              type={showRegPass ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 md:right-3 -translate-y-1/2 text-black"
              onClick={() => setShowRegPass(!showRegPass)}
            >
              {showRegPass ? <FiEyeOff size={18} className="md:w-5 md:h-5" /> : <FiEye size={18} className="md:w-5 md:h-5" />}
            </button>
          </div>
          <button className="w-full p-2.5 md:p-3 bg-primary hover:bg-font text-white rounded text-sm md:text-base">
            Create Account
          </button>
        </div>

        {/* SLIDING PANEL */}
        <div
          className={`w-full md:w-1/2 md:absolute top-0 h-auto md:h-full bg-primary text-white flex flex-col items-center justify-center transition-all duration-500 p-6 md:p-8 ${
            isSignUp ? "md:right-1/2" : "md:right-0"
          }`}
        >
          <h1 className="text-4xl md:text-[60px] font-[OctopusGame] tracking-widest mb-4 md:mb-0">
            MATE
          </h1>
      
        </div>

      </div>
    </div>
  );
};

export default Auth;