const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  sku: { type: String },
  name: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orderItem", orderItemSchema);
