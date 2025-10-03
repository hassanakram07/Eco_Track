const mongoose = require("mongoose");

const routeSchema = mongoose.Schema({
  routeCode: { type: String, unique: true },
  name: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "fleet" },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "collectionPoint" }],
  estimatedKm: { type: Number },
  estimatedTimeMin: { type: Number },
  frequency: { type: String }, // Daily, Weekly
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("route", routeSchema);
