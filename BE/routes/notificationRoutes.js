const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { verifyToken } = require("../middleware/authMiddleware");

if (!verifyToken) {
    console.error("❌ Error: verifyToken middleware tidak terbaca/undefined!");
}
if(!notificationController.getNotif) {
    console.error("❌ Error: getNotif controller tidak terbaca/undefined!");
}

router.post("/", verifyToken, notificationController.createNotif)
router.get("/", verifyToken, notificationController.getNotif);
router.put("/:id/read", verifyToken, notificationController.markedNotif);
router.delete("/:id", verifyToken, notificationController.deleteNotif);

module.exports = router;