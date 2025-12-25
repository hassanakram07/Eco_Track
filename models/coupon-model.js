const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountId: { type: mongoose.Schema.Types.ObjectId, ref: "discount" },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  assignedToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  validFrom: { type: Date },
  validUntil: { type: Date },
  active: { type: Boolean, default: true },
  note: { type: String },
});

module.exports = mongoose.model("coupon", couponSchema);
