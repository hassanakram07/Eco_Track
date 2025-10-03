const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["Admin", "Worker", "Driver", "Manager"], required: true },
  department: { type: String },
  employeeCode: { type: String, unique: true },
  address: { type: String },
  shift: { type: String }, // Morning/Evening/Night
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  emergencyContact: { type: String },
  bio: { type: String },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("employee", employeeSchema);
