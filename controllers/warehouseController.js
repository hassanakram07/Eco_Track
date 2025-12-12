const warehouseModel = require("../models/warehouse-model");

// CREATE WAREHOUSE
exports.createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity, metadata } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Warehouse name and location are required",
      });
    }

    const warehouse = await warehouseModel.create({
      name,
      location,
      capacity,
      metadata,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL WAREHOUSES
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await warehouseModel
      .find()
      .populate("createdBy", "firstName email");

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE WAREHOUSE
exports.getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await warehouseModel.findById(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    res.status(200).json({ success: true, data: warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE WAREHOUSE
exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await warehouseModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE WAREHOUSE
exports.deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await warehouseModel.findByIdAndDelete(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
