const express = require("express");
const router = express.Router();
const { 
  createSubscription, 
  getMySubscription, 
  cancelSubscription 
} = require("../controllers/subscriptionController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔓 Customers/Users: Subscribe karne ke liye
router.post("/subscribe", isLoggedin, createSubscription);

// 🔓 User: Apni details dekhne ke liye
router.get("/my-plan", isLoggedin, getMySubscription);

// 🔒 Admin: Sabki subscriptions manage karne ke liye
router.get("/all", isLoggedin, authorizePermissions("manage_all_subscriptions"), async (req, res) => {
  const subs = await subscriptionModel.find().populate("userId", "firstName lastName email");
  res.json({ success: true, data: subs });
});

module.exports = router;