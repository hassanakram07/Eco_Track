const refundModel = require("../models/refund-model");
const orderModel = require("../models/order-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Refund Request Create Karna (Customer/Admin)
exports.requestRefund = async (req, res) => {
  try {
    const { refundRef, paymentId, orderId, amount, reason, notes } = req.body;

    const refund = await refundModel.create({
      refundRef,
      paymentId,
      orderId,
      amount,
      reason,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Refund request submitted successfully",
      data: refund
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Refund Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Refund Status Update Karna (Admin Only)
exports.processRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { 
      status, 
      notes, 
      processedBy: req.user._id, 
      processedAt: Date.now() 
    };

    const refund = await refundModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!refund) return res.status(404).json({ success: false, message: "Refund record not found" });

    // Industrial Logic: Agar refund process ho jaye toh Order status update karein
    if (status === "Refunded") {
      await orderModel.findByIdAndUpdate(refund.orderId, { status: "Cancelled" });
    }

    res.status(200).json({
      success: true,
      message: `Refund status updated to ${status}`,
      data: refund
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Refund Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Admin: Saari Refund Requests dekhna
exports.getAllRefunds = async (req, res) => {
  try {
    const refunds = await refundModel
      .find()
      .populate("orderId", "orderNumber totalAmount")
      .populate("processedBy", "fullName")
      .sort({ requestedAt: -1 });

    res.status(200).json({ success: true, count: refunds.length, data: refunds });
    } catch (err) {
    await createLog("ERROR", err.message, "Refund Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};