const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: { type: String, required: true }, // Admin, Customer, Employee, Driver, Manager
  description: { type: String },
  permissions: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  isSystemRole: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("role", roleSchema);
