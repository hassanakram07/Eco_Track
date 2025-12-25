const express = require("express");
const router = express.Router();

const { 
  submitRating, 
  getTargetRatings, 
  verifyRating 
} = require("../controllers/ratingController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public: Target ki ratings dekhne ke liye
router.get("/target/:targetId", getTargetRatings);

// 🔒 User: Rating submit karne ke liye
router.post("/submit", isLoggedin, submitRating);

// 🔒 Admin: Ratings moderate aur verify karne ke liye
router.put("/verify/:id", isLoggedin, authorizeRoles("Admin", "Moderator"), verifyRating);

module.exports = router;