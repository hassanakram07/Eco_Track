const mongoose = require("mongoose");

const recyclingStatSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "material" },
  quantityKg: { type: Number, default: 0 },
  source: { type: String }, // pickup, dropoff, buyback
  location: { type: Object }, // { lat, lng }
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  batchCode: { type: String },
  processedAt: { type: Date },
  notes: { type: String },
});

module.exports = mongoose.model("recyclingStat", recyclingStatSchema);
