const mongoose = require("mongoose");

const salesReportSchema = mongoose.Schema({
  reportCode: { type: String, unique: true },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  totalSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  topProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  generatedAt: { type: Date, default: Date.now },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  notes: { type: String },
});

module.exports = mongoose.model("salesReport", salesReportSchema);
