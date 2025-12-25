const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["Free", "Premium", "Loyalty"], default: "Free" },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  autoRenew: { type: Boolean, default: false },
  status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" },
  benefits: [{ type: String }],
  paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: "paymentMethod" },
  notes: { type: String },
});

module.exports = mongoose.model("subscription", subscriptionSchema);
