const mongoose = require("mongoose");

const paymentMethodSchema = mongoose.Schema({
  name: { type: String, required: true }, // Cash, Card, Wallet
  code: { type: String, unique: true },
  details: { type: String },
  active: { type: Boolean, default: true },
  providerInfo: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("paymentMethod", paymentMethodSchema);
