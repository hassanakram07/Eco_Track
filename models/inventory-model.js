const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, // Made optional
  materialName: { type: String }, // Added for string fallback
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "warehouse" },
  location: { type: String }, // Added for simple string location
  batchNumber: { type: String },
  quantity: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  minLevel: { type: Number, default: 0 },
  maxLevel: { type: Number },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  lastUpdatedAt: { type: Date, default: Date.now },
  metadata: { type: Object },
});

module.exports = mongoose.model("inventory", inventorySchema);
