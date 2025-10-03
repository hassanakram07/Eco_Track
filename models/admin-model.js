const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  role: { type: String, default: "SuperAdmin" }, // SuperAdmin, Admin, Moderator
  permissions: [{ type: String }], // list of permission keys
  lastLogin: { type: Date },
  status: { type: String, default: "active" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("admin", adminSchema);
