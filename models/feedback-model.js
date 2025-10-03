const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "request" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  rating: { type: Number, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String },
  photos: [{ type: String }],
  resolved: { type: Boolean, default: false },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("feedback", feedbackSchema);
