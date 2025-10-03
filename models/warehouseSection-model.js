const mongoose = require("mongoose");

const warehouseSectionSchema = mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "warehouse", required: true },
  code: { type: String },
  name: { type: String, required: true },
  capacityKg: { type: Number },
  currentLoadKg: { type: Number, default: 0 },
  racks: { type: Number },
  notes: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("warehouseSection", warehouseSectionSchema);
