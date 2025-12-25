const invoiceModel = require("../models/invoice-model");
const { createLog } = require("../controllers/logController");

// ✅ 1. Nayi Invoice Generate Karna (Admin/Billing Only)
exports.generateInvoice = async (req, res) => {
  try {
    const { 
      invoiceNumber, requestId, orderId, customerId, 
      billedTo, subTotal, tax, discounts, totalAmount, dueAt 
    } = req.body;

    const exist = await invoiceModel.findOne({ invoiceNumber });
    if (exist) return res.status(400).json({ success: false, message: "Invoice number already exists" });

    const invoice = await invoiceModel.create({
      invoiceNumber,
      requestId,
      orderId,
      customerId,
      billedTo,
      subTotal,
      tax,
      discounts,
      totalAmount,
      dueAt
    });

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: invoice
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Invoice Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Invoice Status Update Karna (e.g., Mark as Paid)
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await invoiceModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    res.status(200).json({
      success: true,
      message: `Invoice marked as ${status}`,
      data: invoice
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Invoice Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Customer ki apni Invoices dekhna
exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await invoiceModel.find({ customerId: req.user._id }).sort({ issuedAt: -1 });
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
   } catch (err) {
    await createLog("ERROR", err.message, "Invoice Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. Admin: Saari Overdue Invoices dekhna
exports.getOverdueInvoices = async (req, res) => {
  try {
    const now = new Date();
    const overdue = await invoiceModel.find({ 
      status: "Unpaid", 
      dueAt: { $lt: now } 
    }).populate("customerId", "firstName email");

    res.status(200).json({ success: true, data: overdue });
  } catch (err) {
    await createLog("ERROR", err.message, "Invoice Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};