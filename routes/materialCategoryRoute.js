const express = require("express");
const router = express.Router();

const { 
  createCategory, 
  getAllCategories, 
  updateCategory 
} = require("../controllers/materialCategoryController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔓 Public: Staff and Users can see categories
router.get("/all", getAllCategories);

// 🔒 Admin: Manage categories
router.post("/create", isLoggedin, authorizeRoles("Admin"), createCategory);
router.put("/update/:id", isLoggedin, authorizeRoles("Admin"), updateCategory);

module.exports = router;