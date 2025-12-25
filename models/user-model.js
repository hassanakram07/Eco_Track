const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash in real app
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  role: {
    type: String,
    enum: [
      "Admin",
      "Customer",
      "Collector",
      "Processor",
      "Manager",
      "Driver",
      "Supplier",
    ],
    default: "Customer",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "pending"],
    default: "pending",
  },
  lastLogin: { type: Date },
  preferences: { type: Object }, // JSON for user prefs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
