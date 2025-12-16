exports.getProfile = (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Data pengguna tidak ditemukan di request." });
  }

  let profileData = {
    name: user.username || "Username Tidak Tersedia",
    id: user.id,
    role: user.role,
    status: "Aktif",
    jabatan: "Karyawan Umum",
  };

  return res.status(200).json(profileData);
};
