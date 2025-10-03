const mongoose = require("mongoose");

const salarySchema = mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true },
  period: { type: String, required: true }, // e.g. "2025-09"
  basic: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  paidAt: { type: Date },
  paymentMethod: { type: String },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  notes: { type: String },
});

module.exports = mongoose.model("salary", salarySchema);
