const express = require("express");
const router = express.Router();

const { 
  addInvoiceItems, 
  getInvoiceDetails 
} = require("../controllers/invoiceItemController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Finance: Items manage karne ke liye
router.post(
  "/add-bulk", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance"), 
  addInvoiceItems
);

// 🔒 View items of an invoice
router.get(
  "/invoice/:invoiceId", 
  isLoggedin, 
  authorizeRoles("Admin", "Finance", "Manager"), 
  getInvoiceDetails
);

module.exports = router;