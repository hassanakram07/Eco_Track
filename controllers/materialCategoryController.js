const materialCategoryModel = require("../models/materialCategory-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Nayi Category Create Karna (Admin Only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, disposalInstructions, metadata } = req.body;

    const exist = await materialCategoryModel.findOne({ name });
    if (exist) return res.status(400).json({ success: false, message: "Category name already exists" });

    const category = await materialCategoryModel.create({
      name,
      description,
      disposalInstructions,
      metadata
    });

    res.status(201).json({
      success: true,
      message: "Material category created successfully",
      data: category
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Material Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saari Active Categories dekhna (Public/Staff)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await materialCategoryModel.find({ active: true });
    res.status(200).json({ success: true, count: categories.length, data: categories });
   } catch (err) {
    await createLog("ERROR", err.message, "Material Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Category Update Karna (Admin Only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await materialCategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.status(200).json({ success: true, message: "Category updated", data: category });
   } catch (err) {
    await createLog("ERROR", err.message, "Material Category Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};