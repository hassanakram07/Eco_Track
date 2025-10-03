const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  description: { type: String },
  percentage: { type: Number, required: true },
  maxAmount: { type: Number },
  minOrderValue: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("discount", discountSchema);
