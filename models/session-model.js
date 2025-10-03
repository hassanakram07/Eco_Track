const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  jwtToken: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  revoked: { type: Boolean, default: false },
  deviceInfo: { type: Object },
});

module.exports = mongoose.model("session", sessionSchema);
