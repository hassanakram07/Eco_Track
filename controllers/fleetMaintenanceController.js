const maintenanceModel = require("../models/fleetMaintenance-model");
const fleetModel = require("../models/fleet-model");
const { createLog } = require("./logController");

// ✅ 1. Naya Maintenance Record Add Karna (Logistics/Admin Only)
exports.addMaintenanceRecord = async (req, res) => {
  try {
    const { 
      fleetId, serviceType, odometerKm, serviceCenter, 
      cost, nextServiceDue, notes, invoiceFile 
    } = req.body;

    // Record Create Karein
    const record = await maintenanceModel.create({
      fleetId,
      serviceType,
      odometerKm,
      serviceCenter,
      cost,
      nextServiceDue,
      notes,
      invoiceFile,
      createdBy: req.user._id
    });

    // Saath hi main Fleet Model mein lastServiceDate update karein
    await fleetModel.findByIdAndUpdate(fleetId, {
      lastServiceDate: Date.now(),
      status: "Active" // Service ke baad status active kar dein
    });

    res.status(201).json({
      success: true,
      message: "Maintenance record saved and vehicle status updated",
      data: record
    });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Maintenance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2. Kisi Specific Vehicle ki Service History dekhna
exports.getVehicleHistory = async (req, res) => {
  try {
    const { fleetId } = req.params;
    const history = await maintenanceModel
      .find({ fleetId })
      .populate("createdBy", "fullName")
      .sort({ serviceDate: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    await createLog("ERROR", err.message, "Fleet Maintenance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3. Maintenance Cost Report (Total kharcha dekhne ke liye)
exports.getMaintenanceCostReport = async (req, res) => {
  try {
    const report = await maintenanceModel.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          totalServices: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data: report[0] || { totalCost: 0, totalServices: 0 } });
    } catch (err) {
    await createLog("ERROR", err.message, "Fleet Maintenance Module", { 
      stack: err.stack, 
      inputData: req.body, 
      user: req.user ? req.user._id : "Guest" 
    });
    res.status(500).json({ success: false, message: err.message });
  }
};