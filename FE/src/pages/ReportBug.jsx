import React, { useState } from "react";
import { 
  MdBugReport, MdSend, MdInfoOutline, MdCheckCircle, MdEmail 
} from "react-icons/md";
// Pastikan path ini sesuai dengan file Toast Anda
import { Toast } from "../component/CostumAlerts"; 
import PageTransition from "../component/PageTransition";

const ReportBug = () => {
  const [formData, setFormData] = useState({
    title: "",
    module: "tanyakan",
    severity: "medium",
    description: "",
    steps: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // --- LOGIKA KIRIM EMAIL ---
  const handleSendEmail = () => {
    const recipient = "danielwarouw01@gmail.com";
    const subject = `[BUG REPORT] ${formData.title} - Severity: ${formData.severity.toUpperCase()}`;
    
    // Format Isi Email
    const body = `
Halo Tim Developer,

Saya ingin melaporkan bug/error dengan detail berikut:

DATA PELAPORAN
------------------------------------------------
📍 Lokasi Error : ${formData.module.toUpperCase()}
🔥 Tingkat Keparahan : ${formData.severity.toUpperCase()}
------------------------------------------------

DESKRIPSI MASALAH:
${formData.description}

LANGKAH KEJADIAN (STEPS):
${formData.steps}

Mohon segera diperbaiki. Terima kasih.
    `;

    // Membuka email client user
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handleSendEmail();
      setToast({ message: "Membuka aplikasi email Anda...", type: "success" });
    }, 1500);
  };

  // --- STYLING ---
  const labelStyle = "small-text";
  const inputStyle = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 !text-sm small-text placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner";

  return (
    <PageTransition>
    <div className="w-full min-h-screen pb-20 animate-fade-in-up text-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* --- HEADER --- */}
        <div className="mb-10 flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <MdBugReport size={32}/>
          </div>
          <div>
            <h1 className="heading-2 tracking-tight">Laporkan Bug</h1>
            <p className="small-text mt-1">
              Temukan error? Kirim laporan langsung ke Developer via Email.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- KOLOM KIRI: FORMULIR --- */}
          <div className="lg:w-2/3">
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Baris 1: Judul & Modul */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>Judul Masalah <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required
                            className={inputStyle}
                            placeholder="Cth: Tombol kirim tidak merespon"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className={labelStyle}>Lokasi Error</label>
                        <div className="relative">
                            <select 
                                className={`${inputStyle} appearance-none cursor-pointer`}
                                value={formData.module}
                                onChange={(e) => setFormData({...formData, module: e.target.value})}
                            >
                                <option value="auth">Halaman Login / Register</option>
                                <option value="beranda">Beranda (Dashboard)</option>
                                <option value="tanyakan">Tanyakan (AI Analysis)</option>
                                <option value="summary">Summary Plan</option>
                                <option value="profile">Profile Pengguna</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                        </div>
                    </div>
                </div>

                {/* Baris 2: Severity Level */}
                <div>
                    <label className={labelStyle}>Seberapa Parah?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 small-text">
                        <SeverityOption label="Low" desc="Typo / UI" color="bg-blue-500" value="low" current={formData.severity} onClick={(v) => setFormData({...formData, severity: v})} />
                        <SeverityOption label="Medium" desc="Fitur Terganggu" color="bg-yellow-500" value="medium" current={formData.severity} onClick={(v) => setFormData({...formData, severity: v})} />
                        <SeverityOption label="High" desc="Fitur Rusak" color="bg-orange-500" value="high" current={formData.severity} onClick={(v) => setFormData({...formData, severity: v})} />
                        <SeverityOption label="Critical" desc="Sistem Down" color="bg-red-600" value="critical" current={formData.severity} onClick={(v) => setFormData({...formData, severity: v})} />
                    </div>
                </div>

                {/* Baris 3: Deskripsi */}
                <div>
                  <label className={labelStyle}>Detail Masalah <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows="5"
                    className={`${inputStyle} resize-none leading-relaxed`}
                    placeholder="Jelaskan secara detail apa yang terjadi. Jika ada pesan error (misal: Error 500), mohon di-copy paste ke sini..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                {/* Baris 4: Steps */}
                <div>
                  <label className={labelStyle}>Langkah Kejadian (Opsional)</label>
                  <textarea 
                    rows="3"
                    className={`${inputStyle} resize-none font-mono text-xs`}
                    placeholder={`1. Saya buka halaman X\n2. Klik tombol Y\n3. Muncul error Z...`}
                    value={formData.steps}
                    onChange={(e) => setFormData({...formData, steps: e.target.value})}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold shadow-lg shadow-red-900/20 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-wait w-full md:w-auto justify-center font-btn text-[length:var(--size-btn)] 
                    rounded-[20px] 
                    transition-all duration-200 
                    hover:scale-105
                    hover:cursor-pointer
                    disabled:scale-none
                    max-w-fit py-2 px-6"
                  >
                    {loading ? (
                        <span className="flex items-center gap-2">Memproses...</span>
                    ) : (
                        <>
                            <span>Kirim Laporan via Email</span>
                            <MdSend /> 
                        </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* --- KOLOM KANAN: SIDEBAR --- */}
          <div className="lg:w-1/3 space-y-6">
            
            {/* Widget Tips */}
            <div className="card border-none p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="!text-blue-400 font-bold mb-4 flex items-center gap-2 body-text uppercase tracking-wide">
                    <MdInfoOutline/> Tips Laporan
                </h3>
                <ul className="space-y-4 text-sm small-text">
                    <li className="flex gap-3 items-start">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>Jelaskan <strong>apa yang Anda lakukan</strong> sebelum error muncul.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>Salin <strong>Pesan Error</strong> jika ada.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>Jika punya screenshot, silakan lampirkan langsung di aplikasi Email Anda setelah tombol kirim ditekan.</span>
                    </li>
                </ul>
            </div>

            {/* Widget Kontak Developer */}
            <div className="card p-6">
                <p className="small-text tracking-widest mb-4">Kontak Developer</p>
                <a href="mailto:danielwarouw01@gmail.com" className="flex items-center gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-white/5 transition group">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition">
                        <MdEmail size={20} />
                    </div>
                    <div>
                        <p className="small-text mb-0.5">Email Support</p>
                        <p className="body-text !text-sm !group-hover:text-red-400 transition break-all">danielwarouw01@gmail.com</p>
                    </div>
                </a>
            </div>

          </div>

        </div>
      </div>
    </div>
    </PageTransition>
  );
};

// --- Sub-Komponen Pilihan Severity ---
const SeverityOption = ({ label, desc, color, value, current, onClick }) => {
    const isSelected = current === value;
    const borderColor = color.replace('bg-', 'border-'); 
    
    return (
        <div 
            onClick={() => onClick(value)}
            className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 relative ${
                isSelected 
                ? `${borderColor} bg-white/5 shadow-lg scale-[1.02]` 
                : "border-transparent bg-[#121212] hover:bg-white/5 hover:border-white/10"
            }`}
        >
            {isSelected && <div className="absolute top-2 right-2 text-white text-[10px]"><MdCheckCircle/></div>}
            <div className={`w-8 h-1.5 rounded-full ${color} mb-2 opacity-90`}></div>
            <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{label}</p>
            <p className="text-[9px] text-gray-600 leading-tight mt-1 font-medium">{desc}</p>
        </div>
    );
};

export default ReportBug;