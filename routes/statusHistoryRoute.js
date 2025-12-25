const express = require("express");
const router = express.Router();

const { 
  getRequestTimeline, 
  getLatestStatus 
} = require("../controllers/statusHistoryController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Manager: Audit trail check karne ke liye
router.get(
  "/timeline/:requestId", 
  isLoggedin, 
  authorizeRoles("Admin", "Logistics", "Manager"), 
  getRequestTimeline
);

// 🔒 View latest change
router.get(
  "/latest/:requestId", 
  isLoggedin, 
  getLatestStatus
);

module.exports = router;