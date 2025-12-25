const express = require("express");
const router = express.Router();
const { 
  createSupplier, 
  getAllSuppliers, 
  updateSupplier, 
  deleteSupplier 
} = require("../controllers/supplierController");

const { isLoggedin, authorizePermissions } = require("../middleware/isLoggedin");

// 🔒 Admin/Procurement: Supplier add karne ke liye
router.post("/create", isLoggedin, authorizePermissions("manage_suppliers"), createSupplier);

// 🔓 Logged-in Staff: Suppliers list dekhne ke liye
router.get("/all", isLoggedin, getAllSuppliers);

// 🔒 Admin: Update ya Delete karne ke liye
router.put("/update/:id", isLoggedin, authorizePermissions("manage_suppliers"), updateSupplier);
router.delete("/delete/:id", isLoggedin, authorizePermissions("manage_suppliers"), deleteSupplier);

module.exports = router;