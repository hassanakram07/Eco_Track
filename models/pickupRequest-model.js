const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  materialType: {
    type: String,
    required: true,
    enum: ["Plastic", "Paper", "Glass", "Metal", "E-Waste", "Other"],
  },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  pickupAddress: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  collectedWeight: { type: Number },
  photo: { type: String }, // Optional proof photo
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("pickupRequest", pickupRequestSchema);
