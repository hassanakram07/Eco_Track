const materialModel = require("../models/material-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. Naya Material Add Karna (Admin/Logistics Only)
exports.createMaterial = async (req, res) => {
  try {
    const {
      name, code, description, categoryId,
      unit, recycleRate, pricePerUnit, hazardous, handlingNotes
    } = req.body;

    const exist = await materialModel.findOne({ code: code.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Material code already exists" });

    const material = await materialModel.create({
      name,
      code: code.toUpperCase(),
      description,
      categoryId,
      unit,
      recycleRate,
      pricePerUnit,
      hazardous,
      handlingNotes
    });

    res.status(201).json({
      success: true,
      message: "New material type added to system",
      data: material
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Material Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Saaray Materials ki List (Users ke liye - Price List ke taur par)
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await materialModel.find().populate("categoryId", "name");
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    await createLog("ERROR", err.message, "Material Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Material Update Karna (Price change ya Handling notes update)
exports.updateMaterial = async (req, res) => {
  try {
    const material = await materialModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!material) return res.status(404).json({ success: false, message: "Material not found" });

    res.status(200).json({ success: true, message: "Material updated", data: material });
  } catch (err) {
    await createLog("ERROR", err.message, "Material Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. Hazardous Materials Check (Safety Audit ke liye)
exports.getHazardousMaterials = async (req, res) => {
  try {
    const hazardousOnes = await materialModel.find({ hazardous: true });
    res.status(200).json({ success: true, data: hazardousOnes });
  } catch (err) {
    await createLog("ERROR", err.message, "Material Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 5. Material Delete Karna (Admin Only)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await materialModel.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });

    await material.deleteOne();
    res.status(200).json({ success: true, message: "Material deleted successfully" });
  } catch (err) {
    await createLog("ERROR", err.message, "Material Module", { stack: err.stack, user: req.user?._id });
    res.status(500).json({ success: false, message: err.message });
  }
};