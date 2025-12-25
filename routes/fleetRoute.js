const express = require("express");
const router = express.Router();

const { 
  addVehicle, 
  assignDriver, 
  updateVehicleStatus, 
  getFleetDetails 
} = require("../controllers/fleetController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Logistics: Vehicle manage karne ke liye
router.post("/add", isLoggedin, authorizeRoles("Admin", "Logistics"), addVehicle);
router.get("/all", isLoggedin, authorizeRoles("Admin", "Logistics", "Manager"), getFleetDetails);

// 🔒 Assigning Driver & Maintenance
router.put("/assign-driver/:vehicleId", isLoggedin, authorizeRoles("Admin", "Logistics"), assignDriver);
router.put("/update-status/:vehicleId", isLoggedin, authorizeRoles("Admin", "Logistics"), updateVehicleStatus);

module.exports = router;