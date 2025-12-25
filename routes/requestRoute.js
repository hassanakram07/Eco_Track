const express = require("express");
const router = express.Router();

const { 
  createRequest, 
  assignToCollector, 
  updateRequestStatus 
} = require("../controllers/requestController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Customer: Pickup request bhejne ke liye
router.post("/submit", isLoggedin, createRequest);

// 🔒 Admin/Logistics: Assignment aur management ke liye
router.put(
  "/assign/:id", 
  isLoggedin, 
  authorizeRoles("Admin", "Logistics"), 
  assignToCollector
);

// 🔒 Admin/Collector: Status update karne ke liye
router.put(
  "/status/:id", 
  isLoggedin, 
  authorizeRoles("Admin", "Logistics", "Collector"), 
  updateRequestStatus
);

module.exports = router;