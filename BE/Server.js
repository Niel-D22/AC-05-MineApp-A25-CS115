// app.js (Contoh file utama Express Anda)
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Import router dari auth.js
const authRoutes = require("./routes/auth"); // Sesuaikan path jika berbeda
const userRoutes = require("./routes/UserRoutes"); // <--- Import Router Baru
const notificationRoutes = require("./routes/notificationRoutes");

app.use(
  cors({
    origin: "http://localhost:5173", // Izinkan hanya frontend Anda
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Metode yang diizinkan
    credentials: true, // Izinkan cookie atau header otorisasi
  })
);

// Middleware untuk parsing body (penting untuk POST request seperti login)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
