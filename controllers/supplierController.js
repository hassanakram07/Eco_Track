const supplierModel = require("../models/supplier-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. CREATE SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const { supplierCode, name, contactPerson, contactPhone, email, address, city, country, paymentTerms, notes } = req.body;

    const exist = await supplierModel.findOne({ supplierCode: supplierCode.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Supplier code already exists" });

    const supplier = await supplierModel.create({
      supplierCode: supplierCode.toUpperCase(),
      name,
      contactPerson,
      contactPhone,
      email,
      address,
      city,
      country,
      paymentTerms,
      notes
    });

    res.status(201).json({ success: true, message: "Supplier added successfully", data: supplier });
    } catch (err) {
    await createLog("ERROR", err.message, "Supplier Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. GET ALL SUPPLIERS
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (err) {
    await createLog("ERROR", err.message, "Supplier Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. UPDATE SUPPLIER
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });

    res.status(200).json({ success: true, message: "Supplier updated", data: supplier });
    } catch (err) {
    await createLog("ERROR", err.message, "Supplier Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. DELETE SUPPLIER
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await supplierModel.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });

    res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (err) {
    await createLog("ERROR", err.message, "Supplier Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};