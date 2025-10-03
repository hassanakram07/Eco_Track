const mongoose = require("mongoose");

const materialSchema = mongoose.Schema({
  name: { type: String, required: true }, // Plastic, Paper, Glass, E-Waste
  code: { type: String, unique: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "materialCategory" },
  unit: { type: String, default: "kg" },
  recycleRate: { type: Number }, // percentage
  pricePerUnit: { type: Number }, // buyback price
  hazardous: { type: Boolean, default: false },
  handlingNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("material", materialSchema);
