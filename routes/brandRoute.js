const express = require("express");
const router = express.Router();

// Controllers import karein
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} = require("../controllers/brandController");

// Middlewares import karein (Jo aapne pehle banaye hain)
const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// Routes Definition

// 1. Sab brands dekhne ke liye (Public or All Users)
router.get("/all", getAllBrands);

// 2. Specific brand ki details dekhne ke liye
router.get("/single/:id", getBrandById);

// 3. Naya brand banane ke liye (Only Admin/Manager)
router.post(
  "/create",
  isLoggedin,
  authorizeRoles("Admin", "Manager"),
  createBrand
);

// 4. Brand update karne ke liye (Only Admin)
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updateBrand);

module.exports = router;
