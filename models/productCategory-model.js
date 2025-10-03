const mongoose = require("mongoose");

const productCategorySchema = mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "productCategory" },
  description: { type: String },
  image: { type: String },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("productCategory", productCategorySchema);
