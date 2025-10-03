const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  supplierCode: { type: String, unique: true },
  name: { type: String, required: true },
  contactPerson: { type: String },
  contactPhone: { type: String },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  paymentTerms: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("supplier", supplierSchema);
