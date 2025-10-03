const mongoose = require("mongoose");

const invoiceItemSchema = mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "invoice" },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  metadata: { type: Object },
});

module.exports = mongoose.model("invoiceItem", invoiceItemSchema);
