const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  paymentRef: { type: String, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["Cash", "Card", "Wallet", "BankTransfer"], required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending" },
  transactionId: { type: String },
  paidAt: { type: Date },
  payerInfo: { type: Object }, // card last4 etc
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("payment", paymentSchema);
