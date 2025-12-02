exports.getProfile = (req, res) => {
    // 1. PERBAIKAN: Mengganti req.users menjadi req.user
    const user = req.user; 
    
    // Pastikan req.user ada, jika tidak, kirim error
    if (!user) {
         return res.status(401).json({ message: "Data pengguna tidak ditemukan di request." });
    }

    let profileData = {
        // name mengambil nilai asli dari JWT (username)
        name: user.username || 'Username Tidak Tersedia', 
        id: user.id,
        role: user.role,
        status: "Aktif",
        jabatan: "Karyawan Umum" 
    };

   
    return res.status(200).json(profileData);
};