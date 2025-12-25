const express = require("express");
const router = express.Router();

const { 
  submitFeedback, 
  getAllFeedbacks, 
  respondToFeedback 
} = require("../controllers/feedbackController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 User: Feedback jama karwane ke liye
router.post("/submit", isLoggedin, submitFeedback);

// 🔒 Admin: Sab feedbacks dekhne aur reply karne ke liye
router.get("/all", isLoggedin, authorizeRoles("Admin", "Manager"), getAllFeedbacks);
router.put("/respond/:feedbackId", isLoggedin, authorizeRoles("Admin"), respondToFeedback);

module.exports = router;