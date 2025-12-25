const paymentModel = require("../models/payment-model");
const orderModel = require("../models/order-model");
const revenueModel = require("../models/revenue-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Payment Record karna (Initiate Payment)
exports.processPayment = async (req, res) => {
  try {
    const { 
      paymentRef, orderId, amount, method, 
      transactionId, payerInfo, notes 
    } = req.body;

    const payment = await paymentModel.create({
      paymentRef,
      orderId,
      amount,
      method,
      transactionId,
      payerInfo,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: payment
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Payment Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Payment Status Confirm Karna (Success/Fail)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;

    const updateData = { status };
    if (status === "Completed") updateData.paidAt = Date.now();
    if (transactionId) updateData.transactionId = transactionId;

    const payment = await paymentModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

    // ⭐️ INDUSTRIAL LOGIC: Agar payment status 'Completed' hai
    if (status === "Completed") {
      // 1. Order ko 'Paid' mark karein
      const order = await orderModel.findByIdAndUpdate(payment.orderId, { status: "Paid" });

      // 2. ⚡️ REVENUE ENTRY: Isay yahan update karna hai
      await revenueModel.create({
        revenueCode: `REV-${Date.now()}`, // Unique code generator
        source: "product sale",            // Source type
        amount: payment.amount,            // Jitni payment hui
        referenceId: payment.orderId,      // Order ID ka reference
        notes: `Revenue automatically recorded for Order #${order.orderNumber}`,
        recordedBy: req.user._id           // Kis admin/staff ne status update kiya
      });
    }

    res.status(200).json({ success: true, message: `Payment completed and revenue recorded`, data: payment });

    } catch (err) {
    await createLog("ERROR", err.message, "Payment Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Admin/Finance: Sare payments list karna (audit ke liye)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (err) {
    await createLog("ERROR", err.message, "Payment Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};