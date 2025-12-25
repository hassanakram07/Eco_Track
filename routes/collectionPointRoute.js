const express = require("express");
const router = express.Router();

const { 
  createCollectionPoint, 
  getAllPoints, 
  updatePoint, 
  deletePoint 
} = require("../controllers/collectionPointController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public Route: Koi bhi dekh sake ke recycling point kahan hai
router.get("/all", getAllPoints);

// 🔒 Admin Routes: Points manage karne ke liye
router.post("/create", isLoggedin, authorizeRoles("Admin", "SuperAdmin"), createCollectionPoint);
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updatePoint);
router.delete("/delete/:id", isLoggedin, authorizeRoles("Admin"), deletePoint);

module.exports = router;