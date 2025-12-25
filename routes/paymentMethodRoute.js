const express = require("express");
const router = express.Router();

const { 
  addPaymentMethod, 
  getActiveMethods, 
  toggleMethodStatus 
} = require("../controllers/paymentMethodController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public/User: Checkout ke waqt available methods dekhne ke liye
router.get("/list", getActiveMethods);

// 🔒 Admin/Finance: Configuration manage karne ke liye
router.post("/add", isLoggedin, authorizeRoles("Admin", "Finance"), addPaymentMethod);
router.put("/toggle/:id", isLoggedin, authorizeRoles("Admin"), toggleMethodStatus);

module.exports = router;