const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // User requested 'customerName', adding as string fallback/alias
  customerName: { type: String },

  materialType: { // Used by frontend (aka wasteType)
    type: String,
    required: true,
    enum: ["Plastic", "Paper", "Glass", "Metal", "E-Waste", "Other"],
  },
  wasteType: { type: String }, // specific request

  quantity: { type: Number, required: true }, // Used by frontend (aka estimatedWeight)
  estimatedWeight: { type: Number }, // specific request

  unit: { type: String, default: "kg" },
  pickupAddress: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Assigned", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  assignedCollector: { // Used by frontend
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // specific request

  // Loose coupling fields
  assignedDriverName: { type: String },
  assignedVehicleId: { type: String },

  photo: { type: String },
  notes: { type: String },

  // Buying Flow Fields
  paymentMethod: {
    type: String,
    enum: ["Cash", "JazzCash", "EasyPaisa"],
    default: "Cash"
  },
  paymentDetails: {
    accountName: { type: String },
    accountNumber: { type: String } // Mobile number or bank acc
  },

  // Admin Scheduling
  scheduledTime: { type: Date },
  adminResponse: { type: String }, // Rejection reason

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("pickupRequest", pickupRequestSchema);
