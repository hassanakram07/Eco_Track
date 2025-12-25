const express = require("express");
const router = express.Router();

const { 
  generateSalary, 
  paySalary, 
  getMySalaries 
} = require("../controllers/salaryController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 HR/Finance: Salary generate karne ke liye
router.post(
  "/generate", 
  isLoggedin, 
  authorizePermissions("manage_payroll"), 
  generateSalary
);

// 🔒 Finance: Payment confirm karne ke liye
router.put(
  "/pay/:id", 
  isLoggedin, 
  authorizePermissions("process_payments"), 
  paySalary
);

// 🔒 Employee: Apni slips dekhne ke liye
router.get("/my-history", isLoggedin, getMySalaries);

module.exports = router;