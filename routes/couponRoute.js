const express = require("express");
const router = express.Router();

const { 
  createCoupon, 
  validateCoupon, 
  getAllCoupons 
} = require("../controllers/couponController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 User Route: Checkout ke waqt coupon check karne ke liye
router.post("/validate", isLoggedin, validateCoupon);

// 🔒 Admin Routes: Coupons manage karne ke liye
router.post("/create", isLoggedin, authorizeRoles("Admin", "SuperAdmin"), createCoupon);
router.get("/all", isLoggedin, authorizeRoles("Admin"), getAllCoupons);

module.exports = router;