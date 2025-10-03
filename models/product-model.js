const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  sku: { type: String, unique: true },
  name: { type: String, required: true },
  type: { type: String }, // Eco Bag, Notebook
  description: { type: String },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  weightKg: { type: Number },
  dimensions: { type: String },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "productCategory" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
  images: [{ type: String }],
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", productSchema);
