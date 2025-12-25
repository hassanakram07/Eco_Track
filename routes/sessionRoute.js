const express = require("express");
const router = express.Router();

const { 
  getActiveSessions, 
  revokeSession 
} = require("../controllers/sessionController");

const { isLoggedin } = require("../middleware/isLoggedin");

// 🔒 User: Apne active sessions check karne ke liye
router.get("/active", isLoggedin, getActiveSessions);

// 🔒 User: Kisi specific device se logout karne ke liye
router.put("/revoke/:id", isLoggedin, revokeSession);

module.exports = router;