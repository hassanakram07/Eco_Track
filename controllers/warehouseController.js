const warehouseModel = require("../models/warehouse-model");
const { createLog } = require("../controllers/logController");
// ✅ 1. CREATE WAREHOUSE
exports.createWarehouse = async (req, res) => {
  try {
    const { code, name, address, city, country, contactPerson, contactPhone, capacityKg } = req.body;

    // Check if warehouse code already exists
    const exist = await warehouseModel.findOne({ code: code.toUpperCase() });
    if (exist) return res.status(400).json({ success: false, message: "Warehouse code already exists" });

    const warehouse = await warehouseModel.create({
      code: code.toUpperCase(),
      name,
      address,
      city,
      country,
      contactPerson,
      contactPhone,
      capacityKg,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse,
    });
   } catch (err) {
     await createLog("ERROR", err.message, "Warehouse Module", { 
       stack: err.stack, 
       inputData: req.body, 
       user: req.user ? req.user._id : "Guest" 
     });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. GET ALL WAREHOUSES
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await warehouseModel
      .find()
      .populate("createdBy", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
    } catch (err) {
      await createLog("ERROR", err.message, "Warehouse Module", { 
        stack: err.stack, 
        inputData: req.body, 
        user: req.user ? req.user._id : "Guest" 
      });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. GET SINGLE WAREHOUSE (With Inventory Details)
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await warehouseModel.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });

    res.status(200).json({ success: true, data: warehouse });
    } catch (err) {
      await createLog("ERROR", err.message, "Warehouse Module", { 
        stack: err.stack, 
        inputData: req.body, 
        user: req.user ? req.user._id : "Guest" 
      });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 4. UPDATE STOCK (Industrial Logic for Material In/Out)
// Isay aap tab call karenge jab pickup warehouse mein drop ho ya maal sell ho
exports.updateWarehouseStock = async (req, res) => {
  try {
    const { warehouseId, materialType, weight, action } = req.body; // action: "IN" or "OUT"
    
    const warehouse = await warehouseModel.findById(warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    // Inventory mein material dhundna
    let itemIndex = warehouse.inventory.findIndex(i => i.materialType.toLowerCase() === materialType.toLowerCase());

    if (itemIndex > -1) {
      // Agar pehle se hai toh calculation karein
      if (action === "IN") {
        warehouse.inventory[itemIndex].currentWeight += Number(weight);
      } else {
        warehouse.inventory[itemIndex].currentWeight -= Number(weight);
      }
      warehouse.inventory[itemIndex].lastUpdated = Date.now();
    } else {
      // Agar naya material type hai aur stock aa raha hai
      if (action === "IN") {
        warehouse.inventory.push({ materialType, currentWeight: weight });
      } else {
        return res.status(400).json({ message: "Cannot remove stock of non-existent material" });
      }
    }

    await warehouse.save();
    res.status(200).json({ success: true, message: "Inventory updated successfully", data: warehouse });
    } catch (err) {
      await createLog("ERROR", err.message, "Warehouse Module", { 
        stack: err.stack, 
        inputData: req.body, 
        user: req.user ? req.user._id : "Guest" 
      });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 5. UPDATE WAREHOUSE DETAILS
exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await warehouseModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });

    res.status(200).json({ success: true, message: "Details updated", data: warehouse });
  } catch (err) {
    await createLog("ERROR", err.message, "Warehouse Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 6. DELETE WAREHOUSE
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await warehouseModel.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });

    res.status(200).json({ success: true, message: "Warehouse deleted successfully" });
    } catch (err) {
      await createLog("ERROR", err.message, "Warehouse Module", { 
        stack: err.stack, 
        inputData: req.body, 
        user: req.user ? req.user._id : "Guest" 
      });
    res.status(500).json({ success: false, message: err.message });
  }
};