const transactionModel = require("../models/inventoryTransaction-model");
const inventoryModel = require("../models/inventory-model");
const { createLog } = require("./logController");

// ✅ 1. Nayi Transaction Record Karna (Stock IN/OUT/ADJUST)
exports.createTransaction = async (req, res) => {
  try {
    const { 
      transactionCode, productId, warehouseId, 
      type, quantity, referenceId, notes 
    } = req.body;

    // 1. Transaction Create Karein
    const transaction = await transactionModel.create({
      transactionCode,
      productId,
      warehouseId,
      type,
      quantity,
      referenceId,
      notes,
      performedBy: req.user._id // Logged in staff member
    });

    // 2. Inventory Update Karein (Logic based on Type)
    let updateAmount = quantity;
    if (type === "OUT") updateAmount = -quantity; // Stock bahar ja raha hai toh minus

    // Inventory dhundain ya nayi banain
    await inventoryModel.findOneAndUpdate(
      { productId, warehouseId },
      { 
        $inc: { quantity: updateAmount },
        lastUpdatedBy: req.user._id,
        lastUpdatedAt: Date.now()
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: `Stock ${type} transaction completed successfully`,
      data: transaction
    });
   } catch (err) {
    await createLog("ERROR", err.message, "Inventory Transaction Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Product ki Transaction History dekhna
exports.getProductHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const history = await transactionModel
      .find({ productId })
      .populate("warehouseId", "name location")
      .populate("performedBy", "firstName lastName")
      .sort({ performedAt: -1 });

    res.status(200).json({ success: true, count: history.length, data: history });
   } catch (err) {
    await createLog("ERROR", err.message, "Inventory Transaction Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Warehouse-wise Transactions dekhna
exports.getWarehouseTransactions = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const logs = await transactionModel.find({ warehouseId }).populate("productId", "name sku");
    res.status(200).json({ success: true, data: logs });
   } catch (err) {
    await createLog("ERROR", err.message, "Inventory Transaction Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};