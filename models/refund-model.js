const mongoose = require("mongoose");

const refundSchema = mongoose.Schema({
  refundRef: { type: String, unique: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "payment" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  amount: { type: Number },
  reason: { type: String },
  status: { type: String, enum: ["Requested", "Approved", "Rejected", "Refunded"], default: "Requested" },
  requestedAt: { type: Date, default: Date.now },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  processedAt: { type: Date },
  notes: { type: String },
});

module.exports = mongoose.model("refund", refundSchema);
