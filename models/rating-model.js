const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  targetType: { type: String, enum: ["employee", "product", "service"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("rating", ratingSchema);
