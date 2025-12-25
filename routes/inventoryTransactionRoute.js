const express = require("express");
const router = express.Router();

const { 
  createTransaction, 
  getProductHistory, 
  getWarehouseTransactions 
} = require("../controllers/inventoryTransactionController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Warehouse/Admin: Stock move karne ke liye
router.post(
  "/record", 
  isLoggedin, 
  authorizeRoles("Admin", "WarehouseManager", "StoreKeeper"), 
  createTransaction
);

// 🔒 View History (Admin/Manager)
router.get("/product/:productId", isLoggedin, authorizeRoles("Admin", "Manager"), getProductHistory);
router.get("/warehouse/:warehouseId", isLoggedin, authorizeRoles("Admin", "Manager"), getWarehouseTransactions);

module.exports = router;