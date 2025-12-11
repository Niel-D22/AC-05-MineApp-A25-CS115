import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BgBlur from "../../assets/BgBlur.png";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Tambah: Import useNavigate
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

  // Tambah: Hook Context dan Router
  const navigate = useNavigate();
  const { login } = UseAuth();
  // Akhir Tambahan

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

  // 2. FUNGSI UNTUK MENGIRIM PERMINTAAN LOGIN KE BACKEND
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
      // END GANTI
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
      className={`kode-mono min-h-screen flex items-center justify-center h-screen bg-cover bg-center transition-opacity duration-500${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${BgBlur})` }}
    >
      <div className="relative w-[800px] h-[500px] bg-[#0f0f0f] rounded-xl shadow-xl overflow-hidden border bo">
        {/* LOGIN FORM */}
        <form // Ganti div menjadi form dan tambahkan onSubmit
          className={`absolute top-0 left-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
          onSubmit={handleLogin} // Panggil fungsi handleLogin saat form di-submit
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {/* INPUT USERNAME */}
          <input
            className="mb-4 p-3 rounded bg-white/90"
            placeholder="Username"
            name="username" // Tambahkan name
            value={loginData.username}
            onChange={handleLoginChange} // Tambahkan onChange handler
          />

          {/* PASSWORD LOGIN */}
          <div className="relative mb-4">
            <input
              className="w-full p-3 rounded bg-white/90 pr-12"
              placeholder="Password"
              name="password" // Tambahkan name
              value={loginData.password}
              onChange={handleLoginChange} // Tambahkan onChange handler
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

          {/* Menampilkan pesan error */}
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          <button
            className="w-full p-3 bg-primary hover:bg-font text-white rounded disabled:bg-gray-500"
            type="submit" // Pastikan type submit
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* REGISTER FORM (TIDAK ADA PERUBAHAN) */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-500 ${
            isSignUp
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
          {/* ... input dan button register lainnya ... */}
          <input
            className="mb-4 p-3 rounded bg-white/90"
            placeholder="Full Name"
          />
          <input className="mb-4 p-3 rounded bg-white/90" placeholder="Email" />
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

        {/* SLIDING PANEL (TIDAK ADA PERUBAHAN) */}
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
