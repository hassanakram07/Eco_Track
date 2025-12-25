const express = require("express");
const router = express.Router();

const { 
  getMyNotifications, 
  markAsRead, 
  readAll 
} = require("../controllers/notificationController");

const { isLoggedin } = require("../middleware/isLoggedin");

// 🔒 All routes are for logged-in users
router.get("/my", isLoggedin, getMyNotifications);
router.put("/read/:id", isLoggedin, markAsRead);
router.put("/read-all", isLoggedin, readAll);

module.exports = router;