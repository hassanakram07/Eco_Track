const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  scheduleCode: { type: String, unique: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "request" },
  pickupDate: { type: Date, required: true },
  windowStart: { type: String },
  windowEnd: { type: String },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "fleet" },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "route" },
  status: { type: String, enum: ["Scheduled", "Completed", "Missed"], default: "Scheduled" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("schedule", scheduleSchema);
