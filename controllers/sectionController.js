const sectionModel = require("../models/warehouseSection-model");
const { createLog } = require("../controllers/logController");


// ✅ 1. CREATE SECTION
exports.createSection = async (req, res) => {
  try {
    const { warehouseId, code, name, capacityKg, racks, notes } = req.body;

    const section = await sectionModel.create({
      warehouseId,
      code: code.toUpperCase(),
      name,
      capacityKg,
      racks,
      notes
    });

    res.status(201).json({ success: true, message: "Warehouse section created", data: section });
  } catch (err) {
    await createLog("ERROR", err.message, "Section Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ 2. GET SECTIONS BY WAREHOUSE
exports.getSectionsByWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const sections = await sectionModel.find({ warehouseId, active: true });

    res.status(200).json({ success: true, data: sections });
    } catch (err) {
    await createLog("ERROR", err.message, "Section Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ 3. UPDATE SECTION LOAD (Internal Logic)
exports.updateSectionLoad = async (req, res) => {
  try {
    const { sectionId, weight, action } = req.body; // action: "ADD" or "REMOVE"
    
    const section = await sectionModel.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    if (action === "ADD") {
      section.currentLoadKg += Number(weight);
    } else {
      section.currentLoadKg -= Number(weight);
    }

    await section.save();
    res.status(200).json({ success: true, message: "Section load updated", data: section });
    } catch (err) {
    await createLog("ERROR", err.message, "Section Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};