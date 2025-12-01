// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController"); 
const {verifyToken} = require("../middleware/authMiddleware"); // <--- Middleware Wajib

// Route GET /profile harus diautentikasi 
router.get("/profile", verifyToken, getProfile); 

module.exports = router;