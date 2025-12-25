const express = require("express");
const router = express.Router();

const { 
  createDiscount, 
  getActiveDiscounts, 
  updateDiscount 
} = require("../controllers/discountController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public: Customers offers dekh sakte hain
router.get("/active", getActiveDiscounts);

// 🔒 Admin/Manager: Offers manage karne ke liye
router.post("/create", isLoggedin, authorizeRoles("Admin", "Manager"), createDiscount);
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updateDiscount);

module.exports = router;