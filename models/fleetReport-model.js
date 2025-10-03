const mongoose = require("mongoose");

const fleetReportSchema = mongoose.Schema({
  fleetId: { type: mongoose.Schema.Types.ObjectId, ref: "fleet" },
  period: { type: String }, // e.g. 2025-Q3
  totalKm: { type: Number, default: 0 },
  trips: { type: Number, default: 0 },
  fuelConsumedLiters: { type: Number, default: 0 },
  maintenanceCost: { type: Number, default: 0 },
  avgLoadKg: { type: Number },
  incidents: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("fleetReport", fleetReportSchema);
