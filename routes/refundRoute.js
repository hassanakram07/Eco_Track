const express = require("express");
const router = express.Router();

const { 
  requestRefund, 
  processRefundStatus, 
  getAllRefunds 
} = require("../controllers/refundController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Customer/Staff: Refund initiate karne ke liye
router.post("/request", isLoggedin, requestRefund);

// 🔒 Admin/Finance: Refund review aur process karne ke liye
router.put(
  "/process/:id", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance"), 
  processRefundStatus
);

router.get(
  "/all", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance"), 
  getAllRefunds
);

module.exports = router;