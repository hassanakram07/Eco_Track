const express = require("express");
const router = express.Router();

const { 
  generateReport, 
  getAllReports 
} = require("../controllers/reportController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin/Manager: Report generate karne ke liye
router.post(
  "/generate", 
  isLoggedin, 
  authorizePermissions("generate_reports"), 
  generateReport
);

// 🔒 View all reports
router.get(
  "/all", 
  isLoggedin, 
  authorizePermissions("view_reports"), 
  getAllReports
);

module.exports = router;