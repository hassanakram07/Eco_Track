const express = require("express");
const router = express.Router();

const { 
  addMaintenanceRecord, 
  getVehicleHistory, 
  getMaintenanceCostReport 
} = require("../controllers/fleetMaintenanceController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Logistics/Admin: Service record add karne ke liye
router.post("/add", isLoggedin, authorizeRoles("Admin", "Logistics"), addMaintenanceRecord);

// 🔒 View History
router.get("/history/:fleetId", isLoggedin, authorizeRoles("Admin", "Logistics", "Manager"), getVehicleHistory);

// 🔒 Financial Report (Only Admin/Finance)
router.get("/report/cost", isLoggedin, authorizeRoles("Admin", "Finance"), getMaintenanceCostReport);

module.exports = router;