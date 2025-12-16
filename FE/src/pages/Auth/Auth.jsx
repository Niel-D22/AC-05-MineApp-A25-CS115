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
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();
  const auth = UseAuth();
  const login = auth ? auth.login : null;

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
      className={`kode-mono min-h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-500 p-4 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${BgBlur})` }}
    >
  
      <div className="relative w-full max-w-[800px] md:h-[500px] bg-[#0f0f0f] rounded-xl shadow-xl overflow-hidden border border-gray-700 flex flex-col-reverse md:flex-row">
 
        <form
          className="w-full md:w-1/2 flex-1 md:h-full p-8 md:p-10 flex flex-col justify-center bg-[#0f0f0f] z-10"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          <input
            className="mb-4 p-3 rounded bg-white/90 w-full"
            placeholder="Username"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
          />

          <div className="relative mb-4">
            <input
              className="w-full p-3 rounded bg-white/90 pr-12"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
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

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <button
            className="w-full p-3 bg-primary hover:bg-font text-white rounded disabled:bg-gray-500 transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="flex w-full md:w-1/2 h-[150px] md:h-full bg-primary text-white flex-col items-center justify-center z-20">
      
          <h1 className="text-[40px] md:text-[60px] font-[OctopusGame] tracking-widest">
            MATE
          </h1>
        </div>

      </div>
    </div>
  );
};

export default Auth;