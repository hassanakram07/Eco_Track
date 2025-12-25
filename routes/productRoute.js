const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

router.post("/add", isLoggedin, authorizeRoles("Admin", "Manager"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", isLoggedin, authorizeRoles("Admin", "Manager"), updateProduct);
router.delete("/:id", isLoggedin, authorizeRoles("Admin"), deleteProduct);

module.exports = router;
