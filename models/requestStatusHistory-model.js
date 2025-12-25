const mongoose = require("mongoose");

const requestStatusHistorySchema = mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "request", required: true },
  fromStatus: { type: String },
  toStatus: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedByType: { type: String }, // user/admin/employee
  note: { type: String },
  locationAtChange: { type: Object }, // { lat, lng }
  changedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("requestStatusHistory", requestStatusHistorySchema);
