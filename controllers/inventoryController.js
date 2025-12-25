const inventoryModel = require("../models/inventory-model");
const { findByIdAndDelete } = require("../models/pickupRequest-model");
const productModel = require("../models/product-model");
const warehouseModel = require("../models/warehouse-model");
const { createLog } = require("./logController");

exports.addInventory = async (req, res) => {
  try {
    const {
      productId,
      material, // From frontend text
      batchNumber,
      warehouseId,
      location, // From frontend text
      quantity,
      minLevel,
      maxLevel,
      metadata,
    } = req.body;

    // Optional: Try to resolve IDs if provided, but don't error if missing
    let resolvedProduct = null;
    let resolvedWarehouse = null;

    if (productId) {
      resolvedProduct = await productModel.findById(productId);
    }
    if (warehouseId) {
      resolvedWarehouse = await warehouseModel.findById(warehouseId);
    }

    const inventory = await inventoryModel.create({
      productId: resolvedProduct ? productId : undefined,
      materialName: material || (resolvedProduct ? resolvedProduct.name : "Unknown Material"),
      warehouseId: resolvedWarehouse ? warehouseId : undefined,
      location: location || (resolvedWarehouse ? resolvedWarehouse.name : "Unknown Location"),
      batchNumber,
      quantity,
      minLevel,
      maxLevel,
      metadata,
      lastUpdatedBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Inventory record added successfully",
      data: inventory,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Inventory Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityChange } = req.body;

    const inventory = await inventoryModel.findById(id);
    if (!inventory) {
      return res
        .status(400)
        .json({ success: false, message: "Inventory record not found" });
    }

    inventory.quantity += quantityChange;
    inventory.lastUpdatedAt = Date.now();
    inventory.lastUpdatedBy = req.user._id;
    await inventory.save();
  } catch (err) {
    await createLog("ERROR", err.message, "Inventory Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await inventoryModel.findByIdAndDelete(id);
    if (!inventory) {
      res
        .status(400)
        .json({ success: false, message: "Inventory record not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Inventory Deleted Successfully" });
    }
  } catch (err) {
    await createLog("ERROR", err.message, "Inventory Module", {
      stack: err.stack,
      inputData: req.body,
      user: req.user ? req.user._id : "Guest"
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find()
      .populate("productId", "name category") // Assuming product has name and category
      .populate("warehouseId", "name code"); // Assuming warehouse has name and code

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Inventory Module", {
      stack: err.stack,
      user: req.user ? req.user._id : "Guest",
    });
    res.status(500).json({ success: false, message: err.message });
  }
};
