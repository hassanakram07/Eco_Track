const express = require("express");
const router = express.Router();
const { getEmployeePerformance } = require("../controllers/employeePerformanceController");
const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin/Manager: Employee ki performance dekhne ke liye
// Endpoint: GET /api/performance/:employeeId
router.get(
    "/:employeeId", 
    isLoggedin, 
    authorizePermissions("view_performance"), 
    getEmployeePerformance
);

module.exports = router;