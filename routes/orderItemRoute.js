const express = require("express");
const router = express.Router();

const { addOrderItems, getOrderDetails } = require("../controllers/orderItemController");
const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Customer/Admin: Items add karne ke liye (Checkout process)
router.post("/add-bulk", isLoggedin, addOrderItems);

// 🔒 View Items (Sab dekh sakte hain jin ke paas access ho)
router.get("/order/:orderId", isLoggedin, getOrderDetails);

module.exports = router;