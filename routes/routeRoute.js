const express = require("express");
const router = express.Router();

const { 
  createRoute, 
  getDriverRoutes, 
  updateRoute 
} = require("../controllers/routeController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin/Logistics: Routes manage karne ke liye
router.post(
  "/plan", 
  isLoggedin, 
  authorizePermissions("manage_routes"), 
  createRoute
);

// 🔒 Driver/Staff: Apne assigned routes dekhne ke liye
router.get("/driver/:driverId", isLoggedin, getDriverRoutes);

router.put(
  "/update/:id", 
  isLoggedin, 
  authorizePermissions("manage_routes"), 
  updateRoute
);

module.exports = router;