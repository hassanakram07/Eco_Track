const express = require("express");
const router = express.Router();

const { 
  recordRevenue, 
  getRevenueStats, 
  getRevenueByPeriod 
} = require("../controllers/revenueController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Finance/Admin Only
router.post("/record", isLoggedin, authorizeRoles("Admin", "Finance"), recordRevenue);
router.get("/stats", isLoggedin, authorizeRoles("Admin", "Finance"), getRevenueStats);
router.get("/report", isLoggedin, authorizeRoles("Admin", "Finance"), getRevenueByPeriod);

module.exports = router;