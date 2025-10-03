const mongoose = require("mongoose");

const fleetSchema = mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  model: { type: String },
  type: { type: String }, // Truck, Van
  capacityKg: { type: Number },
  purchaseDate: { type: Date },
  lastServiceDate: { type: Date },
  status: { type: String, enum: ["Active", "Maintenance", "Inactive"], default: "Active" },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  registrationDocs: [{ type: String }],
  insuranceExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("fleet", fleetSchema);
