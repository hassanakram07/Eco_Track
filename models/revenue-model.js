const mongoose = require("mongoose");

const revenueSchema = mongoose.Schema({
  revenueCode: { type: String, unique: true },
  source: { type: String }, // product sale, service, donation
  amount: { type: Number, required: true },
  currency: { type: String, default: "PKR" },
  date: { type: Date, default: Date.now },
  referenceId: { type: String },
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
});

module.exports = mongoose.model("revenue", revenueSchema);
