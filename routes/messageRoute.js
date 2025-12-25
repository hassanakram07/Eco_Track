const express = require("express");
const router = express.Router();

const { 
  sendMessage, 
  getInbox, 
  markAsRead, 
  getSentMessages 
} = require("../controllers/messageController");

const { isLoggedin } = require("../middleware/isLoggedin");

// 🔒 All messaging routes require login
router.post("/send", isLoggedin, sendMessage);
router.get("/inbox", isLoggedin, getInbox);
router.get("/sent", isLoggedin, getSentMessages);
router.put("/read/:id", isLoggedin, markAsRead);

module.exports = router;