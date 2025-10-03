const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  description: { type: String },
  website: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  country: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("brand", brandSchema);
