const mongoose = require("mongoose");

const warehouseSchema = mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  contactPerson: { type: String },
  contactPhone: { type: String },
  capacityKg: { type: Number },
  zones: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("warehouse", warehouseSchema);
