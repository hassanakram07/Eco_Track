const mongoose = require("mongoose");

const materialCategorySchema = mongoose.Schema({
  name: { type: String, required: true }, // Organic, Non-organic, E-waste
  description: { type: String },
  disposalInstructions: { type: String },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  metadata: { type: Object },
});

module.exports = mongoose.model("materialCategory", materialCategorySchema);
