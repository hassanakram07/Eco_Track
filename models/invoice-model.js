const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "request" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  billedTo: { type: Object }, // snapshot of billing address
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "invoiceItem" }],
  subTotal: { type: Number },
  tax: { type: Number },
  discounts: { type: Number },
  totalAmount: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  dueAt: { type: Date },
  status: { type: String, enum: ["Unpaid", "Paid", "Overdue"], default: "Unpaid" },
});

module.exports = mongoose.model("invoice", invoiceSchema);
