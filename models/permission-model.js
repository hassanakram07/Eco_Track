const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. manage_requests
  name: { type: String, required: true },
  description: { type: String },
  module: { type: String }, // e.g. Requests, Users
  createdAt: { type: Date, default: Date.now },
  deprecated: { type: Boolean, default: false },
  metadata: { type: Object },
});

module.exports = mongoose.model("permission", permissionSchema);
