const mongoose = require("mongoose");

const inventoryTransactionSchema = mongoose.Schema({
  transactionCode: { type: String, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "warehouse" },
  type: { type: String, enum: ["IN", "OUT", "ADJUSTMENT"], required: true },
  quantity: { type: Number, required: true },
  referenceId: { type: String }, // orderId or production batch
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  performedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model("inventoryTransaction", inventoryTransactionSchema);
