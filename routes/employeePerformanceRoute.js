const express = require("express");
const router = express.Router();

const { 
  addPerformanceRecord, 
  getEmployeePerformance, 
  getTopPerformers 
} = require("../controllers/employeePerformanceController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Manager: Performance record add karne ke liye
router.post(
  "/add", 
  isLoggedin, 
  authorizeRoles("Admin", "Manager", "HR"), 
  addPerformanceRecord
);

// 🔒 Admin/Manager: Kisi bhi employee ka record dekhne ke liye
router.get(
  "/employee/:employeeId", 
  isLoggedin, 
  authorizeRoles("Admin", "Manager", "HR"), 
  getEmployeePerformance
);

// 🔒 Admin/Manager: Top performers list dekhne ke liye
router.get(
  "/top-performers", 
  isLoggedin, 
  authorizeRoles("Admin", "Manager"), 
  getTopPerformers
);

module.exports = router;