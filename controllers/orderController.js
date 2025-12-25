const orderModel = require("../models/order-model");
const { sendNotification } = require("./notificationController");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Order Place Karna (Customer Only)
exports.placeOrder = async (req, res) => {
  try {
    const {
      orderNumber, shippingAddress, billingAddress,
      totalAmount, shippingMethod, notes
    } = req.body;

    const order = await orderModel.create({
      orderNumber,
      customerId: req.user._id,
      shippingAddress,
      billingAddress,
      totalAmount,
      shippingMethod,
      notes
    });

    // Notify User
    await sendNotification(req.user._id, "Order Placed", `Your order ${orderNumber} has been received.`, "info");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Order Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Order Status Update Karna (Admin/Logistics Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const updateData = { status };
    if (status === "Shipped") {
      updateData.shippedAt = Date.now();
      updateData.trackingNumber = trackingNumber;
    }
    if (status === "Delivered") updateData.deliveredAt = Date.now();

    const order = await orderModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Notify Customer about status change
    await sendNotification(order.customerId, "Order Status Update", `Your order is now ${status}`, "info");

    res.status(200).json({ success: true, message: `Order marked as ${status}`, data: order });
  } catch (err) {
    await createLog("ERROR", err.message, "Order Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Customer ka apna Order History dekhna
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ customerId: req.user._id }).sort({ placedAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    await createLog("ERROR", err.message, "Order Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};