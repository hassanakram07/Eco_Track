const mongoose = require("mongoose");

const systemLogSchema = mongoose.Schema({
  level: { type: String, enum: ["INFO", "WARN", "ERROR"], default: "INFO" },
  message: { type: String, required: true },
  module: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
});

module.exports = mongoose.model("systemLog", systemLogSchema);
   