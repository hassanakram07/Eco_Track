const express = require("express");
const router = express.Router();

const { 
  generateInvoice, 
  updateInvoiceStatus, 
  getMyInvoices, 
  getOverdueInvoices 
} = require("../controllers/invoiceController");

const { isLoggedin } = require("../middleware/isLoggedin");
const { authorizeRoles } = require("../middleware/authorizeRoles");

// 🔒 Admin/Finance: Invoice manage karne ke liye
router.post("/generate", isLoggedin, authorizeRoles("Admin", "Finance"), generateInvoice);
router.put("/status/:id", isLoggedin, authorizeRoles("Admin", "Finance"), updateInvoiceStatus);
router.get("/overdue", isLoggedin, authorizeRoles("Admin", "Finance"), getOverdueInvoices);

// 🔒 Customer: Apni invoices dekhne ke liye
router.get("/my-invoices", isLoggedin, getMyInvoices);

module.exports = router;