const mongoose = require("mongoose");

const activityLogSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  action: { type: String, required: true }, // CREATE_REQUEST, LOGIN, UPDATE_PRODUCT
  details: { type: Object },
  ipAddress: { type: String },
  module: { type: String },
  severity: { type: String, enum: ["INFO", "WARN", "ERROR"], default: "INFO" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("activityLog", activityLogSchema);
