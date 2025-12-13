import React, { useState } from "react";
import { 
  MdEmail, MdWhatsapp, MdVpnKey, MdSend, MdInfoOutline, MdFeaturedPlayList, MdHelpOutline
} from "react-icons/md";
// Pastikan path import Toast benar sesuai struktur folder Anda
import { Toast } from "../component/CostumAlerts"; 
import PageTransition from "../component/PageTransition";

const ITSupport = () => {
  // Default kategori diganti ke 'access' karena 'bug' sudah dihapus
  const [formData, setFormData] = useState({ subject: "", category: "access", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // --- LOGIKA KIRIM EMAIL (MAILTO) ---
  const handleSendEmail = () => {
    const recipient = "danielwarouw01@gmail.com";
    const mailSubject = `[IT SUPPORT] ${formData.category.toUpperCase()} - ${formData.subject}`;
    
    // Format Body Email yang Rapi
    const body = `
Halo Tim IT Support,

Saya ingin mengajukan tiket bantuan dengan detail berikut:

DATA TIKET
------------------------------------------------
📂 KATEGORI : ${formData.category.toUpperCase()}
📌 JUDUL    : ${formData.subject}
------------------------------------------------

DETAIL PESAN / PERMINTAAN:
${formData.message}

Mohon bantuannya. Terima kasih.
    `;

    // Membuka Aplikasi Email Default (Gmail/Outlook/dll)
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi loading UI
    setTimeout(() => {
      setLoading(false);
      handleSendEmail(); 
      setToast({ message: "Membuka aplikasi email Anda...", type: "success" });
      
      // Reset form (opsional)
      // setFormData({ subject: "", category: "access", message: "" });
    }, 1500);
  };

  // --- STYLING ---
  const labelStyle = "small-text";
  const inputStyle = "w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 !text-sm small-text placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner";

  return (
    <PageTransition>
    <div className="w-full min-h-screen pb-20 animate-fade-in-up text-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 note tracking-wider mb-4">
            <MdInfoOutline /> Pusat Bantuan Teknis
          </div>
          <h1 className="heading-2 mb-3">
            IT Support Center
          </h1>
          <p className="small-text max-w-xl mx-auto text-sm leading-relaxed">
            Butuh akses khusus, request fitur baru, atau pertanyaan umum? <br/>Tim IT kami siap membantu kebutuhan operasional Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: KONTAK CEPAT --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Kartu Kontak */}
            <div className="card  p-6 ">
              <h3 className="body-text mb-4">
                Kontak Langsung
              </h3>
              
              <div className="space-y-3">
                {/* WhatsApp */}
                <ContactCard 
                  icon={<MdWhatsapp className="text-green-500 text-xl"/>}
                  bgIcon="bg-green-500/10"
                  title="WhatsApp Admin"
                  value="0838-6490-650"
                  link="https://wa.me/628386490650"
                  action="Chat Sekarang"
                />
                
                {/* Email */}
                <ContactCard 
                  icon={<MdEmail className="text-red-500 text-xl"/>}
                  bgIcon="bg-red-500/10"
                  title="Email Support"
                  value="danielwarouw01@..."
                  link="mailto:danielwarouw01@gmail.com"
                  action="Kirim Email"
                />
              </div>
            </div>

            {/* Quick Info Box */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6 text-center">
              <p className="note mb-2">Lupa Password Akun?</p>
              <p className="note !text-xs leading-relaxed my-2">
                Untuk reset password akun korporat, silakan hubungi admin via WhatsApp atau ajukan tiket "Akses Akun".
              </p>
              <a href="https://wa.me/628386490650" target="_blank" rel="noreferrer" className="btn-prim !text-xs transition shadow-lg inline-block">
                Hubungi Admin
              </a>
            </div>
          </div>

          {/* --- KOLOM KANAN: FORM TIKET --- */}
          <div className="lg:col-span-2">
            <div className="card relative overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><MdSend size={20}/></span>
                  <span className="heading-2">Buat Tiket Bantuan</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Subject */}
                  <div>
                    <label className={labelStyle}>Judul Permintaan</label>
                    <input 
                      type="text" 
                      required
                      className={inputStyle}
                      placeholder="Contoh: Permintaan akses data shipping..."
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  {/* Kategori (Bug Dihapus, diganti opsi lain) */}
                  <div>
                    <label className={labelStyle}>Kategori</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 body-text">
                      <RadioOption 
                        label="Akses Akun" 
                        value="access" 
                        icon={<MdVpnKey/>} 
                        color="text-blue-400"
                        bgActive="bg-blue-500/10 border-blue-500/50"
                        selected={formData.category} 
                        onChange={(val) => setFormData({...formData, category: val})}
                      />
                      <RadioOption 
                        label="Request Fitur" 
                        value="feature" 
                        icon={<MdFeaturedPlayList/>} 
                        color="text-green-400"
                        bgActive="bg-green-500/10 border-green-500/50"
                        selected={formData.category} 
                        onChange={(val) => setFormData({...formData, category: val})}
                      />
                      <RadioOption 
                        label="Lainnya" 
                        value="other" 
                        icon={<MdHelpOutline/>} 
                        color="text-gray-400"
                        bgActive="bg-gray-500/10 border-gray-500/50"
                        selected={formData.category} 
                        onChange={(val) => setFormData({...formData, category: val})}
                      />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className={labelStyle}>Detail Pesan</label>
                    <textarea 
                      required
                      rows="6"
                      className={`${inputStyle} resize-none leading-relaxed`}
                      placeholder="Jelaskan secara rinci bantuan apa yang Anda butuhkan..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex items-center gap-2 bg-primary text-white font-btn text-[length:var(--size-btn)] 
                      rounded-[20px] text-white px-8 py-3.5transition-all duration-200 
                      hover:scale-105 hover:cursor-pointer hover:bg-purple-700
                      max-w-fit py-2 px-6 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:scale-none w-full md:w-auto justify-center"
                    >
                      {loading ? "Memproses..." : <><MdSend /> Kirim via Gmail / Email</>}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </PageTransition>
  );
};

// --- Sub-Komponen Kecil ---

const ContactCard = ({ icon, bgIcon, title, value, action, link }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noreferrer" 
    className="flex items-center gap-4 p-4 card border-none !py-6 !px-4 transition group"
  >
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bgIcon}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="small-text tracking-wide">{title}</p>
      <p className="body-text truncate">{value}</p>
      <span className="note hover:underline">
        {action} &rarr;
      </span>
    </div>
  </a>
);

const RadioOption = ({ label, value, icon, selected, onChange, color, bgActive }) => {
  const isSelected = selected === value;
  return (
    <div 
      onClick={() => onChange(value)}
      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
        isSelected 
          ? `${bgActive} text-white shadow-md transform scale-[1.02]` 
          : "bg-[#0a0a0a] border-white/10 text-gray-400 hover:bg-white/5"
      }`}
    >
      <div className={`text-2xl ${isSelected ? color : "text-gray-500"}`}>{icon}</div>
      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </div>
    
  );
};

export default ITSupport;