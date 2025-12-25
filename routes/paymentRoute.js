const express = require("express");
const router = express.Router();

const { 
  processPayment, 
  updatePaymentStatus, 
  getAllPayments 
} = require("../controllers/paymentController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Customer: Payment record initiate karne ke liye
router.post("/initiate", isLoggedin, processPayment);

// 🔒 Admin/Finance: Status update karne aur audit ke liye
router.put("/update/:id", isLoggedin, authorizeRoles("Admin", "Finance"), updatePaymentStatus);
router.get("/all", isLoggedin, authorizeRoles("Admin", "Finance"), getAllPayments);

module.exports = router;