const productCategoryModel = require("../models/productCategory-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Product Category Create Karna (Admin Only)
exports.createProductCategory = async (req, res) => {
  try {
    const { 
      code, name, parentCategoryId, description, 
      image, sortOrder, metadata 
    } = req.body;

    const exist = await productCategoryModel.findOne({ code: code.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Category code already exists" });

    const category = await productCategoryModel.create({
      code: code.toUpperCase(),
      name,
      parentCategoryId,
      description,
      image,
      sortOrder,
      metadata
    });

    res.status(201).json({
      success: true,
      message: "Product category created successfully",
      data: category
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Product Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saari Categories dekhna (Sub-categories ke details ke sath)
exports.getAllProductCategories = async (req, res) => {
  try {
    const categories = await productCategoryModel
      .find({ active: true })
      .populate("parentCategoryId", "name code")
      .sort({ sortOrder: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Product Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Category Update Karna
exports.updateProductCategory = async (req, res) => {
  try {
    const category = await productCategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (err) {
    await createLog("ERROR", err.message, "Product Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};