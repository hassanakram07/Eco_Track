const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "orderItem" }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String },
  billingAddress: { type: String },
  status: { type: String, enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  placedAt: { type: Date, default: Date.now },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  trackingNumber: { type: String },
  shippingMethod: { type: String },
  notes: { type: String },
});

module.exports = mongoose.model("order", orderSchema);
