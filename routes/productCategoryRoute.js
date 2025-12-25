const express = require("express");
const router = express.Router();

const { 
  createProductCategory, 
  getAllProductCategories, 
  updateProductCategory 
} = require("../controllers/productCategoryController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public: Users can see categories for browsing products
router.get("/all", getAllProductCategories);

// 🔒 Admin/Manager: Manage categories
router.post("/create", isLoggedin, authorizeRoles("Admin", "Manager"), createProductCategory);
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updateProductCategory);

module.exports = router;