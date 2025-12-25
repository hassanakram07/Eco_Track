const express = require("express");
const router = express.Router();

const { 
  recordStat, 
  getRecyclingImpact, 
  getLocationStats 
} = require("../controllers/statController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Staff/Admin: Naya recycling data record karne ke liye
router.post(
  "/record", 
  isLoggedin, 
  authorizeRoles("Admin", "Staff", "Manager"), 
  recordStat
);

// 🔒 Admin/Manager: Reporting aur Analytics dekhne ke liye
router.get("/impact-summary", isLoggedin, authorizeRoles("Admin", "Manager"), getRecyclingImpact);
router.get("/map-data", isLoggedin, authorizeRoles("Admin", "Manager"), getLocationStats);

module.exports = router;