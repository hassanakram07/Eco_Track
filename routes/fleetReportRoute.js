const express = require("express");
const router = express.Router();

const { 
  generateReport, 
  getFleetReports, 
  getFuelEfficiency 
} = require("../controllers/fleetReportController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Logistics/Admin: Report generate karne ke liye
router.post(
  "/generate", 
  isLoggedin, 
  authorizeRoles("Admin", "Logistics", "Manager"), 
  generateReport
);

// 🔒 View Reports for a specific vehicle
router.get(
  "/vehicle/:fleetId", 
  isLoggedin, 
  authorizeRoles("Admin", "Logistics", "Manager"), 
  getFleetReports
);

// 🔒 Analytics: Fuel Efficiency Check
router.get(
  "/efficiency/:reportId", 
  isLoggedin, 
  authorizeRoles("Admin", "Manager"), 
  getFuelEfficiency
);

module.exports = router;