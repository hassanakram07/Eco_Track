const mongoose = require("mongoose");

const warehouseSchema = mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  capacityKg: { type: Number },
  // ⭐️ Industrial Logic: Kis material ka kitna stock hai
  inventory: [{
    materialType: { type: String }, // e.g., "Plastic", "Paper"
    currentWeight: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }],
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("warehouse", warehouseSchema);