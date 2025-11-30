// app.js (Contoh file utama Express Anda)
const express = require("express");
const app = express();
const port = 3000;

// Import router dari auth.js
const authRoutes = require("./routes/auth"); // Sesuaikan path jika berbeda

// Middleware untuk parsing body (penting untuk POST request seperti login)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes); 
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});