const Product = require("../models/product-model");
const Brand = require("../models/brand-model");
const Category = require("../models/productCategory-model");
const Supplier = require("../models/supplier-model");

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      type,
      description,
      shortDescription,
      price,
      cost,
      stock,
      weightKg,
      dimensions,
      brandId,
      categoryId,
      supplierId,
      images,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required",
      });
    }

    // Validate foreign keys (optional fields)
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (!brand)
        return res.status(400).json({ success: false, message: "Brand not found" });
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(400).json({ success: false, message: "Category not found" });
    }

    if (supplierId) {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier)
        return res.status(400).json({ success: false, message: "Supplier not found" });
    }

    const product = await Product.create({
      sku,
      name,
      type,
      description,
      shortDescription,
      price,
      cost,
      stock,
      weightKg,
      dimensions,
      brandId,
      categoryId,
      supplierId,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate("supplierId", "name email");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate("supplierId", "name email");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
