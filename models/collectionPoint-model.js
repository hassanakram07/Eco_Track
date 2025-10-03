const mongoose = require("mongoose");

const collectionPointSchema = mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  contactPerson: { type: String },
  contactPhone: { type: String },
  coordinates: { type: Object }, // { lat, lng }
  openingHours: { type: String },
  active: { type: Boolean, default: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("collectionPoint", collectionPointSchema);
