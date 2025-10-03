const mongoose = require("mongoose");

const fleetMaintenanceSchema = mongoose.Schema({
  fleetId: { type: mongoose.Schema.Types.ObjectId, ref: "fleet", required: true },
  serviceType: { type: String, required: true },
  serviceDate: { type: Date, default: Date.now },
  odometerKm: { type: Number },
  serviceCenter: { type: String },
  cost: { type: Number },
  nextServiceDue: { type: Date },
  notes: { type: String },
  invoiceFile: { type: String }, // path/url
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
});

module.exports = mongoose.model("fleetMaintenance", fleetMaintenanceSchema);
