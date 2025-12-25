const express = require("express");
const router = express.Router();

const { 
  placeOrder, 
  updateOrderStatus, 
  getMyOrders 
} = require("../controllers/orderController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Customer: Order place karne aur apni history dekhne ke liye
router.post("/place", isLoggedin, placeOrder);
router.get("/my-orders", isLoggedin, getMyOrders);

// 🔒 Admin/Logistics: Orders manage karne ke liye
router.put("/status/:id", isLoggedin, authorizeRoles("Admin", "Logistics"), updateOrderStatus);

module.exports = router;