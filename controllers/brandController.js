const brandModel = require("../models/brand-model");
const { createLog } = require("./logController");


exports.createBrand = async (req, res) => {
  try {
    const { 
      name, 
      code, 
      description, 
      website, 
      contactEmail, 
      contactPhone, 
      country, 
      active 
    } = req.body;

  
    const existingBrand = await brandModel.findOne({ code });
    if (existingBrand) {
      return res.status(400).json({ 
        success: false, 
        message: "Brand code already exists" 
      });
    }

    const brand = await brandModel.create({
      name,
      code,
      description,
      website,
      contactEmail,
      contactPhone,
      country,
      active
    });

    res.status(201).json({
      success: true,
      message: "Brand registered successfully",
      data: brand,
    });
  } catch (err) {
   
    await createLog("ERROR", err.message, "Brand Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.find();
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (err) {
  
    await createLog("ERROR", err.message, "Brand Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getBrandById = async (req, res) => {
  try {
    const brand = await brandModel.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    
    await createLog("ERROR", err.message, "Brand Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateBrand = async (req, res) => {
  try {
    const brand = await brandModel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (err) {

    await createLog("ERROR", err.message, "Brand Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(400).json({ success: false, message: err.message });
  }
};