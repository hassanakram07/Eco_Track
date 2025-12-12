const inventoryModel = require("../models/inventory-model");
const { findByIdAndDelete } = require("../models/pickupRequest-model");
const productModel = require("../models/product-model");
const warehouseModel = require("../models/warehouse-model");

exports.addInventory = async (req, res) => {
  try {
    const {
      productId,
      batchNumber,
      warehouseId,
      quantity,
      minLevel,
      maxLevel,
      metadata,
    } = req.body;

    const product = await productModel.findById(productId);
    const warehouse = await warehouseModel.findById(warehouseId);

    if (!product || !warehouse) {
      return res
        .status(400)
        .json({ success: false, message: "Product Or Warehouse Not Found" });
    }

    const inventory = await inventoryModel.create({
      productId,
      batchNumber,
      warehouseId,
      quantity,
      minLevel,
      maxLevel,
      metadata,
      lastUpdatedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Inventory record added successfully",
      data: inventory,
    });
  } catch (err) {
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
    res.status(500).json({ success: false, message: err.message });
  }
};
