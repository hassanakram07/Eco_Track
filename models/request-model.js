const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  requestNumber: { type: String, unique: true }, // e.g. REQ-2025-0001
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "material", required: true },
  materialName: { type: String }, // denormalized
  quantity: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  pickupAddress: { type: String },
  pickupLatLng: { type: Object }, // { lat, lng }
  scheduledAt: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  status: { type: String, enum: ["Pending", "Assigned", "Processing", "Completed", "Cancelled"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" },
  notes: { type: String },
  attachments: [{ type: String }], // URLs
  requestDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("request", requestSchema);
