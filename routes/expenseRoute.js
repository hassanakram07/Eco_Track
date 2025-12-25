const express = require("express");
const router = express.Router();

const { 
  addExpense, 
  getAllExpenses, 
  getExpensesByCategory 
} = require("../controllers/expenseController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Finance: Naya kharcha add karne ke liye
router.post(
  "/add", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance", "Manager"), 
  addExpense
);

// 🔒 Admin/Finance: Sab kharchay dekhne ke liye
router.get(
  "/all", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance"), 
  getAllExpenses
);

// 🔒 Admin/Finance: Specific category filter
router.get(
  "/category/:categoryName", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance"), 
  getExpensesByCategory
);

module.exports = router;